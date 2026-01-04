// ==UserScript==
// @name           AbemaTV Extractor
// @description    Extract hls url and decrypt key AbemaTV
// @match http://*/*
// @match https://*/*
// @version 0.0.1.20231021123349
// @namespace https://greasyfork.org/users/3920
// @downloadURL https://update.greasyfork.org/scripts/371335/AbemaTV%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/371335/AbemaTV%20Extractor.meta.js
// ==/UserScript==

(function () {
    function ShowResult(url, key, fix, playlist, color) {
        var trends_dom = document.getElementById('extractresult');
        if (trends_dom === null) {
            trends_dom = document.createElement('div');
            trends_dom.setAttribute('id', 'extractresult');

            trends_dom.innerHTML = "";
            var title_dom = document.createElement('strong');
            title_dom.innerHTML = [
			'<div style="display: block; text-align:center; width: 100%; padding: 0px; margin: 5px 0px 0px 0px; vertical-align: middle; border-spacing: 0px"><div style="display: inline-table;">',
			'<div style="display:' + (key===""?"none":"inline-table") + '; padding: 0px 10px 0px 10px; vertical-align: middle; font: 12px Consolas; font-weight: bold;"><a id="keylink" style="background-color: #ec0000;box-shadow: 0 2px 2px rgba(50,50,50,.4); text-decoration: none; min-width: 156px; box-sizing: border-box; margin: 0; padding: 0 1em; outline: none; display: block; border-radius: 2px; color: ' + color + ';" href="' + key + '" download="abematv-license">KEY</a></div>',
			'<div style="display:' + (fix===""?"none":"inline-table") + '; padding: 0px 10px 0px 10px; vertical-align: middle; font: 12px Consolas; font-weight: bold;"><a id="fixlink" style="background-color: #00ec00;box-shadow: 0 2px 2px rgba(50,50,50,.4); text-decoration: none; min-width: 156px; box-sizing: border-box; margin: 0; padding: 0 1em; outline: none; display: block; border-radius: 2px; color: ' + color + ';" href="' + fix + '" download="fix.m3u8">FIX</a></div>',
			'<div style="display:' + (playlist===""?"none":"inline-table") + '; padding: 0px 10px 0px 10px; vertical-align: middle; font: 12px Consolas; font-weight: bold;"><a id="playlist" style="background-color: #00ec00;box-shadow: 0 2px 2px rgba(50,50,50,.4); text-decoration: none; min-width: 156px; box-sizing: border-box; margin: 0; padding: 0 1em; outline: none; display: block; border-radius: 2px; color: ' + color + ';" href="' + playlist + '" download="playlist.m3u8">PLAYLIST</a></div>',
			'<div style="display:' + (url===""?"none":"inline-table") + '; padding: inherit; vertical-align: middle; font: 12px Consolas; font-weight: bold;"><a id="hlslink" style="background-color: #565656;box-shadow: 0 2px 2px rgba(50,50,50,.4); text-decoration: none; min-width: 156px; box-sizing: border-box; margin: 0; padding: 0 1em; outline: none; display: block; border-radius: 2px; color: ' + color + ';" href="' + url + '">' + url + '</a></div>',
			'<div style="display: none; padding: inherit; vertical-align: middle; font: 12px Consolas; font-weight: bold; color:white;"><div id="savetitle">none</div></div>',
			'</div></div>'
            ].join(' ');

            trends_dom.appendChild(title_dom);
            trends_dom.style.cssText = [
			'background: rgba(53, 54, 55, 1);',
			'color: #000;',
			'padding: 0px;',
			'position: fixed;',
			'z-index:10240;',
			'width:100%;',
			'font: 12px Meiryo;',
			'vertical-align: middle;',
            ].join(' ');
            document.body.style.cssText = 'position: relative; margin-top: 45px';
            document.body.parentElement.insertBefore(trends_dom, document.body);
        }
        else
        {
            var link = document.getElementById("keylink");
            if(link !== null) {
                if(key === "") {
                    link.parentElement.style.display = "none";
                }
                else {
                    link.href = key;
                    link.parentElement.style.display = "inline-table";
                }
            }
            link = document.getElementById("hlslink");
            if(link !== null) {
                if(url === "") {
                    link.parentElement.style.display = "none";
                }
                else {
                    link.href = url;
                    link.innerText = url;
                    link.parentElement.style.display = "inline-table";
                }
            }
            link = document.getElementById("fixlink");
            if(link !== null) {
                if(fix === "") {
                    link.parentElement.style.display = "none";
                }
                else {
                    link.href = fix;
                    link.parentElement.style.display = "inline-table";
                }
            }
            link = document.getElementById("playlist");
            if(link !== null) {
                if(playlist === "") {
                    link.parentElement.style.display = "none";
                }
                else {
                    link.href = playlist;
                    link.parentElement.style.display = "inline-table";
                }
            }
        }
    }

// get decrypt logic
const rechk = /^([<>])?(([1-9]\d*)?([xcbB?hHiIqQfdsp]))*$/;
const refmt = /([1-9]\d*)?([xcbB?hHiIqQfdsp])/g;
const str = (v,o,c) => String.fromCharCode(
    ...new Uint8Array(v.buffer, v.byteOffset + o, c));
const rts = (v,o,c,s) => new Uint8Array(v.buffer, v.byteOffset + o, c)
    .set(s.split('').map(str => str.charCodeAt(0)));
const pst = (v,o,c) => str(v, o + 1, Math.min(v.getUint8(o), c - 1));
const tsp = (v,o,c,s) => { v.setUint8(o, s.length); rts(v, o + 1, c - 1, s); };
const lut = le => ({
    x: c=>[1,c,0],
    c: c=>[c,1,o=>({u:v=>str(v, o, 1)      , p:(v,c)=>rts(v, o, 1, c)     })],
    '?': c=>[c,1,o=>({u:v=>Boolean(v.getUint8(o)),p:(v,B)=>v.setUint8(o,B)})],
    b: c=>[c,1,o=>({u:v=>v.getInt8(   o   ), p:(v,b)=>v.setInt8(   o,b   )})],
    B: c=>[c,1,o=>({u:v=>v.getUint8(  o   ), p:(v,B)=>v.setUint8(  o,B   )})],
    h: c=>[c,2,o=>({u:v=>v.getInt16(  o,le), p:(v,h)=>v.setInt16(  o,h,le)})],
    H: c=>[c,2,o=>({u:v=>v.getUint16( o,le), p:(v,H)=>v.setUint16( o,H,le)})],
    i: c=>[c,4,o=>({u:v=>v.getInt32(  o,le), p:(v,i)=>v.setInt32(  o,i,le)})],
    I: c=>[c,4,o=>({u:v=>v.getUint32( o,le), p:(v,I)=>v.setUint32( o,I,le)})],
    q: c=>[c,8,o=>({u:v=>v.getBigInt64( o,le), p:(v,q)=>v.setBigInt64( o,q,le)})],
    Q: c=>[c,8,o=>({u:v=>v.getBigUint64(o,le), p:(v,Q)=>v.setBigUint64(o,Q,le)})],
    f: c=>[c,4,o=>({u:v=>v.getFloat32(o,le), p:(v,f)=>v.setFloat32(o,f,le)})],
    d: c=>[c,8,o=>({u:v=>v.getFloat64(o,le), p:(v,d)=>v.setFloat64(o,d,le)})],
    s: c=>[1,c,o=>({u:v=>str(v,o,c), p:(v,s)=>rts(v,o,c,s.slice(0,c    ) )})],
    p: c=>[1,c,o=>({u:v=>pst(v,o,c), p:(v,s)=>tsp(v,o,c,s.slice(0,c - 1) )})]
});
const errbuf = new RangeError("Structure larger than remaining buffer");
const errval = new RangeError("Not enough values for structure");
function struct(format) {
    let fns = [], size = 0, m = rechk.exec(format);
    if (!m) { throw new RangeError("Invalid format string"); }
    const t = lut('<' === m[1]), lu = (n, c) => t[c](n ? parseInt(n, 10) : 1);
    while ((m = refmt.exec(format))) { ((r, s, f) => {
        for (let i = 0; i < r; ++i, size += s) { if (f) {fns.push(f(size));} }
    })(...lu(...m.slice(1)))}
    const unpack_from = (arrb, offs) => {
        if (arrb.byteLength < (offs|0) + size) { throw errbuf; }
        let v = new DataView(arrb, offs|0);
        return fns.map(f => f.u(v));
    };
    const pack_into = (arrb, offs, ...values) => {
        if (values.length < fns.length) { throw errval; }
        if (arrb.byteLength < offs + size) { throw errbuf; }
        const v = new DataView(arrb, offs);
        new Uint8Array(arrb, offs, size).fill(0);
        fns.forEach((f, i) => f.p(v, values[i]));
    };
    const pack = (...values) => {
        let b = new ArrayBuffer(size);
        pack_into(b, 0, ...values);
        return b;
    };
    const unpack = arrb => unpack_from(arrb, 0);
    function* iter_unpack(arrb) { 
        for (let offs = 0; offs + size <= arrb.byteLength; offs += size) {
            yield unpack_from(arrb, offs);
        }
    }
    return Object.freeze({
        unpack, pack, unpack_from, pack_into, iter_unpack, format, size});
}

function unhexlify (str) {
  let o = new Uint8Array(str.match(/[\da-f]{2}/gi).map(function (h) {return parseInt(h, 16);}));
  return o;
}
function buf2hex (buf) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join('');
}
function hex2a(hexx) {
  let hex = hexx.toString();
  let str = '';
  for (var i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

function GenerateHMAC (key, message, vkey) {
  let key2 = CryptoJS.lib.WordArray.create(key);
  let hash = CryptoJS.HmacSHA256(message, key2);
  let decrypted = CryptoJS.AES.decrypt(CryptoJS.lib.CipherParams.create({ciphertext:CryptoJS.enc.Hex.parse(buf2hex(vkey))}), hash, {mode:CryptoJS.mode.ECB,padding:CryptoJS.pad.NoPadding}).toString();
  return (decrypted);
}

function GetDecryptKey (k, cid, did) {
  const STRTABLE = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const HKEY = "3AF0298C219469522A313570E8583005A642E73EDD58E3EA2FB7339D3DF1597E";
  
  let sumres = ((k) => {
    let res = BigInt(0);
    [...Array(k.length)].map((_,i) => {
      res += BigInt(BigInt(STRTABLE.search(k[i])) * BigInt(BigInt(58) ** BigInt(k.length - 1 - i)));
    });
    return res;
  })(k);
  
  let encvideokey = struct(">QQ").pack(sumres >> BigInt(64), sumres % BigInt(0xffffffffffffffff));
  let deckey = GenerateHMAC(unhexlify(HKEY), encodeURI((cid + did)), encvideokey);
  return (deckey);
}
////

    function SetTitle(text) {
        var title = document.getElementById("savetitle");
        if(title === null)
            ShowResult("", "", "", "", "white");

        title = document.getElementById("savetitle");
        if(title !== null) {
            if(text === "") {
                title.parentElement.style.display = "none";
            }
            else {
                title.innerText = text.replace(/\//g, "／").replace(/!/g, "！").replace(/\?/g, "？").replace(/&/g, "＆").replace(/\^/g, "＾").replace(/:/g, "：");
                title.parentElement.style.display = "table-footer-group";
            }
        }
    }

	function GetTitle(episode) {
		var title = "";
		$.ajax({
			type: "GET",
			url: "https://api.abema.io/v1/video/programs/" + episode,
			dataType: "json",
			async: false,
		            beforeSend: function (req) {
		                req.setRequestHeader("authorization", "bearer " + window.localStorage["abm_token"]);
		            },
			success: function(data) {
				var dd = 0;
				var mm = 0;
				var yyyy = 0;
				if(data.broadcastAt !== undefined) {
					var today = new Date(data.broadcastAt * 1000);
					dd = today.getDate();
					mm = today.getMonth()+1;
					yyyy = today.getFullYear();
				} else {
					var today = new Date(data.endAt * 1000);
					dd = today.getDate();
					mm = today.getMonth()+1; //January is 0!
					//yyyy = data.credit.released; //today.getFullYear()-1;

					var upload = new Date(data.imageUpdatedAt * 1000);
					umm = upload.getMonth()+1; //January is 0!
					yyyy = upload.getFullYear();
					if(mm > umm)
						--yyyy;
				}
				if(dd < 10) dd = '0' + dd;
				if(mm < 10) mm = '0' + mm;
				var date = '[' + yyyy + '.' + mm + '.' + dd + ']';
				var episode = data.episode.title.replace(/^.+(【.+#\d+).*$/, "$1");
				//var maincasts = episode.replace(/【(.+)】 .+/, "$1").split("×");
				//console.log(maincasts);
				if(data.season !== undefined)
					episode = episode.replace(/^(.{1})(.+)$/, "$1" + data.season.name.replace(/^(.{1}).+$/, "$1") + "：$2");
		
				var guests = "";
				data.credit.casts.forEach(function(cast) {
					var guest = /^(?:ゲスト：)?([^：]+)$/gm.exec(cast);
					if (guest !== null) {
						var guestlist = guest[1].split("/");
						for(var i in guestlist) {
							if(guests !== "") guests += ", ";
							guests += guestlist[i];
						}
						console.log(guests);
					}
					//var isMaincast = false;
					//for(var i in maincasts) {
					//	if(maincasts[i] == cast)
					//	{
					//		isMaincast = true;
					//		break;
					//	}
					//}
					//console.log(isMaincast);
					//if(!isMaincast)
					//{
					//	if(guests !== "") guests += ", ";
					//	guests += cast;
					//}
				});
				//console.log(guests);
				if(guests !== "")
					guests =  " (Guest - " + guests + ")";
				title = date + ' ' + data.series.title + episode + guests;
			},
			error: function(xhr, status, error) {
			}
		});

		return title;
	}

	function GetNormalTitle(episode) {
		var title = "";
		$.ajax({
			type: "GET",
			url: "https://api.abema.io/v1/video/programs/" + episode,
			dataType: "json",
			async: false,
		            beforeSend: function (req) {
		                req.setRequestHeader("authorization", "bearer " + window.localStorage["abm_token"]);
		            },
			success: function(data) {
				var dd = 0;
				var mm = 0;
				var yyyy = 0;
				if(data.broadcastAt !== undefined) {
					var today = new Date(data.broadcastAt * 1000);
					dd = today.getDate();
					mm = today.getMonth()+1;
					yyyy = today.getFullYear();
				} else {
					var today = new Date(data.endAt * 1000);
					dd = today.getDate();
					mm = today.getMonth()+1; //January is 0!
					yyyy = data.credit.released; //today.getFullYear()-1;
				}
				if(dd < 10) dd = '0' + dd;
				if(mm < 10) mm = '0' + mm;
				var date = '[' + yyyy + '.' + mm + '.' + dd + ']';
				var episode = data.episode.title.replace(/^.+(【.+#\d+).*$/, "$1");
				title = date + ' ' + data.series.title + ' ' + episode;
			},
			error: function(xhr, status, error) {
			}
		});

		return title;
	}

	function GetSlotTitle(slot) {
		var title = "";
		$.ajax({
			type: "GET",
			url: "https://api.abema.io/v1/media/slots/" + slot,
			dataType: "json",
			async: false,
		            beforeSend: function (req) {
		                req.setRequestHeader("authorization", "bearer " + window.localStorage["abm_token"]);
		            },
			success: function(data) {
				var today = new Date(data.slot.startAt * 1000);
				var dd = today.getDate();
				var mm = today.getMonth()+1; //January is 0!
				var yyyy = today.getFullYear();
				if(dd < 10) dd = '0' + dd;
				if(mm < 10) mm = '0' + mm;
				var date = '[' + yyyy + '.' + mm + '.' + dd + ']';

				var guests = "";
				data.slot.programs[0].credit.casts.forEach(function(cast) {
					if(guests !== "") guests += ", ";
					guests += cast;
				});
				//console.log(guests);
				if(guests !== "")
					guests =  " (Guest - " + guests + ")";
				title = date + ' ' + data.slot.title + guests;
			},
			error: function(xhr, status, error) {
			}
		});

		return title;
	}

    var url = document.location.href;
    var episode = null;
    var slots = null;
    var t = localStorage["abm_mediaToken"];
    var hlsUrl = "";
    var bestUrl = "";
    var fixm3u8 = "";
    var playm3u8 = "";
    var hashKey = "";
    var cid = "";
    var k = "";
    var kg = "";
    var error = "";

    function getBestUrl(url, xml) {
        var domain = url.replace(/^(https?:\/\/[^:\/\s]+.+?)playlist.m3u8.*$/, "$1");
        var pattern = /^.+?,BANDWIDTH=(\d+?)($|,.*$)\n^([^#].+?)$/gm;
        var matchArray;
        var maxBandwidth = 0;
        var best = "";

        while ((matchArray = pattern.exec(xml)) !== null) {
            var bandwidth = Number(matchArray[1]);
            if (maxBandwidth < bandwidth) {
                maxBandwidth = bandwidth;
                best = domain + matchArray[3];
            }
        }
        return best;
    }

    /// manifest
    function requestManifest(param) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "GET",
                url: hlsUrl,
                //async: false,
                success: function (xml) {
                    bestUrl = getBestUrl(hlsUrl, xml);
                    resolve("");
                },
                error: function (xhr, status, error) {
                    hlsUrl = hlsUrl.replace("ds-glb-vod-abematv", "ds-vod-abematv");
                    $.ajax({
                        type: "GET",
                        url: hlsUrl,
                        success: function (xml) {
                            bestUrl = getBestUrl(hlsUrl, xml);
                            resolve("");
                        },
                        error: function (xhr, status, error) {
                            bestUrl = "";
                        }
                    });
                }
            });
        });
    }

    function requestBestUrl(param) {
        return new Promise(function (resolve, reject) {
            if (bestUrl !== "") {
                $.ajax({
                    type: "GET",
                    url: bestUrl,
                    //async: false,
                    success: function (hls) {
                        var key = /METHOD=([^,]+),URI=\"abematv-license:\/\/([^\"]+)\"/gm.exec(hls);
                        if (key !== null) {
                            if (key[1] === "AES-128")
                                hashKey = key[2];
                        }

                        var domain = bestUrl.replace(/^(https?:\/\/[^\/]+)\/.*$/, "$1");
                        var matchline = null;
                        var pattern = /^([^\r\n]+)$/gm;
                        var matchArray;

                        while ((matchArray = pattern.exec(hls)) !== null) {
                            var str = matchArray[1];
                            if((matchline = /^(https?:\/\/)?.*\/([^\/]+.ts)\??.*/.exec(str)) !== null) {
                                fixm3u8 += "ts/" + matchline[2];
                                playm3u8 += (matchline[1] === undefined ? domain : "") + str;
                            }
                            else if((matchline = /^(#.*URI="abematv-license):\/\/[^\"]+(".*)$/.exec(str)) !== null) {
                                fixm3u8 += matchline[1] + matchline[2];
                                playm3u8 += str;
                            }
                            else {
                                fixm3u8 += str;
                                playm3u8 += str;
                            }
                            fixm3u8 += "\n";
                            playm3u8 += "\n";
                        }

                        resolve("");
                    },
                    error: function (xhr, status, error) {
                        error = "key find error";
                    }
                });
            }
        });
    }

    function requestLicense(param) {
        return new Promise(function (resolve, reject) {
            if (hashKey !== "") {
                var licenseUrl = "https://license.abema.io/abematv-hls?t=" + t;
                var jsonData = `{"lt":"${hashKey}","kv":"a"}`;

                $.ajax({
                    type: "POST",
                    url: licenseUrl,
                    async: false,
                    dataType: "json",
                    data: jsonData,
                    contentType: "application/json",
                    success: function (playinfo) {
                        cid = playinfo.cid;
                        k = playinfo.k;
                        resolve("");
                    },
                    error: function (xhr, status, error) {
                        error = "playinfo load error";
                    }
                });
            }
        });
    }

    function requestKey() {
        return new Promise(result => {
          result(true);
        });

        return new Promise(result => {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "/xhrp.js", true);
            xhr.onload = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var hexKG = /'use strict';[^\?]+\?[^,;]*[,;]\s*[^,]*,[^=]+=([^;]+);/.exec(xhr.responseText);
                    if (hexKG !== null)
                        result(parseInt(hexKG[1], 16));

                    window.eval(xhr.responseText.replace(/\);}function\s[_a-z0-9]*\(\s*[_a-z0-9]*\s*,\s*[_a-z0-9]*\s*,\s*[_a-z0-9]*\s*\)[^?]*'5'.*}\s*\(\s*[_a-z0-9]*\s*,\s*[_a-z0-9]*\s*,\s*[_a-z0-9]*\s*\)\);\s*}\s*var/, function (match) {
                        var funcName = /function\s([^\(]+)\(/.exec(match);
                        if (funcName !== null) {
                            return (match.substring(0, match.length - 3) + "window.kaoru=" + funcName[1] + ";var");
                        }
                    }));
                    //console.log(window.kaoru(cid, window.localStorage["abm_userId"], k).join(" "));
                    //result(kg);
                }
            };
            xhr.send(null);
        });
    }

    function GetOnAirHLS(onair_id) {
        return new Promise(result => {
            var xmlhttp = new XMLHttpRequest();
            var url = 'https://api.abema.io/v1/channels';

            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                    if (xmlhttp.status == 200) {
                        var jsonData = JSON.parse(xmlhttp.responseText);
                        jsonData.channels.forEach(function(channel) {
                            if(onair_id == channel["id"])
                                result(channel["playback"]["hls"]);
                        });
                    }
                    result("");
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        });
    }

    function Process() {
        if(hlsUrl === "") return;
        Promise.resolve().then(requestManifest).then(result => {
            Promise.resolve().then(requestBestUrl).then(result => {
                console.log("hashkey, " + hashKey);
                Promise.resolve().then(requestLicense).then(result => {
                    console.log('ok');
                    console.log(result);
                    console.log("bestUrl, " + bestUrl);
                    if (cid !== "" && k !== "") {
                        let deckey = GetDecryptKey(k, cid, window.localStorage["abm_deviceId"]);
                        var keyDownLink = "data:application/graphql;base64," + btoa(hex2a(deckey));
                        ShowResult(bestUrl, keyDownLink, "data:application/text;base64," + btoa(fixm3u8), "data:application/text;base64," + btoa(playm3u8), "white");
                        //console.log(Array.from(window.kaoru(cid, window.localStorage["abm_userId"], k), function (byte) {
                        //    return "0x" + ('0' + (byte & 0xFF).toString(16)).slice(-2);
                        //}).join(' '));
                    }
                });
            });
        });
    }

function injector(src) {
  return new Promise(resolve => {
    const script = document.createElement("script");
    script.onload = resolve;
    script.setAttribute("src", src);
    document.getElementsByTagName('body')[0].appendChild(script);
  });
}

    async function start() {
  const inject = [
    "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js", 
    "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/hmac-sha256.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/mode-ecb.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/pad-nopadding.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/aes.min.js",
  ];

  for (let script of inject) {
    console.log(`injection: ${script}`);
    await injector(script);
    console.log(`injection complete: ${script}`);
  }
        {
            Promise.resolve().then(requestKey).then(result => {
                ids = /https:\/\/abema\.tv\/(?:now-on-air\/([^\?]+)|video\/episode\/([^\?]+)|channels\/.+?\/slots\/([^\?]+)|payperview\/([^\?]+))/.exec(document.location.href);
                if(ids[1] !== undefined) {
                    Promise.resolve(ids[1]).then(GetOnAirHLS).then(result => {
                        hlsUrl = result;
                        Process();
                    });
                } else {
                    if (ids[2] !== undefined) {
                        let episode = ids[2];
                        if(/^218-/.test(episode))
                            SetTitle(GetTitle(episode));
                        else
                            SetTitle(GetNormalTitle(episode));

                        hlsUrl = "https://ds-glb-vod-abematv.akamaized.net/program/" + episode + "/playlist.m3u8?t=" + t;
                    } else if (ids[3] !== undefined) {
                        let slots = ids[3];
                        SetTitle(GetSlotTitle(slots));

                        hlsUrl = "https://ds-glb-vod-abematv.akamaized.net/slot/" + slots + "/playlist.m3u8?t=" + t;
                    } else if (ids[4] !== undefined) {
                        let slots = ids[4];
                        SetTitle(GetSlotTitle(slots + "?division=1&include=payperview"));

                        hlsUrl = "https://ds-glb-vod-abematv.akamaized.net/ppv/slot/" + slots + "/playlist.m3u8?t=" + t;
                    }
                    Process();
                }
            });
        }
    }
    start();
})();