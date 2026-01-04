// ==UserScript==
// @name         H2B.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A Javascript library that converts HTML to BBCode.
// @author       You
// @match        *
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        none
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
this.$.expr[':'].css = function(obj, index, meta) {
    var args = meta[3].split(/\s*,\s*/);
    return $(obj).css(args[0]) === args[1];
};
window.H2B = (function (){
    'use strict';
    function arrayUnique(array, property) {
        var a = array.concat();
        var i, j;
        if (property) {
            for (i = 0; i < a.length; ++i) {
                for (j = i + 1; j < a.length; ++j) {
                    if(a[i][property] === a[j][property]){
                        a.splice(j--, 1);
                    }
                }
            }
        } else {
            for (i = 0; i < a.length; ++i) {
                for (j = i + 1; j < a.length; ++j) {
                    if (a[i] === a[j]){
                        a.splice(j--, 1);
                    }
                }
            }
        }
        return a;
    }
    function BBTagRule(html_selector_l, nth_parent_s2l, html_tag_count, post_equal_info, bbtag_name){
        //Properties
        this.HTMLSelectorL = html_selector_l;
        this.NthParentS2L = nth_parent_s2l;
        this.HTMLTagCount = html_tag_count;
        this.PostEqualInfo = post_equal_info;
        this.BBTagName = bbtag_name;
        //Methods
        if(typeof this.getTarget !== 'function'){
            BBTagRule.prototype.getTarget = function(mother_obj){
                var target_obj = {
                    location: null,
                    substituion: null
                };
                target_obj.location = mother_obj.find(this.HTMLSelectorL).add(mother_obj.filter(this.HTMLSelectorL)).sort(function(a, b){
                    return $(b).parents().length - $(a).parents().length;
                });
                if(this.NthParentS2L >= 0){
                    var that = this;
                    target_obj.substituion = target_obj.location.map(function(){
                        return $(this).parents().eq(that.NthParentS2L)[0];
                    });
                }
                else{
                    target_obj.substituion = target_obj.location;
                }
                return target_obj;
            };
        }
        if(typeof this.updateTarget !== 'function'){
            BBTagRule.prototype.updateTarget = function(mother_obj){
                var target_obj = this.getTarget(mother_obj);
                this.PostEqualInfo.modifyTag(target_obj, this.BBTagName);
            };
        }
    }
    function MoreInfo(info_type, info_name, info_RegExp, info_cap_num, info_case_sensitive){
        //Properties
        this.InfoType = info_type;
        this.InfoName = info_name;
        this.InfoRegExp = info_RegExp;
        this.InfoCapNum = info_cap_num;
        this.InfoCaseSensitve = info_case_sensitive;
        //Methods
        if(typeof this.modifyTag !== 'function'){
            MoreInfo.prototype.modifyTag = function(target_obj, bbtag_name){
                var that = this;
                target_obj.substituion.map(function(ind, e){
                    if(that.InfoType){
                        var info = $(e)[that.InfoType](that.InfoName);
                        if((e.tagName === 'IMG') && (!(info && validURL(info)))){
                            info = $(e)[that.InfoType]('src');
                        }
                        try{
                            var info_bb = info.match(that.InfoRegExp)[that.InfoCapNum];
                            e.outerHTML = '<' + bbtag_name + '=' + encodeURIComponent(info_bb) +
                                ' class="$ez_h2b$"' +
                                (that.InfoCaseSensitve?(' _ez-upper_="' + getUpperLocation(info_bb) + '">'):'>') +
                                target_obj.location[ind].innerHTML + '</' + bbtag_name + '>';
                        }
                        catch(error){
                            H2B.moreinfo_error_cbk();
                            console.log(that);
                            console.log(error);
                        }
                    }
                    else{
                        try{
                            e.outerHTML = '<' + bbtag_name + ' class="$ez_h2b$">' +
                                target_obj.location[ind].innerHTML +
                                '</' + bbtag_name + '>';
                        }
                        catch(error){
                            H2B.moreinfo_error_cbk();
                            console.log(error);
                        }
                    }
                    return e;
                });
            };
        }
    }
    function Replacer(rep_RegExp, rep_replacer){
        this.RepRegExp = rep_RegExp;
        this.RepReplacer = rep_replacer;
        if(typeof this.replaceThis !== 'function'){
            Replacer.prototype.replaceThis = function(text){
                return text.replace(this.RepRegExp, this.RepReplacer);
            };
        }
    }
    function getUpperLocation(text){
        var upper_info = [];
        var char = '';
        for (var i = 0; i < text.length; i++) {
            char = text.charCodeAt(i);
            if(char >= 65 && char<=90){
                upper_info.push(i);
            }
        }
        if(!upper_info.length){
            return -1;
        }
        return upper_info.join(';');
    }
    function hex(x){
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    function validURL(str){
        var pattern = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
        if(!pattern.test(str)){
            return false;
        }
        else{
            return true;
        }
    }
    function uniRep(txt){
        H2B.universe_replace.forEach(function(e){
            txt = e.replaceThis(txt);
        });
        return txt;
    }
    function finalRep(txt){
        H2B.final_replace.forEach(function(e){
            txt = e.replaceThis(txt);
        });
        return txt;
    }
    function deCode(txt){
        txt = txt.replace(/<([^=>]+=)?([^> ]+)( _ez-upper_="([^>"]+)")?>/gi, function(match, p1, p2, p3, p4){
            //BBtags without "=XXX"
            if((!p1)&&p2&&(!p3)){
                return '[' + p2 + ']';
            }
            //BBtags with "=XXX" but without captitalized characters
            else if(p1&&p2&&(!p3)){
                try{
                    p2 = decodeURIComponent(p2);
                }
                catch(error){}
                if((p1 === 'color=') && !(/^#[0-9A-F]{6}$/i.test(p2))){
                    var rgb_array = null;
                    if((rgb_array = p2.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/))){
                        p2 = "#" + hex(rgb_array[1]) + hex(rgb_array[2]) + hex(rgb_array[3]);
                    }
                }
                if((p1 === 'url=')||(p1 === 'img=')){
                    H2B.redirect_list.forEach(function(e){
                        p2 = e.replaceThis(p2);
                    });
                }
                return '[' + p1 + p2 + ']';
            }
            //BBtags with "=XXX" with captitalized characters
            else if(p1&&p2&&p3){
                try{
                    p2 = decodeURIComponent(p2);
                }
                catch(error){}
                var new_p = p2.split('');
                p4.split(';').forEach(function(e){
                    new_p[e] = new_p[e].toUpperCase();
                });
                p2 = new_p.join('');
                //Strip off redirection prefix
                if((p1 === 'url=')||(p1 === 'img=')){
                    H2B.redirect_list.forEach(function(e){
                        p2 = e.replaceThis(p2);
                    });
                }
                return '[' + p1 + p2 + ']';
            }
        });
        return txt;
    }
    var H2B ={
        gazelle_uni_rules: {
            'base': /.+/,
            'rules': {
                'jquery': {
                    'b': new BBTagRule('strong', -1, 2, new MoreInfo(), 'b'),
                    'i': new BBTagRule('em', -1, 2, new MoreInfo(), 'i'),
                    'u': new BBTagRule('span:css(text-decoration, underline)', -1, 2, new MoreInfo(), 'u'),
                    'u1': new BBTagRule('u', -1, 2, new MoreInfo(), 'u'),
                    's': new BBTagRule('span:css(text-decoration, line-through)', -1, 2, new MoreInfo(), 's'),
                    's1': new BBTagRule('s', -1, 2, new MoreInfo(), 's'),
                    'hr': new BBTagRule('hr', -1, 1, new MoreInfo(), 'hr'),
                    'p': new BBTagRule('p:not(blockquote.quote>p,p.sub)', -1, 2, new MoreInfo(), 'paragraph'),
                    'spoiler': new BBTagRule('div>div.quotetitle+div.quotecontent>div', 1, 2, new MoreInfo(), 'spoiler'),
                    'spoiler1': new BBTagRule('blockquote.spoiler', -1, 2, new MoreInfo(), 'spoiler'),
                    'spoiler2': new BBTagRule('div[style*="margin-top:5px; padding:5px; border: 1px solid #333"]>div[style^="display"]', -1, 2, new MoreInfo(), 'spoiler'),
                    'align': new BBTagRule('div[style*="text-align"]', -1, 2, new MoreInfo('css', 'text-align', /center|left|right/i, 0, 0), 'align'),
                    'color': new BBTagRule('span[style*="color"]:not(.spoiler)', -1, 2, new MoreInfo('css', 'color', /.+/, 0, 0), 'color'),
                    'font': new BBTagRule('span[style*="font-family"]', -1, 2, new MoreInfo('css', 'font-family', /.+/, 0, 0), 'font'),
                    'size': new BBTagRule('span[class^="size"],span[class^="bbcode-size-"]', -1, 2, new MoreInfo('prop', 'class', /\d+/, 0, 0), 'size'),
                    'url': new BBTagRule('a[href]:not([onclick^="QuoteJump"])', -1, 2, new MoreInfo('prop', 'href', /.+/, 0, 1), 'url'),
                    'img': new BBTagRule('img[src]', -1, 1, new MoreInfo('prop', 'alt', /.+/, 0, 1), 'img'),
                    'quote': new BBTagRule('blockquote:not(.spoiler)', -1, 2, new MoreInfo(), 'quote'),
                    'quote1': new BBTagRule('a[onclick^="QuoteJump"]', -1, 2, new MoreInfo('attr', 'onclick', /QuoteJump\(event, '[^']+'\)/, 0, 0), 'url'),
                    'star': new BBTagRule('li', -1, 1, new MoreInfo(), 'star'),
                    'pre': new BBTagRule('pre:not(.prettyprint.linenums)', -1, 2, new MoreInfo(), 'pre'),
                    'code': new BBTagRule('code', -1, 2, new MoreInfo(), 'code'),
                    'comparison': new BBTagRule('a[onclick^="BBCode.ScreenshotComparisonToggleShow"]', -1, 2, new MoreInfo('attr', 'onclick', /.+/, 0, 1), 'comparison'),
                    'indent': new BBTagRule('div.bbcode_indent', -1, 2, new MoreInfo(), 'indent'),
                    'video': new BBTagRule('iframe.youtube-player', -1, 2, new MoreInfo('prop', 'src', /embed\/([^?]+)\?/, 1, 1), 'video')
                },
                'string': {
                    'quote': new Replacer(/<b class="\$ez_h2b\$">([^<]+)<\/b> [wW]rote: (<quote)( class="\$ez_h2b\$")>/g, function(match, p1, p2, p3){
                        return p2 + '=' + encodeURIComponent(p1) + p3 + ' _ez-upper_="' + getUpperLocation(p1) + '">';
                    }),
                    'quote1': new Replacer(/<url=quotejump\(event%2c%20'([^']+)'\) class="\$ez_h2b\$"><b class="\$ez_h2b\$">([^<]+)<\/b> [wW]rote: <\/url=[^>]+>(<quote)( class="\$ez_h2b\$")>/g, function(match, p1, p2, p3, p4){
                        return p3 + '=' + encodeURIComponent(p2 + '|' + p1 + '|undefined') + p4 + ' _ez-upper_="' + getUpperLocation(p2) + '">';
                    }),
                    'quote2': new Replacer(/<b class="\$ez_h2b\$">([^<]+) [wW]rote: <\/b>(<quote)( class="\$ez_h2b\$")>/g, function(match, p1, p2, p3){
                        return p2 + '=' + encodeURIComponent(p1) + p3 + ' _ez-upper_="' + getUpperLocation(p1) + '">';
                    }),
                    'quote3': new Replacer(/<b class="\$ez_h2b\$">([^<]+) [wW]rote:<\/b> <url=([^>]+)><img=[^>]+><\/img=[^>]+><\/url=[^>]+>(<quote)( class="\$ez_h2b\$")>/g, function(match, p1, p2, p3, p4){
                        try{
                            return p3 + '=' + encodeURIComponent(p1 + ':f' + p2.match(/threadid%3d([^%]+)%/)[1] + ':' + p2.match(/postid%3d([^%]+)%/)[1]) + p4 + ' _ez-upper_="' + getUpperLocation(p1) + '">';
                        }
                        catch(error){
                            return p3 + '=' + encodeURIComponent(p1 + ':t' + p2.match(/%3fid%3d([^%]+)%/)[1] + ':' + p2.match(/postid%3d([^%]+)%/)[1]) + p4 + ' _ez-upper_="' + getUpperLocation(p1) + '">';
                        }
                    }),//
                    'spoiler1': new Replacer(/<b class="\$ez_h2b\$">([^<]+)<\/b>: <url=[^>]+>(?:Hide|Show)<\/url=[^>]+>(<spoiler)( class="\$ez_h2b\$")>/g, function(match, p1, p2 ,p3){
                        if(p1==='Hidden text'){
                            return p2 + p3 +'>';
                        }
                        else{
                            return p2 + '=' + encodeURIComponent(p1) + p3 + ' _ez-upper_="' + getUpperLocation(p1) + '">';
                        }
                    }),
                    'spoiler2': new Replacer(/<b class="\$ez_h2b\$">([^<]+)<\/b> <url=[^>]+>\[(?:hide|show)\]<\/url=[^>]+>(<spoiler)( class="\$ez_h2b\$")>/g, function(match, p1, p2 ,p3){
                        if(p1==='Spoiler'){
                            return p2 + p3 +'>';
                        }
                        else{
                            return p2 + '=' + encodeURIComponent(p1) + p3 + ' _ez-upper_="' + getUpperLocation(p1) + '">';
                        }
                    }),
                    'hide': new Replacer(/<b class="\$ez_h2b\$">([^<]+)<\/b>: <url=[^>]+>(?:Hide|Show)<\/url=[^>]+>(<hide)( class="\$ez_h2b\$")>/g, function(match, p1, p2 ,p3){
                        if(p1==='Spoiler'){
                            return p2 + p3 +'>';
                        }
                        else{
                            return p2 + '=' + encodeURIComponent(p1) + p3 + ' _ez-upper_="' + getUpperLocation(p1) + '">';
                        }
                    }),
                    'mi': new Replacer(/<url=[^>]+>[^<]+<\/url=[^>]+><hide class="\$ez_h2b\$">((?:(?!<\/hide>)[\s\S])+)<\/hide>/g, '<mi class="$ez_h2b$">$1</mi>'),
                    'img': new Replacer(/<\/img=[^>]+>/g, ''),
                    'url': new Replacer(/<url=[^>]+><\/url=[^>]+>/g, ''),
                    'hr': new Replacer(/<\/hr>/g, ''),
                    'comparison': new Replacer(/<b class="\$ez_h2b\$">[^<]+<\/b>: <comparison=([^ >]+) class="\$ez_h2b\$" _ez-upper_="([^"]+)">Show comparison<\/comparison=[^>]+>/g, function(match, p1, p2){
                        p1 = decodeURIComponent(p1);
                        var new_p = p1.split('');
                        if(p2!=='-1'){
                            p2.split(';').forEach(function(e){
                                new_p[e] = new_p[e].toUpperCase();
                            });
                        }
                        p1 = new_p.join('').replace(/\\\//g,'/');
                        return p1.replace(/^[^[]+\[([^\]]+)\], \[([^\]]+)\].+$/, function(match, sp1, sp2){
                            var info_bb = sp1.split(',').map(function(e){
                                return e.slice(1,-1);
                            }).join(',');
                            var inner_txt = sp2.split(',').map(function(e){
                                return e.slice(1,-1);
                            }).join('<br>');
                            return '<comparison=' + encodeURIComponent(info_bb) + ' class="$ez_h2b$" _ez-upper_="' + getUpperLocation(info_bb) + '">' + inner_txt + '</comparison=' + encodeURIComponent(info_bb) + '>';
                        });
                    }),
                    'video': new Replacer(/<video=([^> ]+) class="\$ez_h2b\$" _ez-upper_="([^"]+)"><\/video=[^>]+>/, function(match, p1, p2){
                        p1 = decodeURIComponent(p1);
                        var new_p = p1.split('');
                        if(p2!=='-1'){
                            p2.split(';').forEach(function(e){
                                new_p[e] = new_p[e].toUpperCase();
                            });
                        }
                        p1 = new_p.join('');
                        return '<video class="$ez_h2b$">http://www.youtube.com/watch?v=' + p1 + '</video>';
                    }),
                    'mention': new Replacer(/<user class="\$ez_h2b\$">(@[^<]+)<\/user>/g, '$1')
                }
            }
        },
        nexusphp_uni_rules: {
            'base': /.+/,
            'rules': {
                'jquery': {
                    'b': new BBTagRule('b:not(blockquote.quote>span.nowrap>a.username>b)', -1, 2, new MoreInfo(), 'b'),
                    'b2': new BBTagRule('strong', -1, 2, new MoreInfo(), 'b'),
                    'i': new BBTagRule('i', -1, 2, new MoreInfo(), 'i'),
                    'u': new BBTagRule('u', -1, 2, new MoreInfo(), 'u'),
                    'del': new BBTagRule('del', -1, 2, new MoreInfo(), 'del'),
                    'hr': new BBTagRule('hr', -1, 1, new MoreInfo(), 'hr'),
                    'center': new BBTagRule('div[style*="text-align:center"]', -1, 2, new MoreInfo(), 'center'),
                    'center2': new BBTagRule('center', -1, 2, new MoreInfo(), 'center'),
                    'center3': new BBTagRule('div[align*="center"]', -1, 2, new MoreInfo(), 'center'),
                    'right': new BBTagRule('div[style*="text-align:right"]', -1, 2, new MoreInfo(), 'right'),
                    'right2': new BBTagRule('div[align*="right"]', -1, 2, new MoreInfo(), 'right'),
                    'left': new BBTagRule('div[style*="text-align:left"]', -1, 2, new MoreInfo(), 'left'),
                    'left2': new BBTagRule('div[align*="left"]', -1, 2, new MoreInfo(), 'left'),
                    'color': new BBTagRule('span[style*="color"]', -1, 2, new MoreInfo('css', 'color', /.+/, 0, 0), 'color'),
                    'color2': new BBTagRule('font[color]', -1, 2, new MoreInfo('prop', 'color', /.+/, 0, 0), 'color'),
                    'font': new BBTagRule('font[face]', -1, 2, new MoreInfo('prop', 'face', /.+/, 0, 0), 'font'),
                    'size': new BBTagRule('font[size]', -1, 2, new MoreInfo('prop', 'size', /.+/, 0, 0), 'size'),
                    'url': new BBTagRule('a[href]:not(.username)', -1, 2, new MoreInfo('prop', 'href', /.+/, 0, 1), 'url'),
                    'img': new BBTagRule('img[src]:not(.listicon)', -1, 1, new MoreInfo('prop', 'src', /.+/, 0, 1), 'img'),
                    'p': new BBTagRule('p:not(blockquote.quote>p,p.sub)', -1, 2, new MoreInfo(), 'paragraph'),
                    'quotehead': new BBTagRule('blockquote.quote>p,p.sub', -1, 2, new MoreInfo(), 'quotehead'),
                    'quotehead2': new BBTagRule('blockquote.quote>span.nowrap>a.username>b', 1, 2, new MoreInfo(), 'quotehead'),
                    'quote': new BBTagRule('fieldset,blockquote.quote', -1, 2, new MoreInfo(), 'quote'),
                    'quote2': new BBTagRule('table.main>tbody>tr>td[style*="dotted"]', 2, 2, new MoreInfo(), 'quote'),
                    'xp': new BBTagRule('img.listicon', -1, 1, new MoreInfo(), 'xp'),
                    'ol': new BBTagRule('ol', -1, 2, new MoreInfo(), 'ol'),
                    'ul': new BBTagRule('ul', -1, 2, new MoreInfo(), 'ul'),
                    'li': new BBTagRule('ol>li, ul>li', -1, 2, new MoreInfo(), 'li'),
                    'star': new BBTagRule('li:not(ol>li, ul>li)', -1, 1, new MoreInfo(), 'star'),
                    'pre': new BBTagRule('pre:not(.prettyprint.linenums)', -1, 2, new MoreInfo(), 'pre'),
                    'pre2': new BBTagRule('tt>nobr', 0, 2, new MoreInfo(), 'pre'),
                    'code': new BBTagRule('div.codemain', -1, 2, new MoreInfo(), 'code'),
                    'code2': new BBTagRule('pre.prettyprint.linenums', -1, 2, new MoreInfo(), 'code'),
                    'box': new BBTagRule('div.spoiler_body', -1, 2, new MoreInfo(), 'box'),
                    'boxhead': new BBTagRule('div.spoiler_head', -1, 2, new MoreInfo(), 'boxhead'),
                    'table': new BBTagRule('table', -1, 2, new MoreInfo(), 'table'),
                    'tr': new BBTagRule('tr', -1, 2, new MoreInfo(), 'tr'),
                    'td': new BBTagRule('td', -1, 2, new MoreInfo(), 'td')
                },
                'string': {
                    'img': new Replacer(/<\/img=[^>]+>/g, ''),
                    'url': new Replacer(/<url=[^>]+><\/url=[^>]+>/g, ''),
                    'quote': new Replacer(/(<quote)( class="\$ez_h2b\$")>[^:<]+:? (?:([^<]+) )?<br>/g, function(match, p1, p2, p3){
                        if(p3){
                            return p1 + '=' + encodeURIComponent(p3) + p2 + ' _ez-upper_="' + getUpperLocation(p3) + '">';
                        }
                        else{
                            return p1 + p2 + '>';
                        }
                    }),
                    'quote2': new Replacer(/(<quote)( class="\$ez_h2b\$")>(?:引用: )?(?:<quotehead class="\$ez_h2b\$">)?([^<]+)(?:<\/quotehead><br>|<\/quotehead>|<br>)/g, function(match, p1, p2, p3){
                        if(p3 !== ' 引用 '){
                            return p1 + '=' + encodeURIComponent(p3) + p2 + ' _ez-upper_="' + getUpperLocation(p3) + '">';
                        }
                        else{
                            return p1 + p2 + '>';
                        }
                    }),
                    'quote3': new Replacer(/<quotehead class="\$ez_h2b\$"><b class="\$ez_h2b\$">(?:([^<]+) wrote:|Quote:)<\/b><\/quotehead>(<quote)( class="\$ez_h2b\$")>/g, function(match, p1, p2, p3){
                        if(p1){
                            return p2 + '=' + encodeURIComponent(p1) + p3 + ' _ez-upper_="' + getUpperLocation(p1) + '">';
                        }
                        else{
                            return p2 + p3 + '>';
                        }
                    }),
                    'box': new Replacer(/<boxhead class="\$ez_h2b\$">([^<]*)<\/boxhead>(<box)( class="\$ez_h2b\$")>/g, function(match, p1, p2, p3){
                        if(p1 && p1!=='collapsed text' && p1!=='隐藏内容'){
                            return p2 + '=' + encodeURIComponent(p1) + p3 + ' _ez-upper_="' + getUpperLocation(p1) + '">';
                        }
                        else{
                            return p2 + p3 + '>';
                        }
                    }),
                    'hr': new Replacer(/<\/hr>/g, ''),
                    'codeend': new Replacer(/(<\/code>)<br>/g, '$1'),
                    'codehead': new Replacer(/<br>(<code class="\$ez_h2b\$">)/g, '$1'),
                }
            }
        },
        universe_replace: [
            new Replacer(/<([^> ]+) class="\$ez_h2b\$"/g, '<$1'),
            new Replacer(/ _ez-upper_="-1"/g, ''),
            new Replacer(/\n/g, ''),
            new Replacer(/<br>/g, '\n'),
            new Replacer(/(<\/[^=>]+)=[^>]+>/g, '$1>'),
            new Replacer(/([^\n])<star>/g, '$1\n<star>'),
            new Replacer(/([^\n])<xp>/g, '$1\n<xp>'),
            new Replacer(/<\/star>([^\n])/g, '\n$1'),
            new Replacer(/<\/star>/g, ''),
            new Replacer(/<\/xp>/g, ''),
            new Replacer(/<star>/g, '<*>'),
            new Replacer(/<xp>/g, '<*>'),
            new Replacer(/<paragraph>/g, ''),
            new Replacer(/<\/paragraph>/g, '\n'),
            new Replacer(/<\/?tbody>/g, ''),
            new Replacer(/&quote;/g, '"'),
            new Replacer(/&lt;/g, '<'),
            new Replacer(/&gt;/g, '>'),
            new Replacer(/&amp;/g, '&'),
            new Replacer(/&nbsp;/g, ' ')
        ],
        final_replace: [
            new Replacer(/\[img=([^\]]+)](?:\[\/img\])?/g, '[img]$1[/img]'),
        ],
        redirect_list: [
            new Replacer(/^https?:\/\/anonym\.to\/\?(.+$)/, '$1'),
            new Replacer(/^https?:\/\/anon\.to\/\?(.+$)/, '$1'),
            new Replacer(/^https?:\/\/nullrefer\.com\/\?(.+$)/, '$1'),
            new Replacer(/^https?:\/\/blankrefer\.com\/\?(.+$)/, '$1'),
            new Replacer(/^https?:\/\/www\.dereferer\.org\/\?(.+$)/, function(match, p1){
                return decodeURIComponent(p1);
            })//...to be continued
        ],
        black_list: ['script','table.mediainfo','div.codetop','span.fa'].join(',')
    };
    /*--AHD--*/
    H2B.ahd_rules = $.extend(true, {}, H2B.gazelle_uni_rules);
    H2B.ahd_rules.base = 'awesome-hd.me';
    /*--UHD--*/
    H2B.uhd_rules = $.extend(true, {}, H2B.gazelle_uni_rules);
    H2B.uhd_rules.base = 'uhdbits.org';
    delete H2B.uhd_rules.rules.string.img;
    delete H2B.uhd_rules.rules.string.url;
    /*--PTP--*/
    H2B.ptp_rules = $.extend(true, {}, H2B.gazelle_uni_rules);
    H2B.ptp_rules.base = 'passthepopcorn.me';
    H2B.ptp_rules.rules.jquery.spoiler1 = new BBTagRule('span.spoiler', -1, 2, new MoreInfo(), 'spoiler');
    H2B.ptp_rules.rules.jquery.hide = new BBTagRule('blockquote.spoiler', -1, 2, new MoreInfo(), 'hide');
    H2B.ptp_rules.rules.jquery.user = new BBTagRule('a[href^="user.php?action=search&search="]', -1, 2, new MoreInfo(), 'user');
    H2B.ptp_rules.rules.jquery.artist = new BBTagRule('a[href^="artist.php?artistname="]', -1, 2, new MoreInfo(), 'artist');
    H2B.ptp_rules.rules.jquery.movie = new BBTagRule('a[href^="torrents.php?searchstr="]', -1, 2, new MoreInfo(), 'movie');
    H2B.ptp_rules.rules.jquery.url = new BBTagRule('a[href]:not('+[
        H2B.ptp_rules.rules.jquery.user.HTMLSelectorL,
        H2B.ptp_rules.rules.jquery.artist.HTMLSelectorL,
        H2B.ptp_rules.rules.jquery.movie.HTMLSelectorL,
        H2B.ptp_rules.rules.jquery.comparison.HTMLSelectorL,
    ].join(',')+')', -1, 2, new MoreInfo('prop', 'href', /.+/i, 0, 1), 'url');
    /*--BTN--*/
    H2B.btn_rules = $.extend(true, {}, H2B.gazelle_uni_rules);
    H2B.btn_rules.base = 'broadcasthe.net';
    /*--NHD--*/
    H2B.nhd_rules = $.extend(true, {}, H2B.nexusphp_uni_rules);
    H2B.nhd_rules.base = 'nexushd.org';
    H2B.nhd_rules.rules.string.quoteend = new Replacer(/(<\/quote[^>]*>)<br>/g, '$1');
    /*--NPU--*/
    H2B.npu_rules = $.extend(true, {}, H2B.nexusphp_uni_rules);
    H2B.npu_rules.base = 'npupt.com';
    /*--TTG--*/
    H2B.ttg_rules = $.extend(true, {}, H2B.nexusphp_uni_rules);
    H2B.ttg_rules.base = 'totheglory.im';
    /*--HDChina--*/
    H2B.hdc_rules = $.extend(true, {}, H2B.nexusphp_uni_rules);
    H2B.hdc_rules.base = 'hdchina.org';
    /*--Ourbits--*/
    H2B.ob_rules = $.extend(true, {}, H2B.nexusphp_uni_rules);
    H2B.ob_rules.base = 'ourbits.club';
    /*--HDHome--*/
    H2B.hdh_rules = $.extend(true, {}, H2B.nexusphp_uni_rules);
    H2B.hdh_rules.base = 'hdhome.org';
    /*--TorViet--*/
    H2B.torviet_rules = $.extend(true, {}, H2B.nexusphp_uni_rules);
    H2B.torviet_rules.base = 'torviet.com';
    /*--Univers--*/
    H2B.universe_rules = {
        'base': /.+/,
        'rules': {
            'jquery': null,
            'string': null
        }
    };
    H2B.universe_rules.rules.jquery = arrayUnique(Object.values(H2B.nexusphp_uni_rules.rules.jquery).concat(Object.values(H2B.gazelle_uni_rules.rules.jquery)), null);
    H2B.universe_rules.rules.string = arrayUnique(Object.values(H2B.nexusphp_uni_rules.rules.string).concat(Object.values(H2B.gazelle_uni_rules.rules.string)), null);
    H2B.h2b_rules = [H2B.ahd_rules,
                     H2B.uhd_rules,
                     H2B.ptp_rules,
                     H2B.btn_rules,
                     H2B.nhd_rules,
                     H2B.npu_rules,
                     H2B.ttg_rules,
                     H2B.hdc_rules,
                     H2B.ob_rules,
                     H2B.hdh_rules,
                     H2B.torviet_rules];
    H2B.moreinfo_error_cbk = function(){return 0;},
    H2B.HTML2BBCode = function (content){
        var description_obj;
        description_obj = $('<ezentity>').append($(content).clone());
        description_obj.find(H2B.black_list).add(description_obj.filter(H2B.black_list)).remove();
        $(description_obj.find('*').add(description_obj.filter('*')).contents().filter(function(){
            return this.nodeType == 8;
        })).remove();
        var description_txt = description_obj[0].innerHTML.trim();
        if(!H2B.h2b_rules.some(function(e_0){
            if(window.location.href.match(e_0.base)){
                Object.values(e_0.rules.jquery).forEach(function(e_1){
                    e_1.updateTarget(description_obj);
                });
                description_obj.find(':not([class="$ez_h2b$"],br)').sort(function(a, b){
                    return $(b).parents().length - $(a).parents().length;
                }).map(function(){
                    this.outerHTML = this.innerHTML;
                });
                description_txt = description_obj[0].innerHTML.trim();
                Object.values(e_0.rules.string).forEach(function(e_1){
                    description_txt = e_1.replaceThis(description_txt);
                });
                return true;
            }
        })){
            H2B.universe_rules.rules.jquery.forEach(function(e_1){
                e_1.updateTarget(description_obj);
            });
            description_obj.find(':not([class="$ez_h2b$"],br)').sort(function(a, b){
                return $(b).parents().length - $(a).parents().length;
            }).map(function(){
                this.outerHTML = this.innerHTML;
            });
            description_txt = description_obj[0].innerHTML.trim();
            //console.log(description_txt);
            H2B.universe_rules.rules.string.forEach(function(e_1){
                description_txt = e_1.replaceThis(description_txt);
            });
        }
        description_txt = uniRep(description_txt);
        description_txt = deCode(description_txt);
        description_txt = finalRep(description_txt);
        return description_txt;
    }
    return H2B;
}());