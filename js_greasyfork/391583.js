// ==UserScript==
// @name       智能选择
// @author       http://daviddengcn.com/
// @secondary development ChandlerVer5
// @namespace   https://greasyfork.org/users/183871
// @version    0.0.1
// @description  鼠标简单选取即可把外币、英制长度、英制重量、华氏温度和油耗等转换为个人更习惯的单位（人民币、公制和摄氏度等）
// @noframes
// @include             *
// @exclude             *www.w3school.com.cn*
// @run-at              document-end
// @grant    GM_addStyle
// @grant    GM_setClipboard
// @grant    GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/391583/%E6%99%BA%E8%83%BD%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/391583/%E6%99%BA%E8%83%BD%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==

!function (argument) {
	window.MagicSel = {};
	// ===============

	if (typeof IS_TESTING == "undefined") {
    IS_TESTING = false;
	}

function calc_default_lang() {
    switch (window.navigator.language) {
        case 'zh-CN': case 'zh_TW': case 'zh': case 'ja':
            return 'cn';
    }
    
    return 'en';
}

// The significant number
g_sig_numbers = 3;
// Systems: imp->imperial system, std->metric(international) system, us->US system
g_dest_sys = 'std';
// Language: en->English, cn->Chinese
g_lang = calc_default_lang();
// Target currency:
//     dollar/euro/pound/hkd/yen/sfr/sgd/sek/dkk/nok/cad/aud/mop/php/nzd/krw/rouble/rmb
g_target_cur = 'rmb';

// 1->number, 2->mul
g_pure_number = '[0-9,]+[.]?|[0-9,]*[.][0-9]+|[0-9.]+[,][0-9][0-9]'
g_number_exp = '((?:' + g_pure_number + ')(?:\\s+(?:' + g_pure_number + ')\\s*/\\s*(?:' + g_pure_number + '))?)\\s*(十|百|千|万|十万|百万|千万|亿|十亿|百亿|千亿|万亿|million|m|trillion|t|billion|b|thousand|k)?';
// match: (1) (2)/(3)
g_frac_num_re = new RegExp('(' + g_pure_number + ')\\s+(' + g_pure_number + ')\\s*/\\s*(' + g_pure_number + ')')

function ex_digits_from_mul_str(mul) {
	mul = (mul || "").trim();
	var ex_digits = 0;
	switch (mul) {
	    case '十':
    		ex_digits = 1;
    		break;
	    case '百':
    		ex_digits = 2;
    		break;
	    case '千': case 'thousand': case 'k':
    		ex_digits = 3;
    		break;
	    case '万':
    		ex_digits = 4;
    		break;
    	case '十万':
    		ex_digits = 5;
    		break;
    	case '百万': case 'million': case 'm':
    		ex_digits = 6;
    		break;
    	case '千万':
    		ex_digits = 7;
    		break;
    	case '亿':
    		ex_digits = 8;
    		break;
    	case '十亿': case 'billion': case 'b':
    		ex_digits = 9;
    		break;
    	case '百亿':
    		ex_digits = 10;
    		break;
    	case '千亿':
    		ex_digits = 11;
    		break;
    	case '万亿': case 'trillion': case 't':
    		ex_digits = 12;
    		break;
	}
	
	return ex_digits;
}

function remove_trailing_zeros(s) {
    var dot = s.indexOf('.');
    if (dot < 0) {
        return s;
    }
    
    p = s.length - 1;
    while (s[p] == '0') {
        p --;
    }
    
    if (p == dot) {
        p --;
    }
    
    return s.substr(0, p + 1);
}

function raw_render_number(val, sep, sig_numbers) {
    var s = '';
    if (val < 1) {
        var lg = Math.log(val)/Math.LN10;
        var n = Math.round(-lg + sig_numbers);
        s = val.toFixed(n);
    } else {
        var lg = Math.log(val)/Math.LN10;
        var n = Math.round(sig_numbers - lg);
        if (n > 0) {
            s = val.toFixed(n);
            while (s && s[s.length - 1] == '0') {
                s = s.substr(0, s.length - 1);
            }
            if (s && s[s.length - 1] == '.') {
                s = s.substr(0, s.length - 1);
            }
        } else {
            s = val.toFixed(0);
        }
    }
    
    s = remove_trailing_zeros(s);
    
    if (sep > 0) {
        var dot = s.indexOf('.');
        if (dot < 0) {
            dot = s.length;
        }
        
        dot -= sep;
        while (dot > 0) {
            s = s.substr(0, dot) + "," + s.substr(dot);
            dot -= sep;
        }
    }
    
    return s;
}

g_lang_info = {
    cn: {
        render_number: function(val, sig_numbers) {
            var neg = val < 0;
            val = Math.abs(val);
            if (val < 1e-20) {
                return "0";
            }
            
            var suffix = '';
            if (val >= 1e12) {
                suffix = "万亿";
                val /= 1e12;
            } else if (val >= 1e8) {
                suffix = "亿";
                val /= 1e8;
            } else if (val >= 1e4) {
                suffix = "万";
                val /= 1e4;
            }
            
            var s = raw_render_number(val, -1, sig_numbers) + suffix;
            if (neg) {
                s = '-' + s;
            }
            
            return s;
        }
    },
    en: {
        render_number: function(val, sig_numbers) {
            var neg = val < 0;
            val = Math.abs(val);
            if (val < 1e-20) {
                return "0";
            }
            
            var s = raw_render_number(val, 3, sig_numbers);
            if (neg) {
                s = '-' + s;
            }
            
            return s;
        }
    }
} // g_lang_info

// the regular expression for extracting fmt string for plural representations
// e.g. '[pound,pounds]' in fmt fields.
var g_plural_reg = /^(.*)\[(.*)\](.*)$/;

function number_render(val, fmt, sig_numbers) {
    var var_s = g_lang_info[g_lang].render_number(val, sig_numbers);
    if (fmt.length == undefined) {
        fmt = fmt[g_lang];
    }
    var m = fmt.match(g_plural_reg);
    
    if (m) {
        var pts = m[2].split(',');
        if (parseFloat(var_s) > 1 && pts.length > 1) {
            m[2] = pts[1];
        } else {
            m[2] = pts[0];
        }
        fmt = m[1] + m[2] + m[3];
    }
    
    return fmt.replace("{}", var_s);
}

// some shared constants
LIQUIDVOLUME_US_GAL_RATE = 0.003785411784;
LIQUIDVOLUME_IMP_GAL_RATE = 0.00454609;
LEN_IMP_MILE_RATE = 1609.344;
SECONDS_PER_HOUR = 3600;

// constants for metric conversion, default base is international standard(std)
// if contains groups, use ?: after (
g_metrics = {
    liquidvolume: {
        us: {
            units: {
                gal: {
                    rate: LIQUIDVOLUME_US_GAL_RATE,
                    suffixes: ['嗧', '加仑', '美制加仑', 'gallons?', 'gal[.]?'],
                    fmt: {en: '{} US gal.', cn: '{}美制加仑'}
                },
                quart: {
                    rate: 0.000946353,
                    suffixes: ['夸脱', '美制夸脱', 'quarts?'],
                    fmt: {en: '{} US [quart,quarts]', cn: '{}美制夸脱'}
                },
                pint: {
                    rate: 0.000473176,
                    suffixes: ['品脱', '美制品脱', 'pints?'],
                    fmt: {en: '{} US [pint,pints]', cn: '{}美制品脱'}
                },
                cup: {
                	nondst: true,
                    rate: 0.000236588,
                    suffixes: ['杯', '美制杯', 'cups?'],
                    fmt: {en: '{} US [cup,cups]', cn: '{}美制杯'}
                },
                oz: {
                    rate: 0.0000295735295625,
                    suffixes: ['液体盎司', '美制液体盎司', 'ounces?', 'fl[.]? oz[.]?', '℥', 
                        'fl? ?℥'],
                    fmt: {en: '{} US fl oz', cn: '{}美制液体盎司'}
                },
                tbsp: {
                	nondst: true,
                    rate: 0.0000147868,
                    suffixes: ['汤匙', '美制汤匙', 'tablespoons?', 'tbsp[.]?'],
                    fmt: {en: '{} US tbsp.', cn: '{}美制汤匙'}
                },
                tsp: {
                    rate: 0.00000492892,
                    suffixes: ['茶匙', '美制茶匙', 'teaspoons?', 'tsp[.]?'],
                    fmt: {en: '{} US tsp.', cn: '{}美制茶匙'}
                },
            }
        },
        imp: {
            units: {
                gal: {
                    rate: LIQUIDVOLUME_IMP_GAL_RATE,
                    suffixes: ['嗧', '加仑', '英制加仑', 'gallons?', 'gal[.]?'],
                    fmt: {en: '{} gal.', cn: '{}英制加仑'}
                },
                quart: {
                    rate: 0.00113652,
                    suffixes: ['夸脱', '英制夸脱', 'quarts?'],
                    fmt: {en: '{} [quart,quarts]', cn: '{}英制夸脱'}
                },
                pint: {
                    rate: 0.000568261,
                    suffixes: ['品脱', '英制品脱', 'pints?'],
                    fmt: {en: '{} [pint,pints]', cn: '{}英制品脱'}
                },
                oz: {
                    rate: 0.0000284130625,
                    suffixes: ['液体盎司', '英制液体盎司', 'ounces?', 'fl[.]? oz[.]?', '℥', 
                        'fl? ?℥'],
                    fmt: {en: '{} fl oz', cn: '{}英制液体盎司'}
                },
                tbsp: {
                	nondst: true,
                    rate: 0.0000177582,
                    suffixes: ['汤匙', '英制汤匙', 'tablespoons?', 'tbsp[.]?'],
                    fmt: {en: '{} tbsp.', cn: '{}英制汤匙'}
                },
                tsp: {
                    rate: 0.00000591939,
                    suffixes: ['茶匙', '英制茶匙', 'teaspoons?', 'tsp[.]?'],
                    fmt: {en: '{} tsp.', cn: '{}英制茶匙'}
                }
            }
        },
        std: {
            units: {
                l: {
                    rate: 1e-3,
                    suffixes: ['升', 'l[.]?', 'lit[re][re]s?', 'dm³'],
                    fmt: {en: '{} L', cn: '{}升'}
                },
                ml: {
                    rate: 1e-6,
                    suffixes: ['毫升', 'ml[.]?', 'millilit[re][re]s?', 'cm³', '㎤'],
                    fmt: {en: '{} mL', cn: '{}毫升'}
                }
            }
        }
    }, // liquidvolume
    volume: {
        imp: {
            units: {
                cubicmile: {
                    rate: LEN_IMP_MILE_RATE*LEN_IMP_MILE_RATE*LEN_IMP_MILE_RATE,
                    suffixes: ['立方[哩迈]', '立方英里', 'cuibic miles?', 'mi[.]?³'],
                    fmt: {en: '{} mi³', cn: '{}立方英里'}
                },
                cubicfoot: {
                    rate: 0.3048*0.3048*0.3048,
                    suffixes: ['立方呎', '立方英尺', 'cubic f[eo][eo]t', 'ft[.]?³'],
                    fmt: {en: '{} ft³', cn: '{}立方英尺'}
                },
                cubicinch: {
                    rate: 0.0254*0.0254*0.0254,
                    suffixes: ['立方吋', '立方英寸', 'cubic inche?s?', 'in[.]?³'],
                    fmt: {en: '{} in³', cn: '{}立方英寸'}
                },
                cubicyard: {
                	nondst: true,
                    rate: 0.9144*0.9144*0.9144,
                    suffixes: ['立方码', 'cubic yards?', 'yd[.]?³'],
                    fmt: {en: '{} yd³', cn: '{}立方码'}
                },
            }
        },
        std: {
            units: {
                cbkm: {
                    rate: 1e9,
                    suffixes: ['立方千米', '立方公里', 'cubic kilomet[er][er]s?', 'km[.]?³', '[㎞㏎]³'],
                    fmt: {en: '{} km³', cn: '{}立方千米'}
                },
                cbm: {
                    rate: 1,
                    suffixes: ['立?方米?', '方', '立方公尺', 'cubic met[er][er]s?', 'm[.]?³'],
                    fmt: {en: '{} m³', cn: '{}立方米'}
                },
                cbdm: {
                	nondst: true,
                    rate: 1e-3,
                    suffixes: ['立方分米', 'cubic decimet[er][er]s?', 'dm[.]?³'],
                    fmt: {en: '{} dm³', cn: '{}立方分米'}
                },
                cbcm: {
                    rate: 1e-6,
                    suffixes: ['立方厘米', '立方公分', 'cubic centimet[er][er]s?', 'cm[.]?³', '㎝³'],
                    fmt: {en: '{} cm³', cn: '{}立方厘米'}
                },
                cbmm: {
                    rate: 1e-9,
                    suffixes: ['立方毫米', '立方公厘', 'cubic millimet[er][er]s?', 'mm[.]?³', '㎜³'],
                    fmt: {en: '{} mm³', cn: '{}立方毫米'}
                },
                cbum: {
                    rate: 1e-18,
                    suffixes: ['立方微米', 'cubic micromet[er][er]s?', '[μu]m[.]?³'],
                    fmt: {en: '{} μm³', cn: '{}立方微米'}
                },
            }
        }
    }, // volume
    mass: {
        imp: {
            units: {
                oz: {
                    rate: 0.028349523125,
                    suffixes: ['盎司', 'ounces?', 'oz[.]?', '℥'],
                    fmt: {en: '{} oz', cn: '{}盎司'}
                },
                pound: {
                    rate: 0.45359237,
                    suffixes: ['英?磅', 'pounds?', 'lbs?'],
                    fmt: {en: '{} [lb,lbs]', cn: '{}英磅'}
                },
                stone: {
                	nondst: true,
                    rate: 6.35029,
                    suffixes: ['英石', 'stones?', 'st[.]?'],
                    fmt: {en: '{} st', cn: '{}英石'}
                }
            }
        },
        chn: {
        	units: {
				jin: {
                	nondst: true,
                    rate: 0.5,
                    suffixes: ['斤'],
                    fmt: {en: '{} jin', cn: '{}斤'}
                },
                liang: {
                	nondst: true,
                    rate: 0.05,
                    suffixes: ['两'],
                    fmt: {en: '{} liang', cn: '{}两'}
                },
                qian: {
                	nondst: true,
                    rate: 0.005,
                    suffixes: ['钱'],
                    fmt: {en: '{} qian', cn: '{}钱'}
                }
        	}
        },
        std: {
            units: {
                ton: {
                    rate: 1000,
                    suffixes: ['吨', 'tons?'],
                    fmt: {en: '{} [ton,tons]', cn: '{}吨'}
                },
                kg: {
                    rate: 1,
                    suffixes: ['千克', '公斤', 'kg[.]?', 'kilograms?', '㎏'],
                    fmt: {en: '{} kg', cn: '{}公斤'}
                },
                g: {
                    rate: 1e-3,
                    suffixes: ['克', 'g[.]?', 'grams?'],
                    fmt: {en: '{} g', cn: '{}克'}
                },
                mg: {
                    rate: 1e-6,
                    suffixes: ['毫克', 'mg[.]?', 'milligrams?', '㎎'],
                    fmt: {en: '{} mg', cn: '{}毫克'}
                },
                mcg: {
                    rate: 1e-9,
                    suffixes: ['微克', 'mcg[.]?', '[uµ]g[.]?', 'micrograms?'],
                    fmt: {en: '{} µg', cn: '{}微克'}
                }
            }
        }
    }, // mass
    area: {
        imp: {
            units: {
                sqmi: {
                    rate: LEN_IMP_MILE_RATE*LEN_IMP_MILE_RATE,
                    suffixes: ['square miles?', 'sq ?mi[.]?', '平方英里', 'mi²', 
                        '平方[哩迈]'],
                    fmt: {en: '{} mi²', cn: '{}平方英里'}
                },
                sqft: {
					rate: 0.3048*0.3048,
					suffixes: ['square f[eo][eo]t', 'sq[.]? ?ft[.]?', '平方英尺', '平方呎', 
					    'ft²'],
					fmt: {en: '{} ft²', cn: '{}平方英尺'}
                },
                sqinch: {
                    rate: 0.0254*0.0254,
                    suffixes: ['平方吋', '平方英寸', 'square inche?s?', 'in[.]?²'],
                    fmt: {en: '{} in²', cn: '{}平方英寸'}
                },
                sqyard: {
                	nondst: true,
                    rate: 0.9144*0.9144,
                    suffixes: ['平方码', 'square yards?', 'yd[.]?²'],
                    fmt: {en: '{} yd²', cn: '{}平方码'}
                },
                acre: {
                	nondst: true,
					rate: 4046.8564224,
					suffixes: ['acres?', 'ac[.]?', '英亩'],
					fmt: {en: '{} [acre,acres]', cn: '{}英亩'}
                },
            }
        },
        cn: {
            units: {
                cnacre: {
                    nondst: true,
                    rate: 666.6667,
                    suffixes: ['亩'],
                    fmt: {en: '{} mu', cn: '{}亩'}
                },
            }
        },
        std: {
            units: {
                sqkm: {
                    rate: 1000*1000,
                    suffixes: ['square kilomet[er][er]s?', 'km', 'sq ?km[.]?', '平方千米',
                        '平方公里', '㎢'],
                    fmt: {en: '{} km²', cn: '{}平方公里'}
                },
                ha: {
                    nondst: true,
                    rate: 1e4,
                    suffixes: ['hectare', 'ha', '公顷'],
                    fmt: {en: '{} ha', cn: '{}公顷'}
                },
                sqm: {
                    rate: 1,
                    suffixes: ['square met[er][er]s?', 'sqm[.]?', 'm²', '平方米', '[方平]', '㎡'],
                    fmt: {en: '{} m²', cn: '{}平方米'}
                },
                sqdm: {
                	nondst: true,
                    rate: 0.1*0.1,
                    suffixes: ['平方分米', 'square decimet[er][er]s?', 'dm²'],
                    fmt: {en: '{} dm²', cn: '{}平方分米'}
                },
                sqcm: {
                    rate: 1e-4,
                    suffixes: ['平方厘米', 'square centimet[er][er]s?', 'cm²', '㎠'],
                    fmt: {en: '{} cm²', cn: '{}平方厘米'}
                },
                sqmm: {
                    rate: 1e-6,
                    suffixes: ['平方毫米', 'square millimet[er][er]s?', 'mm²', '㎟'],
                    fmt: {en: '{} mm²', cn: '{}平方毫米'}
                }
            }
        }
    }, // area
    len: {
        imp: {
            units: {
                mile: {
                    rate: LEN_IMP_MILE_RATE,
                    suffixes: ['[哩迈]', '英里', 'miles?', 'mi[.]?'],
                    fmt: {en: '{} mi', cn: '{}英里'}
                },
                foot: {
                    rate: 0.3048,
                    suffixes: ['呎', '英?尺', 'f[eo][eo]t', 'ft[.]?', "'"],
                    smaller: 'inch',
                    fmt: {en: '{} ft', cn: '{}英尺'}
                },
                inch: {
                    rate: 0.0254,
                    suffixes: ['吋', '英?寸', 'inche?s?', 'in[.]?', '"', "''"],
                    fmt: {en: '{} in', cn: '{}英寸'}
                },
                yard: {
                	nondst: true,
                    rate: 0.9144,
                    suffixes: ['码', 'yards?', 'yd[.]?'],
                    fmt: {en: '{} yd', cn: '{}码'}
                }
            }
        },
        chn: {
            units: {
                li: {
                    rate: 500,
                    suffixes: ['里'],
                    fmt: {en: '{} li', cn: '{}里'}
                },
                zhang: {
                    rate: 3.3333333333,
                    suffixes: ['丈'],
                    fmt: {en: '{} zhang', cn: '{}丈'}
                },
                chi: {
                    rate: 0.3333333333,
                    suffixes: ['市?尺'],
                    smaller: 'cun',
                    fmt: {en: '{} chi', cn: '{}尺'}
                },
                cun: {
                    rate: 0.03333333333,
                    suffixes: ['市?寸'],
                    fmt: {en: '{} cun', cn: '{}寸'}
                }
            }
        },
        std: {
            units: {
                km: {
                    rate: 1000,
                    suffixes: ['千米', '公里', 'kilomet[er][er]s?', 'km[.]?', '[㎞㏎]'],
                    fmt: {en: '{} km', cn: '{}公里'}
                },
                m: {
                    rate: 1,
                    suffixes: ['米', '公尺', 'met[er][er]s?', 'm[.]?'],
                    smaller: 'dm',
                    fmt: {en: '{} m', cn: '{}米'}
                },
                dm: {
                	nondst: true,
                    rate: 0.1,
                    suffixes: ['分米', 'decimet[er][er]s?', 'dm[.]?'],
                    fmt: {en: '{} dm', cn: '{}分米'}
                },
                cm: {
                    rate: 1e-2,
                    suffixes: ['厘米', '公分', 'centimet[er][er]s?', 'cm[.]?', '㎝'],
                    fmt: {en: '{} cm', cn: '{}厘米'}
                },
                mm: {
                    rate: 1e-3,
                    suffixes: ['毫米', '公厘', 'millimet[er][er]s?', 'mm[.]?', '㎜'],
                    fmt: {en: '{} mm', cn: '{}毫米'}
                },
                um: {
                    rate: 1e-6,
                    suffixes: ['微米', 'micromet[er][er]s?', '[μu]m[.]?'],
                    fmt: {en: '{} μm', cn: '{}微米'}
                }
            }
        }
    }, // len
    fuel: { // base: meter^3 per meter
    	us: {
    		units: {
				mpg: {
					rev_rate: LIQUIDVOLUME_US_GAL_RATE/LEN_IMP_MILE_RATE,
					suffixes: ['(?:est[.]? )?mpg(?:[(]us[)])?',
							   '(?:est[.]? )?miles? per (us )?gallon',
							   '(?:[哩迈]|英里)(?:每|/)(?:美制)?加仑'],
					fmt: {en: '{} MPG(US)', cn: '{}英里/美制加仑'}
				}
    		}
    	},
    	imp: {
    		units: {
				mpg: {
					rev_rate: LIQUIDVOLUME_IMP_GAL_RATE/LEN_IMP_MILE_RATE,
					suffixes: ['(?:est[.]? )?mpg', '(?:est[.]? )?miles? per (?:imp )?gallon',
					           '(?:[哩迈]|英里)(?:每|/)(英制)?加仑'],
					fmt: {en: '{} MPG(imp)', cn: '{}英里/英制加仑'}
				}
    		}
    	},
    	std: {
    		units: {
				lp100km: {
					rate: 1e-8,
					suffixes: ['(?:est[.]? )?L(?:p|/)100km', '个[油字]', '升每百(公里|千米)'],
					fmt: {en: '{} L/100km', cn: '{}升/百公里'}
				}
    		}
    	},
    	tw: {
    		units: {
				kmpl: {
					rev_rate: 1e-6,
					suffixes: ['(?:est[.]? )?kmpl', '(?:est[.]? )?km/L', '(?:公里|千米)每升'],
					fmt: {en: '{} km/L', cn: '{}千米/升'}
				}
    		}
    	},
    }, // fuel
    speed: { // base: meter/second
    	imp: {
    		units: {
    			mph: {
					rate: LEN_IMP_MILE_RATE/SECONDS_PER_HOUR,
					suffixes: ['mph', '(?:[哩迈]|英里)每小时'],
					fmt: {en: '{} MPH', cn: '{}英里/小时'}
    			}
    		}
    	},
    	std: {
    		units: {
    			kmph: {
    				rate: 1e3/SECONDS_PER_HOUR,
    				suffixes: ['kmph', '(?:公里｜千米)每小时'],
					fmt: {en: '{} km/H', cn: '{}千米/小时'}
    			}
    		}
    	}
    }
} // g_metrics

function is_letter(c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

// is_euro_sep checks whether s is a European style number: 1.234,56 (== 1234.56)
function is_euro_sep(s) {
    if (s.length < 4 || s[s.length-3] != ',') {
        // too short or not comma, false
        return false;
    }
    
    s = s.substr(0, s.length - 3)
    if (s.indexOf(',') >= 0) {
        // More than one comma, false
        return false;
    }
    
    return true;
}

// str2num converts a number text into a float number.
// Remove seperators (standard or Europeon style) if any.
function str2num(s) {
    s = s.trim()
    
    var m = s.match(g_frac_num_re);
    if (m) {
        return parseFloat(m[1].replace(/,/gm, '')) + parseFloat(m[2].replace(/,/gm, ''))/parseFloat(m[3].replace(/,/gm, ''))
    }
    
    if (is_euro_sep(s)) {
        return parseFloat(s.replace(/[.]/gm, '').replace(/,/gm, '.'))
    } else {
        return parseFloat(s.replace(/,/gm, ''))
    }
}

function entry_of_orgmul(org, mul) {
	var val = str2num(org);
	var ex_digits = ex_digits_from_mul_str(mul);
	while (ex_digits > 0) {
		val *= 10;  ex_digits --;
	}
	return {
		org: org,
		mul: mul,
		val: val
	}
}

// the set of ambiguous units. e.g. 千克 could be parsed as 千 克
g_ambiguous_units = {
        '千克': true,
        '千米': true
};

// parse_suffix_entry parses the text as a number with a suffix regexp
// return null if failed.
// the match matrix of regexp is supposed: 1->org, 2->mul, 3->gap, 4->[tp]
function parse_suffix_entry(text, reg) {
    var mat = text.match(reg);
    if (mat) {
        var mul = safe_to_lower_case(mat[2]);
        var tp = safe_to_lower_case(mat[4]);
        var gap = mat[3];
        if (tp && mul && !gap) {
            if (is_letter(mul[mul.length - 1]) && is_letter(tp[0])) {
            	// tp and mul (both letters) are seperated by nothing (!gap), this is a wrong match
                return null;
            }
            
            if (g_ambiguous_units[mul + tp]) {
                return null;
            }
        }
        
        return entry_of_orgmul(mat[1], mul);
    } // if
    return null
}

// parse_prefix_entry parses the text as a number with a prefix regexp
// return null if failed.
// the match matrix of regexp is supposed: 2->org, 3->mul
function parse_prefix_entry(text, reg) {
    var mat = text.match(reg);
    if (mat) {
        return entry_of_orgmul(mat[2], safe_to_lower_case(mat[3]));
    } // if
    return null
}

// reg: 1->org, 2->mul, 3->gap, 4->tp, 5->small-org, 6->small-mul
function parse_suffix_with_smaller(text, reg) {
    var mat = text.match(reg);
    if (mat) {
        var mul = safe_to_lower_case(mat[2]);
        var tp = safe_to_lower_case(mat[4]);
        var gap = mat[3];
        if (tp && mul && !gap) {
            if (is_letter(mul[mul.length - 1]) && is_letter(tp[0])) {
            	// tp and mul (both letters) are seperated by nothing (!gap), this is a wrong match
                return null;
            }
            
            if (g_ambiguous_units[mul + tp]) {
                return null;
            }
        }
        
        return {
        	cur: entry_of_orgmul(mat[1], mul),
        	smaller: entry_of_orgmul(mat[5], safe_to_lower_case(mat[6]))
        }
    } // if
    return null
}
// value_score calculates how well a value is to be read.
// The larger score the better. Could be negative.
function value_score(val) {
    val = Math.abs(val);
    if (val < 1e-15) {
        return 0;
    }
    
    var lg = Math.log(val) / Math.LN10;
    
    var score = 0;
    if (val < 0.9) {
        score -= 1;
        lg = -lg;
    }
    
    score -= Math.abs(lg); 
    return score;
}

// metric_convert chooses the best final unites and convert the value to it.
function metric_convert(val, dst_si) {
    var cnv = null;
    var best_score = 0;
    for (var dst_u in dst_si.units) {
        var dst_ui = dst_si.units[dst_u];
        if (dst_ui.nondst) {
        	continue;
        }
        var dst_val;
        if (dst_ui.rate) {
        	dst_val = val / dst_ui.rate;
        } else {
        	dst_val = dst_ui.rev_rate / val;
        }
        var score = value_score(dst_val);
        if (!cnv || score > best_score) {
            best_score = score;
            cnv = number_render(dst_val, dst_ui.fmt, g_sig_numbers);
        }
    }
    return cnv;
}

function convert_to_standard(text, si) {
	var found = false
	var res
	for (var u in si.units) {
		var ui = si.units[u]
		var ent = parse_suffix_entry(text, ui.suffix_reg)
		if (ent) {
			if (found) {
				// ambiguous, give up
				return null
			}
			var val;
			if (ui.rate) {
				val = ui.rate * ent.val
			} else {
				val = ui.rev_rate / ent.val
			}
			res = {
				val: val,
				in: number_render(ent.val, ui.fmt, 15)
			}
			found = true
		}
	}
	if (!found) {
		return null
	}
	return res
}

function cat_units(v1, v2) {
	if (is_letter(v1[v1.length - 1])) {
		v1 += ' ';
	}
	return v1 + v2;
}

function check_dbl_units(res, text, si, dst_si) {
	var mat = text.match(si.dbl_units_reg)
	if (mat) {
		var unit1 = mat[1];
		var unit2 = mat[1 + (mat.length - 1)/2];

		var val = 0;
		var val1 = convert_to_standard(unit1, si);
		if (!val1) {
			return res;
		}
		val += val1.val;
		var val2 = convert_to_standard(unit2, si);
		if (!val2) {
			return res;
		}
		val += val2.val;
		
		cnv = metric_convert(val, dst_si);
		if (cnv) {
			res = append_line(res, cat_units(val1.in, val2.in), cnv);
		}
	}
	return res
}

// check_metric tries to convert the normalized text into destination system value.
function check_metric(res, text) {
	var cnvs = [];
	for (var m in g_metrics) {
		var mi = g_metrics[m];
		var dst_si = mi[g_dest_sys];
		if (!dst_si) {
			dst_si =  mi.imp;
		}
		for (var s in mi) {
			if (s == g_dest_sys) {
					continue;
			}
			var si = mi[s];
			for (var u in si.units) {
				var ui = si.units[u];
				var ent = parse_suffix_entry(text, ui.suffix_reg);
				if (ent) {
					var val;
					if (ui.rate) {
						val = ui.rate * ent.val;
					} else {
						val = ui.rev_rate / ent.val;
					}
					cnv = metric_convert(val, dst_si);
					if (cnv) {
						res = append_line(res, number_render(ent.val, ui.fmt, 15), cnv);
					}
				}
				if (ui.smaller) {
					ent = parse_suffix_with_smaller(text, ui.suffix_with_smaller_reg)
					if (ent) {
						var val;
						if (ui.rate) {
							val = ui.rate * ent.cur.val;
						} else {
							val = ui.rev_rate / ent.cur.val;
						}
						var inp = number_render(ent.cur.val, ui.fmt, 15);
						
						ui_smaller = si.units[ui.smaller];
						if (ui_smaller.rate) {
							val += ui_smaller.rate * ent.smaller.val;
						} else {
							val += ui_smaller.rev_rate / ent.smaller.val;
						}
						inp += number_render(ent.smaller.val, ui_smaller.fmt, 15);
						
						cnv = metric_convert(val, dst_si);
						if (cnv) {
							res = append_line(res, inp, cnv);
						}
					}
				}
			}
			res = check_dbl_units(res, text, si, dst_si)
		}
	}

	return res;
}

// set g_metrics[metric][system].units[unit].suffix_reg
function compile_metrics() {
    for (var m in g_metrics) {
        var mi = g_metrics[m];
        for (var s in mi) {
            var si = mi[s];
            var reg_any = '';
            for (var u in si.units) {
                var ui = si.units[u];
                var reg_str = '\\s*' + g_number_exp + '(\\s*)-?(' 
                	+ ui.suffixes.join('|') + ')\\s*';
                ui.suffix_reg = new RegExp('^' + reg_str + '$', 'i')
                ui.suffix_with_smaller_reg = new RegExp('^' + reg_str + '(?:\\s*)-?'
                	+ g_number_exp + '$', 'i')
                if (reg_any.length > 0) {
                	reg_any += '|'
                }
                reg_any += '(' + reg_str + ')'
            }
            si.dbl_units_reg = new RegExp('^(' + reg_any + ')(?:and|[+]|和|加)?('
            	+ reg_any + ')$', 'i')
        }
    }
}
compile_metrics();

// iso4217
g_defs = {
	aud: {name: {cn: "澳大利亚元", en: "Australian Dollar"}, rate: 653.63/100., fmt: 'A${}', prefixes: ['AUD', 'A$'], suffixes: ['澳大利亚[元圆币]', '澳[元圆币]?', 'Australian dollars?', 'aud']},
	cad: {name: {cn: "加拿大元", en: "Canadian Dollar"}, rate: 631.84/100., fmt: 'C${}', prefixes: ['CAD', 'C[$]'], suffixes: ['加拿大[元圆币]', '加[元圆币]?', 'Canadian dollars?', 'cad', 'c[$]']},
	dkk: {name: {cn: "丹麦克朗", en: "Denmark Krona"}, rate: 110.38/100., fmt: 'DKK {}', prefixes: ['DKK', 'kr', 'DKR'], suffixes: ['丹麦克朗', '丹麦[元圆币]', 'Denmark krona', 'Denmark kronor', 'dkk']},
	dollar: {name: {cn: "美元", en: 'US Dollar'}, rate: 628.55/100., fmt: '${}', prefixes: ['[$﹩＄]', 'US[D$﹩＄]'], suffixes: ['[美米][元圆币金刀]', '[刀米]', 'dollars?', '[$﹩＄]', 'US[$﹩＄D]']},
	euro: {name: {cn: "欧元", en: "Euro"}, rate: 831.76/100., fmt: '€{}', prefixes: ['€', 'EUR'], suffixes: ['欧[元圆币]?', 'euros?', '€', 'eur']},
	hkd: {name: {cn: "港币", en: "Hongkong Dollar"}, rate: 81.08/100., fmt: 'HK${}', prefixes: ['HKD', 'HK[$]'], suffixes: ['香?港[元圆币刀]', 'HK[D$]', 'Hongkong dollars?']},
	krw: {name: {cn: "韩国元", en: "South Korean Won"}, rate: 0.5868/100., fmt: 'KRW {}', prefixes: ['원', 'KRW'], suffixes: ['韩国?[元圆币]', '北韩[元圆币圜]', '원', 'wons?', 'krw']},
	mop: {name: {cn: "澳门元", en: "Macao Pataca"}, rate: 78.04/100., fmt: 'MOP${}', prefixes: ['MOP', 'MOP$'], suffixes: ['澳门[元圆币]', 'patacas?', 'Maca[ou] patacas?', 'mop']},
	nok: {name: {cn: "挪威克朗", en: "Norway Krona"}, rate: 111.59/100., fmt: 'NOK {}', prefixes: ['NOK', 'kr'], suffixes: ['挪威克朗', '挪威[元圆币]', 'Norway krona', 'Norway kronor', 'nok']},
	nzd: {name: {cn: "新西兰元", en: "New Zealand Dollar"}, rate: 512.98/100., fmt: 'NZ${}', prefixes: ['NZ[D$]'], suffixes: ['[纽新]西兰[元圆币]', '[纽新][元圆币]', 'kiwi', 'New Zealand dollars?', 'nz[d$]']},
	php: {name: {cn: "菲律宾比索", en: "Philippine Peso"}, rate: 15.16/100., fmt: '₱{}', prefixes: ['PHP', '₱'], suffixes: ['菲律宾[比披]索', '菲律宾[元圆币]', '菲国?[比披]索', '[比披]索', 'Philippine p[ie]sos?', 'p[ie]sos?', 'php', '₱']},
	pound: {name: {cn: "英镑", en: "British Pound Sterling"}, rate: 1016.11/100., fmt: '£{}', prefixes: ['[£￡]', 'GBP'], suffixes: ['英?镑', 'pounds?', 'GBP', '[£￡]']},
	rmb: {name: {cn: "人民币", en: "Chinese Yuan"}, rate: 1, fmt: 'RMB {}', prefixes: ['RMB', '[¥￥]'], suffixes: ['人民币[元圆]?', '[元圆¥￥]', 'rmb', 'cny', 'chinese yuan']},
	rouble: {name: {cn: "卢布", en: "Russian Ruble"}, rate: 20.61/100., fmt: 'RUB {}', prefixes: ['RUB', 'руб'], suffixes: ['卢布', '俄罗斯[元圆币]', 'roubles?', 'рубль', 'rubles?', 'rub']},
	sek: {name: {cn: "瑞典克朗", en: "Swedish Krona"}, rate: 95.72/100., fmt: 'SEK {}', prefixes: ['SEK', 'kr'], suffixes: ['瑞典克朗', '瑞朗', '瑞典[元圆币]', 'Swedish krona', 'Swedish kronor', 'sek']},
	sfr: {name: {cn: "瑞士法郎", en: "Swiss Franc"}, rate: 682.19/100., fmt: 'CHF {}', prefixes: ['CHF', 'SFR'], suffixes: ['瑞士法郎', '瑞士[元圆币]', 'Swiss francs?', 'sfr']},
	sgd: {name: {cn: "新加坡元", en: "Singapore Dollar"}, rate: 509.29/100., fmt: 'S${}', prefixes: ['S[$]', 'SGD'], suffixes: ['新加坡[元圆币]', '[新坡][元圆币]', 'Singapore dollars?', 'SGD', 's[$]']},
	thb: {name: {cn: "泰国铢", en: "Thai Baht"}, rate: 20.38/100., fmt: '฿{}', prefixes: ['THB', '฿', 'บาท'], suffixes: ['泰国?[铢元圆币]', 'Thai bahts?', 'thb', '฿']},
	yen: {name: {cn: "日元", en: "Japanese Yen"}, rate: 7.3049/100., fmt: '{}円', prefixes: ['JPY', '[円¥￥]'], suffixes: ['日本?[元圆币]', '[円¥￥]', 'yens?', 'jpy']},
}; // g_defs

function save_options() {
	localStorage['language'] = g_lang;
	localStorage['system'] = g_dest_sys;
	localStorage['sig-number'] = g_sig_numbers;
	localStorage['target-cur'] = g_target_cur;
}
    
function load() {
    var str = localStorage['language'];
    switch (str) {
        case 'cn': case 'en':
            g_lang = str;
    }
    str = localStorage['system'];
    switch (str) {
        case 'std': case 'imp': case 'us':
            g_dest_sys = str;
    }
    str = localStorage['sig-number'];
    var n = parseInt(str);
    if (n) {
		g_sig_numbers = parseInt(str);
    }
    str = localStorage['target-cur'];
    if (str && g_defs[str]) {
    	g_target_cur = localStorage['target-cur'];
    }
    
    g_rates = {};
    str = localStorage['rates'];
    var rates = {};
    if (str) {
    	rates = JSON.parse(str);
    }
    
    g_regs = {};
    
    for (var id in g_defs) {
    	g_rates[id] = rates[id] || g_defs[id].rate;
    	
    	g_regs[id] = {
    		pre: new RegExp('^\\s*(' + g_defs[id].prefixes.join('|') + ')\\s*' 
    			+ g_number_exp + '\\s*$', 'i'),
    		suf: new RegExp('^\\s*' + g_number_exp + '(\\s*)(' 
    			+ g_defs[id].suffixes.join('|') + ')\\s*$', 'i')
    	};
    }
}

load();

function save() {
	localStorage['rates'] = JSON.stringify(g_rates);
}

function update_rates() {
  console.log('Updating rates ...');
  try {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.boc.cn/sourcedb/whpj/", true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        console.log('Rates page fetched.');
        var html = xhr.responseText;
        
        var col_name = 0;
        var col_rate = 6;
        
        // try find header
        trths = html.match(/<tr(\s+[^<]*)?>(\s*<th(\s+[^<]*)?>[^<]*<\/th>\s*)+<\/tr>/img);
        if (trths) {
          for (var i = 0; i < trths.length; i ++) {
            var tr = trths[i];
            var ths = tr.match(/<th(\s+[^<]*)?>[^<]*<\/th>/img);
            if (ths) {
              for (var j = 0; j < ths.length; j ++) {
                th = ths[j];
                if (th.match('中行折算价')) {
                  col_rate = j;
                  console.log('col_rate: ' + col_rate);
                } else if (th.match('货币名称')) {
                  col_name = j;
                  console.log('col_name: ' + col_name);
                }
              }
            }
          }
        }
        // search for rates
        trtds = html.match(/<tr(\s+[^<]*)?>(\s*<td(\s+[^<]*)?>[^<]*<\/td>\s*)+<\/tr>/img);
        if (trtds) {
          for (var i = 0; i < trtds.length; i ++) {
            var tr = trtds[i];
            var tds = tr.match(/<td(\s+[^<]*)?>[^<]*<\/td>/img);
            if (tds && tds.length >= col_name && tds.length >= col_rate) {
              var name = tds[col_name].match(/<td(\s+[^<]*)?>\s*(\S*)\s*<\/td>/i)[2];
              var rate = tds[col_rate].match(/<td(\s+[^<]*)?>\s*(\S*)\s*<\/td>/i)[2];
              
              for (id in g_defs) {
              	if (g_defs[id].name.cn == name) {
              		g_rates[id] = parseFloat(rate)/100;
              		console.log(name + ': ' + g_rates[id]);
              		save();
              		break;
              	}
              }
            }
          }
        }
      }
    }
    xhr.send();
  } catch(e) {
  }
}

if (!IS_TESTING) {
    update_rates();
}

function safe_to_lower_case(str) {
	if (str) {
		str = str.toLocaleLowerCase();
	} // if
	
	return str;
}

function append_line(res, l, r) {
	if (res) {
		res += '<br/>';
	}
	return res + l + ' = <strong>' + r + '</strong>';
}

g_cnv_table = {};

function init_cnv_table() {
	var t = '幣國攝萬億歐圓鎊華裏碼體侖麥亞門賓銖紐韓盧蘭羅‑';
	var s = '币国摄万亿欧圆镑华里码体仑麦亚门宾铢纽韩卢兰罗-';
	
	for (i in t) {
		g_cnv_table[t[i]] = s[i];
	} // for i
}

init_cnv_table();


function norm_text(text) {
    text1 = '';
	for (i in text) {
		text1 += g_cnv_table[text[i]] || text[i];
	}
	text = text1;
	return text;
}

// check_money tries to convert the normalized text as foreign money(again g_target_cur) 
// and convert to g_target_cur
function check_money(res, text) {
	var dst_fmt = g_defs[g_target_cur].fmt;
	for (var id in g_regs) {
		if (id == g_target_cur) {
			continue;
		}
		var succ = false;
		var org, src, mul, ex_digits;
		var v = parse_prefix_entry(text, g_regs[id].pre);
		if (v) {
			succ = true;
			src = v.val;
		} else {
			v = parse_suffix_entry(text, g_regs[id].suf);
			if (v) {
				succ = true;
				src = v.val;
			}
		}
		if (succ) {
			var dst = src * g_rates[id] / g_rates[g_target_cur];
			
			res = append_line(res, number_render(src, g_defs[id].fmt, 15),
				number_render(dst, dst_fmt, g_sig_numbers));
		}
	}
	return res;
}

g_f_suffixes = ['华氏度?', '° ?F?', '℉', '度', 'degrees?', 'degrees? fahrenheit', 'F'];
g_c_suffixes = ['摄氏度?', '° ?C?', '℃', '度', 'degrees?', 'degrees? celsius', 'C'];
g_temp_f = new RegExp('^\\s*(华氏)?(零下|-|−|minus )?' + g_number_exp + '\\s*('
	+ g_f_suffixes.join('|') + ')?\\s*$', 'i');
g_temp_c = new RegExp('^\\s*(摄氏)?(零下|-|−|minus )?' + g_number_exp + '\\s*(' 
	+ g_c_suffixes.join('|') + ')?\\s*$', 'i');

// reg: 1 -> tp_pre, 2 -> sign, 3 -> num, 4-> mul, 5 -> tp_suf
function parse_temp_reg(text, reg) {
    var mat = text.match(reg);
    if (mat) {
    	var tp_pre = mat[1];
    	var tp_suf = mat[5];
    	if (tp_pre || tp_suf) {
			var ent = entry_of_orgmul(mat[3], safe_to_lower_case(mat[4]));
			if (mat[2]) {
				// minus value
				ent.val = -ent.val;
			}
			return ent;
    	}
    }
    return null
}

// text tries to convert the normalized text between Fahrenheit and Celsius
function check_temperature(res, text) {
	var ent_f = parse_temp_reg(text, g_temp_f);
	if (ent_f) {
		var src = ent_f.val;
		dst = (src - 32) * 5. / 9;
		res = append_line(res, number_render(src, "{}°F", 15),
			number_render(dst, "{}°C", g_sig_numbers));
	}
	var ent_c = parse_temp_reg(text, g_temp_c);
	if (ent_c) {
		var src = ent_c.val;
		dst = src*9./5. + 32;
		res = append_line(res, number_render(src, "{}°C", 15),
			number_render(dst, "{}°F", g_sig_numbers));
	}
	return res;
}

var g_timezone_matcher = new RegExp('\\b(ACDT|ACST|ACT|ADT|AEDT|AEST|AFT|AKDT|AKST|AMST|AMT|ART|AST|AWDT|AWST|AZOST|AZT|BDT|BIOT|BIT|BOT|BRST|BRT|BST|BTT|CAT|CCT|CDT|CDT|CEDT|CEST|CET|CHADT|CHAST|CHOT|ChST|CHUT|CIST|CIT|CKT|CLST|CLT|COST|COT|CST|CT|CVT|CWST|CXT|DAVT|DDUT|DFT|EASST|EAST|EAT|ECT|EDT|EEDT|EEST|EET|EGST|EGT|EIT|EST|FET|FJT|FKST|FKT|FNT|GALT|GAMT|GET|GFT|GILT|GIT|GMT|GST|GYT|HADT|HAEC|HAST|HKT|HMT|HOVT|HST|IBST|ICT|IDT|IOT|IRDT|IRKT|IRST|IST|JST|KGT|KOST|KRAT|KST|LHST|LINT|MAGT|MART|MAWT|MDT|MET|MEST|MHT|MIST|MIT|MMT|MSK|MST|MUT|MVT|MYT|NCT|NDT|NFT|NPT|NST|NT|NUT|NZDT|NZST|OMST|ORAT|PDT|PET|PETT|PGT|PHOT|PKT|PMDT|PMST|PONT|PST|PYST|PYT|RET|ROTT|SAKT|SAMT|SAST|SBT|SCT|SGT|SLST|SRET|SRT|SST|SYOT|TAHT|THA|TFT|TJT|TKT|TLT|TMT|TOT|TVT|UCT|ULAT|USZ1|UTC|UYST|UYT|UZT|VET|VLAT|VOLT|VOST|VUT|WAKT|WAST|WAT|WEDT|WEST|WET|WIT|WST|YAKT|YEKT|Z)\\b',
    'i');

function check_date(res, text) {
  if (!text.match(g_timezone_matcher)) {
    return res;
  }
  var d = new Date(text);
  if (isNaN(d.getDate())) {
    return res;
  }
  return append_line(res, text, d.toString());
}

var g_simple_math_re = new RegExp('^\\s*' + g_number_exp + '\\s*([+*/-])\\s*' + g_number_exp + '\\s*$');

function check_math(res, text) {
	var mat = text.match(g_simple_math_re);
	// console.log(mat);
	if (!mat) {
		return res;
	}
	var a  = entry_of_orgmul(mat[1], safe_to_lower_case(mat[2]));
	var op = mat[3];
	var b  = entry_of_orgmul(mat[4], safe_to_lower_case(mat[5]));
	var c = 0;
	switch(op) {
		case '+':
			c = a.val + b.val;
			break;
		case '-':
			c = a.val - b.val;
			break;
		case '*':
			c = a.val * b.val;
			break;
		case '/':
			c = a.val / b.val;
			break;
		default:
			return res;
	}
	return append_line(res, a.val + op + b.val, c);
}

// check_exchange tries to convert the selected text to the destination
// money/metric/temperature. text will be normalized.
function check_all(text) {
	text = norm_text(text);
	var res = '';
	
	res = check_money(res, text);
	res = check_metric(res, text);
	res = check_temperature(res, text);
	res = check_date(res, text);
	res = check_math(res, text)
	
	return res ? res : null;
}

if (!IS_TESTING) {
		window.MagicSel.sendRequest  = function (request, cb){
			if (request.text) {
				// console.log(check_all(request.text));
				cb({res: check_all(request.text)});
			}
			if (request.options) {
				opt = request.options;
				if (opt.lang) {
					g_lang = opt.lang;
				}
				if (opt.sig_numbers) {
					g_sig_numbers = parseInt(opt.sig_numbers);
				}
				if (opt.dest_sys) {
					g_dest_sys = opt.dest_sys;
				}
				
				if (opt.target_cur) {
					g_target_cur = opt.target_cur;
				}
				
				save_options();

				// console.log("Options changed: " + JSON.stringify(opt));
				cb({});
			}
			if (request.get_langs_info) {
				var res = [];
				for (id in g_defs) {
					res.push({
						id: id,
						name: g_defs[id].name
					});
				}
				cb(res);
			}
			if (request.get_options) {
				cb({
					lang: g_lang,
					target_cur: g_target_cur,
					dest_sys: g_dest_sys,
					sig_numbers: g_sig_numbers
				});
			}

		};
	
	setInterval(update_rates, 3600000);
	}

	// expose


}();

(()=>{
	GM_addStyle(`
.sel-text-win {
    font-size: 14px;
    font-weight: strong;
    position: absolute;
    background: rgba(200, 200, 200, 0.8);
    padding: 5px;
    width: auto;
    border-radius: 5px;
    box-shadow: 0px 1px 4px gray;
    text-shadow: 0px -1px 0px white;
    z-index: 10000;
}
`)
	document.body.addEventListener('mouseup',
	function (e) {
		// console.log('mouseup: ' + e.clientX + ',' + e.clientY);
		var seltext = window.getSelection().toString();
		// console.log('Selected: ' + window.getSelection().toString());
		
		var get_win = function() {
			var win = document.getElementById('sel-ext-win');
			if (!win) {
				// console.log('Create show win');
				win = document.createElement('div');
				win.id = 'sel-ext-win';
				win.className = 'sel-text-win';
				document.body.appendChild(win);
			}
			return win;
		}
		var win = get_win();
		
		if (!seltext) {
			win.style['display'] = 'none';
			return;
		}


		// 修改
		MagicSel.sendRequest({text: seltext},
			function(response) {
				res = response.res;
				var win = get_win();

				if (res) {
					win.style['display'] = 'block';
					var bodyTop = parseInt(document.defaultView.getComputedStyle(document.body, '').getPropertyValue('margin-top'));
					var top = e.pageY - bodyTop - win.clientHeight - 1;
					top = Math.max(0, top);
					win.style['top'] = top + 'px';
					
					var bodyLeft = parseInt(document.defaultView.getComputedStyle(document.body, '').getPropertyValue('margin-left'));
					var left = e.pageX - bodyLeft + 30;
					left = Math.max(0, left);
					win.style['left'] = left + 'px';
					
					win.innerHTML = res;
				} else {
					win.style['display'] = 'none';
				}
			}
		);
	} 
);// mouseup function END！

})();

// options
(()=>{
	GM_addStyle(`
#mg_popup_setting {
    display:none;
    position:absolute;
    top: 50%;
    left: 50%;
    z-index: 1000;
    transform: translate(-50%, -50%);
    width: 600px;
    background: #fff;
    border: 1px solid #1ac3e4;
    text-align: left;
    box-shadow: 5px 5px 20px 0px #1e8e84;
}
#mg_popup_setting #mg_close{
	font-style: normal;
    display: inline-block;
    color: #e80909;
    font-size: 1.2em;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    float: right;
    cursor: pointer;
}
#mg_popup_setting a{
  color: black;
  border-bottom:dotted 1px; 
  text-decoration: none;
}

#mg_popup_setting h1 {
    margin: 0px;
    padding: 40px 0px 30px 0px;
    text-align: center;
    font-size: 30px;
}

#mg_popup_setting article {
    text-align: left;
    margin: 10px 10px;
}

#mg_popup_setting article.footer {
    margin-top: 30px;
    font-size: 75%;
    text-align: right;
}

#mg_popup_setting span.group-label {
    display: inline-block;
    width: 200px;
    text-align: right;
    padding: 0px 20px 0px 0px;
}

#mg_popup_setting #div-examples {
    display: inline-block;
    width: 340px;
    vertical-align: top;
    line-height: 150%;
    text-shadow: 0px -1px 0px white;
}

#mg_popup_setting img#logo {
  position: relative;
  float: left;
  margin-left: 10px;
  margin-top: -90px;
}`)
	// Element
	function setOptWin(){
		const optionHTML = `
		<i id="mg_close">X</i>
		<h1 id='h1-page-title'></h1>
	        <article>
	            <span id='span-language' class="group-label">UI Language:</span>
	            <input type="radio" name="lang" id="ir-en-lang"><span>English</span></input>
	            <input type="radio" name="lang" id="ir-cn-lang"><span>中文</span></input>
	        </article>
	        <article>
	            <span id='span-cur-to' class="group-label"></span>
	            <select id="sel-cur-to">
	            </select>
	        </article>
	        <article>
	            <span id='span-system' class="group-label"></span>
	            <select id="sel-sys">
	                <option value='std' id='vl-std-sys'></option>
	                <option value='imp' id='vl-imp-sys'></option>
	                <option value='us' id='vl-us-sys'></option>
	            </select>
	        </article>
	        <article>
	            <span id='span-sig-number' class="group-label"></span>
	            <select id="sel-sig-number">
	                <option value='2'>2</option>
	                <option value='3'>3</option>
	                <option value='4'>4</option>
	                <option value='5'>5</option>
	                <option value='6'>6</option>
	            </select>
	        </article>
	        <article>
	            <span id='span-examples' class="group-label"></span>
	            <div id="div-examples"></div>
	        </article>
	        <!--webp -->
	        <img id="logo" src="https://lh3.googleusercontent.com/-i7d7bF4KnnK5lndYQDRufDmt2q7ZZ90jZrfobioavGSOgxt6JOhxIimaSdtojQTu7rPQYfcgw=s0"/>
	        <article class="footer">
				  Last updated 2018-03-22
	            | <a href="https://www.facebook.com/magicsel" target="_blank">Facebook Page</a>
	            | <span id='span-developed-by'></span> <a href="http://daviddengcn.com/" target="_blank">Yi Deng</a>
	        </article>
	    `;
	    const outer = document.createElement("section");
	    outer.setAttribute("id","mg_popup_setting");
	    outer.innerHTML = optionHTML;
		document.body.appendChild(outer);
		document.getElementById('mg_close').addEventListener('click',(e)=>{
		   outer.style.display="none";
		});
	}
	setOptWin();

	function ut(id, text) {
    	document.getElementById(id).innerText = text;
	}

function update_examples() {
    document.getElementById('div-examples').innerHTML = '';
    var func_append = function(response) {
        var div = document.getElementById('div-examples');
        if (response.res) {
            div.innerHTML = div.innerHTML + response.res + "<br/>";
        }
    }
    var examples = [];
    switch (g_dest_sys) {
        case 'std':
            examples = ["$1", "RMB 1", "2英里", "2 oz", "1000 sqft", "1°", "30 fl oz", "50 MPG", "1'2\"", "Jan 2, 13:45 UTC"];
            break;
            
        case 'imp':
            examples = ["$1", "RMB 1", "2公里", "5克", "100 sqm", "1°", "1 l", "10个油", "1m50cm", "Jan 2, 13:45 UTC"];
            break;
            
        case 'us':
            examples = ["$1", "RMB 1", "2公里", "5克", "100 sqm", "1°", "1 l", "10个油", "1m50cm", "Jan 2, 13:45 UTC"];
            break;
    }
    
    for (i in examples) {
        MagicSel.sendRequest({text: examples[i]}, func_append);
    }
}

function update_language() {
    switch (g_lang) {
        case 'cn':
            ut('h1-page-title', '智能选择插件 ' + GM_info.script.version);
            
            ut('span-language', '显示语言');
            ut('span-cur-to', '目标货币');
            
            ut('span-system', '目标计量系统');
            ut('vl-std-sys', '公制');
            ut('vl-imp-sys', '英制');
            ut('vl-us-sys', '美制');
            
            ut('span-examples', '示例');
            
            ut('span-sig-number', '有效数字');
            
            ut('span-developed-by', '开发者：');
            break;
            
        case 'en':
            ut('h1-page-title', 'MagicSel Extension ' + GM_info.script.version);
            
            ut('span-language', 'UI Language');
            ut('span-cur-to', 'Target currency');
            
            ut('span-system', 'Target system');
            ut('vl-std-sys', 'Metric');
            ut('vl-imp-sys', 'Imperial');
            ut('vl-us-sys', 'US');
            
            ut('span-examples', 'Examples');
            ut('span-sig-number', 'Significants');
            
            ut('span-developed-by', 'Developed by');
            break;
    }
    
    MagicSel.sendRequest({get_langs_info:{}}, function(infos) {
        var src = '';
        for (i in infos) {
            var info = infos[i];
            src += '<option value="' + info.id + '">' + info.name[g_lang] + '</option>';
        }
        document.getElementById('sel-cur-to').innerHTML= src;
        document.getElementById('sel-cur-to').value = g_target_cur;
    })
}

function load() {
    MagicSel.sendRequest({get_options:{}}, function(opt) {
        g_lang = opt.lang;
        g_target_cur = opt.target_cur;
        g_dest_sys = opt.dest_sys;
        g_sig_numbers = parseInt(opt.sig_numbers);
        
        document.getElementById('ir-' + g_lang + '-lang').checked = true;
        document.getElementById('sel-sys').value = g_dest_sys;
        document.getElementById('sel-sig-number').value = g_sig_numbers;
        
        update_language();
        update_examples();
    })
    
    document.getElementById('ir-en-lang').addEventListener('change', function(e) {
        g_lang = 'en';
        update_language();
        send_options();
    });
    
    document.getElementById('ir-cn-lang').addEventListener('change', function(e) {
        g_lang = 'cn';
        update_language();
        send_options();
    });
    
    document.getElementById('sel-sys').addEventListener('change', function(e) {
        g_dest_sys = document.getElementById('sel-sys').value;
        send_options();
    });
    
    document.getElementById('sel-cur-to').addEventListener('change', function(e) {
        g_target_cur = document.getElementById('sel-cur-to').value;
        send_options();
    });
    
    document.getElementById('sel-sig-number').addEventListener('change', function(e) {
        g_sig_numbers = document.getElementById('sel-sig-number').value;
        send_options();
    });
}



function OpenSet() {
  return document.getElementById('mg_popup_setting').style.display="block";
};

function send_options() {
    MagicSel.sendRequest({options: {
               lang: g_lang,
           dest_sys: g_dest_sys,
        sig_numbers: g_sig_numbers,
         target_cur: g_target_cur
    }}, function() {
        update_examples();
    });
}

GM_registerMenuCommand("设置", OpenSet, 'm');
load();

})()