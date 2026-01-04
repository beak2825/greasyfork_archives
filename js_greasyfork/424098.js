// ==UserScript==
// @name         脚本烤推机
// @namespace    https://github.com/chenxuan353/tampermonkey/
// @version      0.1
// @description  通过JS脚本烤推注入的烤推机，未来可能集成至扩展中。拥有友好界面，由于推特严格的CSP限制，故使用了GM_addElement，需要油猴4.11+
// @author       chenxuan
// @match        https://twitter.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addElement
// @grant        GM_log
// @resource     layer https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/layer.min.css
// @resource     bootstrap https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/layer.min.js
// @require      https://cdn.jsdelivr.net/npm/wangeditor@latest/dist/wangEditor.min.js
// @require      https://unpkg.com/vue@2.6.12/dist/vue.js
// @downloadURL https://update.greasyfork.org/scripts/424098/%E8%84%9A%E6%9C%AC%E7%83%A4%E6%8E%A8%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/424098/%E8%84%9A%E6%9C%AC%E7%83%A4%E6%8E%A8%E6%9C%BA.meta.js
// ==/UserScript==
/*! Copyright Twitter Inc. and other contributors. Licensed under MIT */
var twemoji=function(){"use strict";var twemoji={base:"https://twemoji.maxcdn.com/v/13.0.0/",ext:".png",size:"72x72",className:"emoji",convert:{fromCodePoint:fromCodePoint,toCodePoint:toCodePoint},onerror:function onerror(){if(this.parentNode){this.parentNode.replaceChild(createText(this.alt,false),this)}},parse:parse,replace:replace,test:test},escaper={"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"},re=/(?:\ud83d\udc68\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc68\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc68\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1|\ud83d\udc6b\ud83c[\udffb-\udfff]|\ud83d\udc6c\ud83c[\udffb-\udfff]|\ud83d\udc6d\ud83c[\udffb-\udfff]|\ud83d[\udc6b-\udc6d])|(?:\ud83d[\udc68\udc69]|\ud83e\uddd1)(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf7c\udf84\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddaf-\uddb3\uddbc\uddbd])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc70\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddcd-\uddcf\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc15\u200d\ud83e\uddba|\ud83d\udc3b\u200d\u2744\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|\ud83d\udc08\u200d\u2b1b)|[#*0-9]\ufe0f?\u20e3|(?:[©®\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26a7\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd0c\udd0f\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\udd77\uddb5\uddb6\uddb8\uddb9\uddbb\uddcd-\uddcf\uddd1-\udddd]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\uded5-\uded7\udeeb\udeec\udef4-\udefc\udfe0-\udfeb]|\ud83e[\udd0d\udd0e\udd10-\udd17\udd1d\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd3f-\udd45\udd47-\udd76\udd78\udd7a-\uddb4\uddb7\uddba\uddbc-\uddcb\uddd0\uddde-\uddff\ude70-\ude74\ude78-\ude7a\ude80-\ude86\ude90-\udea8\udeb0-\udeb6\udec0-\udec2\uded0-\uded6]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g,UFE0Fg=/\uFE0F/g,U200D=String.fromCharCode(8205),rescaper=/[&<>'"]/g,shouldntBeParsed=/^(?:iframe|noframes|noscript|script|select|style|textarea)$/,fromCharCode=String.fromCharCode;return twemoji;function createText(text,clean){return document.createTextNode(clean?text.replace(UFE0Fg,""):text)}function escapeHTML(s){return s.replace(rescaper,replacer)}function defaultImageSrcGenerator(icon,options){return"".concat(options.base,options.size,"/",icon,options.ext)}function grabAllTextNodes(node,allText){var childNodes=node.childNodes,length=childNodes.length,subnode,nodeType;while(length--){subnode=childNodes[length];nodeType=subnode.nodeType;if(nodeType===3){allText.push(subnode)}else if(nodeType===1&&!("ownerSVGElement"in subnode)&&!shouldntBeParsed.test(subnode.nodeName.toLowerCase())){grabAllTextNodes(subnode,allText)}}return allText}function grabTheRightIcon(rawText){return toCodePoint(rawText.indexOf(U200D)<0?rawText.replace(UFE0Fg,""):rawText)}function parseNode(node,options){var allText=grabAllTextNodes(node,[]),length=allText.length,attrib,attrname,modified,fragment,subnode,text,match,i,index,img,rawText,iconId,src;while(length--){modified=false;fragment=document.createDocumentFragment();subnode=allText[length];text=subnode.nodeValue;i=0;while(match=re.exec(text)){index=match.index;if(index!==i){fragment.appendChild(createText(text.slice(i,index),true))}rawText=match[0];iconId=grabTheRightIcon(rawText);i=index+rawText.length;src=options.callback(iconId,options);if(iconId&&src){img=new Image;img.onerror=options.onerror;img.setAttribute("draggable","false");attrib=options.attributes(rawText,iconId);for(attrname in attrib){if(attrib.hasOwnProperty(attrname)&&attrname.indexOf("on")!==0&&!img.hasAttribute(attrname)){img.setAttribute(attrname,attrib[attrname])}}img.className=options.className;img.alt=rawText;img.src=src;modified=true;fragment.appendChild(img)}if(!img)fragment.appendChild(createText(rawText,false));img=null}if(modified){if(i<text.length){fragment.appendChild(createText(text.slice(i),true))}subnode.parentNode.replaceChild(fragment,subnode)}}return node}function parseString(str,options){return replace(str,function(rawText){var ret=rawText,iconId=grabTheRightIcon(rawText),src=options.callback(iconId,options),attrib,attrname;if(iconId&&src){ret="<img ".concat('class="',options.className,'" ','draggable="false" ','alt="',rawText,'"',' src="',src,'"');attrib=options.attributes(rawText,iconId);for(attrname in attrib){if(attrib.hasOwnProperty(attrname)&&attrname.indexOf("on")!==0&&ret.indexOf(" "+attrname+"=")===-1){ret=ret.concat(" ",attrname,'="',escapeHTML(attrib[attrname]),'"')}}ret=ret.concat("/>")}return ret})}function replacer(m){return escaper[m]}function returnNull(){return null}function toSizeSquaredAsset(value){return typeof value==="number"?value+"x"+value:value}function fromCodePoint(codepoint){var code=typeof codepoint==="string"?parseInt(codepoint,16):codepoint;if(code<65536){return fromCharCode(code)}code-=65536;return fromCharCode(55296+(code>>10),56320+(code&1023))}function parse(what,how){if(!how||typeof how==="function"){how={callback:how}}return(typeof what==="string"?parseString:parseNode)(what,{callback:how.callback||defaultImageSrcGenerator,attributes:typeof how.attributes==="function"?how.attributes:returnNull,base:typeof how.base==="string"?how.base:twemoji.base,ext:how.ext||twemoji.ext,size:how.folder||toSizeSquaredAsset(how.size||twemoji.size),className:how.className||twemoji.className,onerror:how.onerror||twemoji.onerror})}function replace(text,callback){return String(text).replace(re,callback)}function test(text){re.lastIndex=0;var result=re.test(text);re.lastIndex=0;return result}function toCodePoint(unicodeSurrogates,sep){var r=[],c=0,p=0,i=0;while(i<unicodeSurrogates.length){c=unicodeSurrogates.charCodeAt(i++);if(p){r.push((65536+(p-55296<<10)+(c-56320)).toString(16));p=0}else if(55296<=c&&c<=56319){p=c}else{r.push(c.toString(16))}}return r.join(sep||"-")}}();


(function () {
    "use strict";
    // 重定向关键函数
    Function = function (script) {
        GM_addElement("script", {
            id: "loadFunction",
            textContent:
                "window.generateFunction = function(){" + script + "};",
        });
        let func = unsafeWindow.generateFunction;
        try {
            document.querySelector("#loadFunction").remove();
        } catch (error) {
            //
        }
        return unsafeWindow.generateFunction;
    };
    const CONFIG = {
        debug: false,
        isEdit: true,
        loopShowHide: true,
        autoParsing: true,
        replay_cover: false,
        quote_cover: false,
        main_cover: false,
        trans_tamplate: "default", // 对应模版分组里的键
        trans_tamplate_str: `<p>翻译自日语</p>`,
        trans_tamplates: {
            default: `<p>翻译自日语</p>`,
            test1: `<p>翻译自日语v1</p>`,
            test2: `<p>翻译自日语v2</p>`,
            test3: `<p>翻译自日语v3</p>`,
        },
    };
    const CONFIG_DES = {
        replay_cover: {
            key: "replay_cover",
            title: "回复覆盖",
            des: "调整回复覆盖，开启后将覆盖原文",
        },
        quote_cover: {
            key: "quote_cover",
            title: "引用覆盖",
            des: "调整引用覆盖，开启后将覆盖原文",
        },
        main_cover: {
            key: "main_cover",
            title: "主推文覆盖",
            des: "调整主推文覆盖，开启后将覆盖原文",
        },
        debug: {
            key: "debug",
            title: "调试模式",
            des: "调试模式的开关",
        },
        loopShowHide: {
            key: "loopShowHide",
            title: "显示隐私内容",
            des: "自动显示隐私内容的开关，开启后会自动点击隐私内容的显示按钮。",
        },
        autoParsing: {
            key: "autoParsing",
            title: "自动解析",
            des: "进入推文查看页面时自动解析推文",
        },
        trans_tamplate: {
            key: "trans_tamplate",
            title: "翻译标识",
            des: "当前使用的翻译标识",
        },
        trans_tamplates: {
            key: "trans_tamplates",
            title: "翻译标识存档",
            des: "用户保存的所有翻译标识",
        },
    };
    const CONFIG_SWITCH = [
        "debug",
        "loopShowHide",
        "autoParsing",
        "replay_cover",
        "quote_cover",
        "main_cover",
    ];

    // 配置管理
    const ConfigTool = {};
    (function () {
        // 配置管理需要有合并与自动更新锚点的功能
        ConfigTool.CONFIG = CONFIG;
        ConfigTool.CONFIG_DES = CONFIG_DES;
        ConfigTool.CONFIG_SWITCH = CONFIG_SWITCH;
        ConfigTool.config = CONFIG;
        ConfigTool.saveConfig = function () {
            GM_setValue("config", JSON.stringify(ConfigTool.config));
        };
        ConfigTool.readConfig = function () {
            try {
                Object.assign(
                    ConfigTool.config,
                    JSON.parse(GM_getValue("config", "{}"))
                );
            } catch (error) {
                console.log(error);
                GM_setValue("config", "{}");
                ConfigTool.readConfig();
            }
        };
        ConfigTool.setConfig = function (key, value) {
            ConfigTool.config[key] = value;
        };
        ConfigTool.getConfig = function (key, defval = null) {
            if (ConfigTool.config[key] == null) {
                return defval;
            }
            return ConfigTool.config[key];
        };
    })();

    // 日志
    const Logger = {};
    (function () {
        if (typeof GM_log == "undefined") {
            var GM_log = console.log;
        }
        Logger.LEVELSTRS = [
            "",
            "[错误]",
            "[异常]",
            "[警告]",
            "[信息]",
            "[调试]",
        ];
        Logger.LEVELS = {
            NORMAL: 0,
            ERROR: 1,
            EXCEPTION: 2,
            WARNING: 3,
            INFO: 4,
            DEBUG: 5,
        };
        Logger.out = function (msg, level = Logger.LEVELS.NORMAL, ...args) {
            GM_log(Logger.LEVELSTRS[level], msg, ...args);
        };
        Logger.normal = function (msg, ...args) {
            Logger.out(msg, Logger.LEVELS.NORMAL, ...args);
        };
        Logger.error = function (msg, ...args) {
            console.trace();
            Logger.out(msg, Logger.LEVELS.ERROR, ...args);
        };
        Logger.exception = function (msg, ...args) {
            if (msg instanceof Error && ConfigTool.getConfig("debug", false)) {
                Logger.out(msg.stack, Logger.LEVELS.EXCEPTION);
            } else {
                console.trace();
            }
            Logger.out(msg, Logger.LEVELS.EXCEPTION, ...args);
        };
        Logger.warning = function (msg, ...args) {
            Logger.out(msg, Logger.LEVELS.WARNING, ...args);
        };
        Logger.info = function (msg, ...args) {
            Logger.out(msg, Logger.LEVELS.INFO, ...args);
        };
        Logger.debug = function (msg, ...args) {
            if (ConfigTool.getConfig("debug", false)) {
                Logger.out(msg, Logger.LEVELS.DEBUG, ...args);
            }
        };
    })();
    // 注入AJAX Hook用于监控页面响应
    const AjaxHook = {};
    (function () {
        // 使函数拥有唯一ID
        (function () {
            var id_counter = 1;
            Object.defineProperty(Function.prototype, "__uniqueId", {
                writable: true,
            });
            Object.defineProperty(Function.prototype, "uniqueId", {
                get: function () {
                    if (this.__uniqueId == undefined) {
                        this.__uniqueId = id_counter++;
                    }
                    return this.__uniqueId;
                },
            });
        })();
        AjaxHook.AJAXSTATUS = {
            CREATE: "CREATE", // 创建
            OPEN: "OPEN", // 打开
            SEND: "SEND", // 发送
            LOADED: "LOADED", // 完毕
        };
        // 收集Http状态及历史
        AjaxHook.history = [];
        // 全局AJAX钩子，用于接收并处理页面AJAX响应
        AjaxHook._AjaxHooks = {};
        AjaxHook.addHook = function (func, flag = null) {
            if (flag != null) {
                AjaxHook._AjaxHooks[func.uniqueId] = function (
                    historyitem,
                    status
                ) {
                    if (status == flag) {
                        func(historyitem);
                    }
                };
                return;
            }
            AjaxHook._AjaxHooks[func.uniqueId] = func;
        };
        AjaxHook.removeHook = function (func) {
            delete AjaxHook._AjaxHooks[func.uniqueId];
        };

        // hook的前置处理函数
        AjaxHook._deal = {};
        // 添加历史
        AjaxHook._deal.addHistory = function (hisitem) {
            AjaxHook.history.push(hisitem);
        };
        // 状态Hook
        AjaxHook._deal.statusTrigger = function (httpitem, status) {
            for (let hookid in AjaxHook._AjaxHooks) {
                let hook = AjaxHook._AjaxHooks[hookid];
                try {
                    hook(httpitem, status);
                } catch (error) {
                    Logger.exception(error);
                }
            }
        };
        // 解析响应数据
        AjaxHook._deal.getResponse = function (xmlhttp) {
            let resp = {
                status: xmlhttp.status,
                url: xmlhttp.responseURL,
                responseText:
                    xmlhttp.responseType == "" || xmlhttp.responseType == "text"
                        ? xmlhttp.responseText
                        : "",
            };
            let contentType = xmlhttp.getResponseHeader("content-type");
            if (contentType && contentType.indexOf("application/json") != -1) {
                try {
                    resp.json = JSON.parse(resp.responseText);
                } catch (e) {
                    resp.jsonerr = e;
                }
            }
            return resp;
        };
        // 创建请求记录Item
        AjaxHook._deal.getHttpHistoryItem = function (xmlhttp) {
            let AJAXSTATUS = AjaxHook.AJAXSTATUS;
            // 状态文本
            const READYSTATESTRS = [
                "未初始化(create)", // 0
                "请求建立(open)", // 1
                "请求发送(send)", // 2
                "数据接收中(receive)", // 3
                "响应已完成(complate)", // 4
            ];

            let getResponse = AjaxHook._deal.getResponse;
            let newItem = {
                statestr: "未创建",
                status: 0,
                method: "",
                url: "",
                responseURL: "",
                response: null,
                state: -1,
                xmlhttp: xmlhttp,
                createtime: new Date().getTime(),
                requesttime: 0,
                receivetime: 0,
                complatetime: 0,
                _updatestate() {
                    let xmlhttp = this.xmlhttp;
                    this.state = xmlhttp.readyState;
                    this.statestr = READYSTATESTRS[this.state];
                    this.status = xmlhttp.status;
                },
                _readyStateHook() {
                    const AJAXSTATUS_ARR = [
                        AJAXSTATUS.CREATE,
                        AJAXSTATUS.OPEN,
                        AJAXSTATUS.SEND,
                        AJAXSTATUS.SEND,
                        AJAXSTATUS.LOADED,
                    ];
                    let dealfuncs = AjaxHook._deal;
                    let xmlhttp = this.xmlhttp;
                    /**
                        状态变化时函数会被调用
                        0：请求未初始化（还没有调用 open()）。
                        1：请求已经建立，但是还没有发送（还没有调用 send()）。
                        2：请求已发送，正在处理中（通常现在可以从响应中获取内容头）。
                        3：请求在处理中；通常响应中已有部分数据可用了，但是服务器还没有完成响应的生成。
                        4：响应已完成；您可以获取并使用服务器的响应了。
                    */

                    if (xmlhttp.readyState == 0) {
                        // ...
                    } else if (xmlhttp.readyState == 1) {
                        this.method = xmlhttp.sendMethod;
                        this.url = xmlhttp.sendUrl;
                    } else if (xmlhttp.readyState == 2) {
                        this.requesttime = new Date().getTime();
                        this.responseURL = xmlhttp.responseURL;
                    } else if (xmlhttp.readyState == 3) {
                        // ...
                        this.receivetime = new Date().getTime();
                    } else if (xmlhttp.readyState == 4) {
                        this.complatetime = new Date().getTime();
                        this.response = getResponse(xmlhttp);
                    }
                    this._updatestate();
                    //更新了状态后运行Hook
                    dealfuncs.statusTrigger(this, AJAXSTATUS_ARR[this.state]);
                },
            };
            return newItem;
        };
        // 标准Hook参数
        function standHook(historyitem, status) {
            //...
        }
        // 代理原始XMLHttpRequest类
        (function () {
            let OXMLHTTP = unsafeWindow.XMLHttpRequest;
            let PXMLHTTP = function () {
                let dealfuncs = AjaxHook._deal;
                // 创建XmlHttp代理
                var oxml = new OXMLHTTP();
                var item = dealfuncs.getHttpHistoryItem(oxml);
                // 每次创建XMLHttp对象时生成一个Item并将Item加入历史记录
                dealfuncs.addHistory(item);
                // 创建代理
                // 获取请求方法及URL
                oxml.open = new Proxy(oxml.open, {
                    apply: function (target, context, args) {
                        oxml.sendMethod = args[0];
                        oxml.sendUrl = args[1];
                        let res = Reflect.apply(...arguments);
                        item._readyStateHook();
                        return res;
                    },
                });
                // Hook请求状态
                oxml.send = new Proxy(oxml.send, {
                    apply: function (target, context, args) {
                        if (oxml.onreadystatechange == null) {
                            oxml.onreadystatechange = function () {};
                        }
                        if (oxml.onreadystatechange.isProxy != true) {
                            oxml.onreadystatechange = new Proxy(
                                oxml.onreadystatechange,
                                {
                                    apply: function (target, context, args) {
                                        item._readyStateHook();
                                        return Reflect.apply(...arguments);
                                    },
                                    get: function (target, prop, recevier) {
                                        if (prop == "isProxy") {
                                            return true;
                                        }
                                        return target[prop];
                                    },
                                }
                            );
                        }
                        return Reflect.apply(...arguments);
                    },
                });
                // 返回前触发一次状态Hook
                item._readyStateHook();
                return oxml;
            };
            // 将页面原始XMLHttpRequest替换为代理对象
            unsafeWindow.XMLHttpRequest = PXMLHTTP;
        })();
    })();

    // 注入Tweet 用于解析推文与存储收集到的推文数据
    const Tweet = {};
    (function () {
        let tTweet = Tweet;
        Tweet.isTweet = false;
        Tweet.getNowTweetId = function () {
            let nowurl = window.location.href;
            // 判断是否为推文页
            if (nowurl.lastIndexOf("/status/") == -1) {
                // 不在推文页时返回null
                tTweet.isTweet = false;
                return null;
            }
            // 删除查询参数
            if (nowurl.lastIndexOf("?") != -1) {
                nowurl = nowurl.substr(0, nowurl.lastIndexOf("?"));
            }
            tTweet.isTweet = true;
            // 获取推文ID
            return nowurl.substr(nowurl.lastIndexOf("/") + 1);
        };
        Tweet._newTweetInfo = function () {
            return {
                // 关键响应
                xmlhttpitem: null,
                // 保存当前推文ID
                nowTweetId: "",
                // 当前推文的数据
                users: {},
                tweets: {},
                tweet: null,
                user: null,
                quote: null,
                quoteuser: null,
                replay: null,
                replayuser: null,
            };
        };
        Tweet.showTweet = function () {
            let hinfo = tTweet.nowTweetInfo;
            if (hinfo == null) {
                return;
            }
            // 只有推文不存在时通知
            try {
                let showInfo = "";
                showInfo +=
                    hinfo.user.name +
                    " 发布的推文(" +
                    hinfo.tweet.id_str +
                    ")\n";
                showInfo += hinfo.tweet.full_text + "\n";
                if (hinfo.quote) {
                    showInfo += "----------" + "\n";
                    showInfo +=
                        "引用" +
                        hinfo.quoteuser.name +
                        "的推文(" +
                        hinfo.quote.id_str +
                        ")\n";
                    showInfo += hinfo.quote.full_text + "\n";
                }
                if (hinfo.replay) {
                    showInfo += "----------" + "\n";
                    showInfo +=
                        "回复" +
                        hinfo.replayuser.name +
                        "的推文(" +
                        hinfo.replay.id_str +
                        ")\n";
                    showInfo += hinfo.replay.full_text + "\n";
                }
                Logger.info(showInfo);
            } catch (e) {
                Logger.exception(e);
            }
        };
        Tweet.getUpLevel = function (tweet) {
            if (tweet.in_reply_to_status_id_str) {
                return Tweet.nowTweetInfo.tweets[
                    tweet.in_reply_to_status_id_str
                ];
            }
            return null;
        };
        Tweet.getInTweet = function (tweet) {
            if (tweet.is_quote_status) {
                return Tweet.nowTweetInfo.tweets[tweet.quoted_status_id_str];
            }
            return null;
        };
        Tweet.getLevels = function (tweet) {
            let resarr = [];
            while (tweet) {
                resarr.push({
                    tweet: tweet,
                    quote: Tweet.getInTweet(tweet),
                });
                tweet = Tweet.getUpLevel(tweet);
            }
            return resarr;
        };
        Tweet.getTransDisplayText = function (tweet) {
            let resStr = "";
            let levels = Tweet.getLevels(tweet);
            let getNoUrlStr = function (tweet) {
                let show_tweet_text = tweet.full_text.trim();
                if (tweet.entities) {
                    if (tweet.entities.media) {
                        for (let i = 0; i < tweet.entities.media.length; i++) {
                            let media = tweet.entities.media[i];
                            show_tweet_text = show_tweet_text.replace(
                                media.url,
                                ""
                            );
                        }
                    }
                }
                return show_tweet_text;
            };
            let getOneLevelStr = function (level) {
                let resStr = getNoUrlStr(level.tweet);
                if (level.quote) {
                    resStr += "\n\\#\\#引用\n";
                    resStr += getNoUrlStr(level.quote);
                }
                if (level.tweet.card && level.tweet.card.binding_values) {
                    let votecount = 1;
                    while (true) {
                        if (
                            level.tweet.card.binding_values[
                                "choice" + votecount + "_label"
                            ]
                        ) {
                            if (
                                level.tweet.card.binding_values[
                                    "choice" + votecount + "_label"
                                ]["string_value"]
                            ) {
                                resStr += "\n\\#\\#选项" + votecount + "\n";
                                resStr +=
                                    level.tweet.card.binding_values[
                                        "choice" + votecount + "_label"
                                    ]["string_value"];
                            }
                        } else {
                            break;
                        }
                        votecount++;
                    }
                }
                return resStr.trim();
            };
            let level = levels.pop();
            if (levels.length == 0) {
                return getOneLevelStr(level);
            }
            let count = 0;
            while (level) {
                count++;
                resStr += "##" + count + "\n" + getOneLevelStr(level) + "\n";
                level = levels.pop();
            }
            return resStr.trim();
        };
        // 当前推文ID
        Tweet.nowTweetId = "";
        // 缓存历史推文，防止回退时丢失数据。
        Tweet.historyCaches = {};
        Tweet.nowTweetInfo = null;
        Tweet._tool = {};
        Tweet._tool.dealTweet = function (tweet) {
            return tweet;
        };
        Tweet._tool.dealUser = function (user) {
            return user;
        };
        Tweet._oprateInfo = {};
        Tweet._oprateInfo.addUsers = function (users) {
            for (const userid in users) {
                if (!tTweet.nowTweetInfo.users[userid]) {
                    tTweet.nowTweetInfo.users[userid] = tTweet._tool.dealUser(
                        users[userid]
                    );
                }
            }
        };
        Tweet._oprateInfo.addTweets = function (tweets) {
            let nowInfo = tTweet.nowTweetInfo;
            for (const tweetid in tweets) {
                if (!nowInfo.tweets[tweetid]) {
                    nowInfo.tweets[tweetid] = tTweet._tool.dealTweet(
                        tweets[tweetid]
                    );
                    // 获取引用推文数据
                    if (
                        nowInfo.tweetquoteid != null &&
                        tweetid == nowInfo.tweetquoteid &&
                        nowInfo.tweetquote == null
                    ) {
                        nowInfo.tweetquote = nowInfo.tweets[tweetid];
                        try {
                            nowInfo.tweetquoteuser =
                                nowInfo.users[nowInfo.tweetquote.user_id_str];
                            Logger.info("引用推文发布者：" + nowInfo.user.name);
                        } catch (e) {
                            Logger.exception(e);
                        }
                        try {
                            nowInfo.tweetquotetext =
                                nowInfo.tweetquote.full_text;
                            Logger.info("引用内容：" + nowInfo.tweetquotetext);
                        } catch (e) {
                            Logger.exception(e);
                        }
                    }
                }
            }
        };
        Tweet._responseHook = function (httpitem) {
            let tweetId = tTweet.getNowTweetId();
            if (tweetId == null) {
                if (tTweet.nowTweetInfo != null || tTweet.nowTweetId != "") {
                    Logger.info("======离开推文页======");
                    tTweet.nowTweetId = "";
                    tTweet.nowTweetInfo = null;
                    tTweet.historyCaches = {};
                }
                return;
            }
            let response = httpitem.response;
            // 判断请求是否为推文信息获取请求
            if (response.url.indexOf(tweetId + ".json") != -1) {
                // 收集数据
                try {
                    // 获取当前推文的JSON数据
                    let hinfo = Tweet._newTweetInfo();
                    let infoobj = response.json.globalObjects;
                    hinfo.xmlhttpitem = httpitem;
                    hinfo.nowTweetId = tweetId;
                    hinfo.users = infoobj.users;
                    hinfo.tweets = infoobj.tweets;
                    let tweet = hinfo.tweets[tweetId];
                    hinfo.tweet = tTweet._tool.dealTweet(tweet);
                    hinfo.user = tTweet._tool.dealUser(
                        hinfo.users[tweet.user_id_str]
                    );
                    // 获取引用数据
                    if (
                        tweet.is_quote_status &&
                        tweet.quoted_status_id_str &&
                        tweet.quoted_status_id_str != ""
                    ) {
                        let quote = hinfo.tweets[tweet.quoted_status_id_str];
                        hinfo.quote = tTweet._tool.dealTweet(quote);
                        hinfo.quoteuser = tTweet._tool.dealUser(
                            hinfo.users[quote.user_id_str]
                        );
                    }
                    // 获取回复数据
                    if (
                        tweet.in_reply_to_status_id_str &&
                        tweet.in_reply_to_status_id_str != ""
                    ) {
                        let quote =
                            hinfo.tweets[tweet.in_reply_to_status_id_str];
                        hinfo.replay = tTweet._tool.dealTweet(quote);
                        hinfo.replayuser = tTweet._tool.dealUser(
                            hinfo.users[quote.user_id_str]
                        );
                    }
                    // 置入数据
                    tTweet.historyCaches[tweetId] = hinfo;
                } catch (e) {
                    Logger.exception(e);
                }
            }
            if (tweetId != tTweet.nowTweetId) {
                // 尝试匹配推文
                if (tTweet.historyCaches[tweetId]) {
                    tTweet.nowTweetId = tweetId;
                    tTweet.nowTweetInfo = tTweet.historyCaches[tweetId];
                    Logger.info("======查看推文======");
                    tTweet.showTweet();
                }
            }
        };
        AjaxHook.addHook(Tweet._responseHook, AjaxHook.AJAXSTATUS.LOADED);
    })();

    // Style 样式
    const Style = {};
    (function () {
        //注入layer的css
        const layerimgs = {
            "icon.png":
                "data:image/png;base64,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",
            "icon-ext.png":
                "data:image/png;base64,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",
            "loading-0.gif":
                "data:image/gif;base64,R0lGODlhPAAYALMPAPPJp/HYxfSwkf50Df5TD/+HAPe5bvqHR/twOviZavyrMu/m3f9EAP9mAP+ZAO7u7iH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcFJpZ2h0czpNYXJrZWQ9IkZhbHNlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6QUNDRERBRjMxRTIwNjgxMTg4QzZERjVGQ0I0MDI1NDkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTlDMEI5MzU5RTY2MTFFMTkxRDY5NkVCMDBGOTBFRUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTlDMEI5MzQ5RTY2MTFFMTkxRDY5NkVCMDBGOTBFRUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpENzU2N0YwMTMyMjA2ODExODhDNkRGNUZDQjQwMjU0OSIgc3RS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",
            "loading-1.gif":
                "data:image/gif;base64,R0lGODlhJQAlAJECAL3L2AYrTv///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgACACwAAAAAJQAlAAACi5SPqcvtDyGYIFpF690i8xUw3qJBwUlSadmcLqYmGQu6KDIeM13beGzYWWy3DlB4IYaMk+Dso2RWkFCfLPcRvFbZxFLUDTt21BW56TyjRep1e20+i+eYMR145W2eefj+6VFmgTQi+ECVY8iGxcg35phGo/iDFwlTyXWphwlm1imGRdcnuqhHeop6UAAAIfkEBQoAAgAsEAACAAQACwAAAgWMj6nLXAAh+QQFCgACACwVAAUACgALAAACFZQvgRi92dyJcVJlLobUdi8x4bIhBQAh+QQFCgACACwXABEADAADAAACBYyPqcsFACH5BAUKAAIALBUAFQAKAAsAAAITlGKZwWoMHYxqtmplxlNT7ixGAQAh+QQFCgACACwQABgABAALAAACBYyPqctcACH5BAUKAAIALAUAFQAKAAsAAAIVlC+BGL3Z3IlxUmUuhtR2LzHhsiEFACH5BAUKAAIALAEAEQAMAAMAAAIFjI+pywUAIfkEBQoAAgAsBQAFAAoACwAAAhOUYJnAagwdjGq2amXGU1PuLEYBACH5BAUKAAIALBAAAgAEAAsAAAIFhI+py1wAIfkEBQoAAgAsFQAFAAoACwAAAhWUL4AIvdnciXFSZS6G1HYvMeGyIQUAIfkEBQoAAgAsFwARAAwAAwAAAgWEj6nLBQAh+QQFCgACACwVABUACgALAAACE5RgmcBqDB2MarZqZcZTU+4sRgEAIfkEBQoAAgAsEAAYAAQACwAAAgWEj6nLXAAh+QQFCgACACwFABUACgALAAACFZQvgAi92dyJcVJlLobUdi8x4bIhBQAh+QQFCgACACwBABEADAADAAACBYSPqcsFADs=",
            "loading-2.gif":
                "data:image/gif;base64,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",
        };
        // if (typeof GM_addStyle == "undefined") {
        //     var GM_addStyle = function (cssstr) {
        //         let style = document.createElement("style");
        //         style.setAttribute("type", "text/css");
        //         var text = document.createTextNode(cssstr);
        //         style.appendChild(text);
        //         document.head.appendChild(style);
        //     };
        // }
        Style.addStyle = function (cssstr) {
            GM_addStyle(cssstr);
        };
        Style.load = function () {
            let layercss = GM_getResourceText("layer");
            for (let key in layerimgs) {
                layercss = layercss.replace(key, layerimgs[key]);
            }
            Style.addStyle(layercss);
            //注入layui的css
            //Style.addStyle(GM_getResourceText("layui"));
            //注入bootstrap的css
            Style.addStyle(GM_getResourceText("bootstrap"));
            //注入修复页面的css
            Style.addStyle(`
                @font-face {
                    font-family: 'w-e-icon';
                    src: url(data:font/woff;base64,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) format('truetype');
                    font-weight: normal;
                    font-style: normal;
                }
            `);
            //注入自定义CSS
            Style.addStyle(`
            .w-e-panel-tab-content .eleImg {
                height: 32px;
                width: 32px;
              }
              .w-e-text,
              .card-body {
                font-family: "Source Han Sans CN", "Segoe UI", Meiryo, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
                font-size: 18px;
                line-height: 18px;
                margin-block-start: 0.5em;
                margin-block-end: 0em;
              }
              .w-e-text p,
              .card-body p {
                line-height: 1em;
                margin-block-start: 0.5em;
                margin-block-end: 0em;
              }
              .w-e-text .eleImg,
              .card-body .eleImg,
              .w-e-text .emoji,
              .card-body .emoji {
                font-size: 1.15em;
                padding: 0;
                height: 1em;
                width: 1em;
                margin: 0.05em 0.1em;
                vertical-align: -0.23em;
              }
              .w-e-text .insert_trans_type,
              .card-body .insert_trans_type {
                color: #1DA1F2;
                font-weight: 500;
              }
              #wangeditor_config .w-e-text {
                color: #1DA1F2;
                font-weight: 500;
              }
              .static_insert_trans {
                font-family: "Source Han Sans CN", "Segoe UI", Meiryo, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
              }
              .static_insert_trans .eleImg,
              .static_insert_trans .emoji {
                font-size: 1.2em;
                padding: 0;
                height: 1em;
                width: 1em;
                margin: 0.05em 0.1em;
                vertical-align: -0.23em;
              }
              .static_insert_trans .insert_trans_type {
                color: #1DA1F2;
                font-size: 0.8em;
                font-weight: 500;
                padding-top: 0.5em;
              }
              .static_insert_trans .insert_trans_text p {
                margin-bottom: 0px;
                margin-left: 0px;
                margin-right: 0px;
                margin-top: 0px;
                padding-bottom: 0px;
                padding-left: 0px;
                padding-right: 0px;
                padding-top: 0px;
              }
              .static_insert_trans .insert_trans_vote p {
                display: inline;
                margin-bottom: 0px;
                margin-left: 0px;
                margin-right: 0px;
                margin-top: 0px;
                padding-bottom: 0px;
                padding-left: 0px;
                padding-right: 0px;
                padding-top: 0px;
              }
              .script_parsing_flag {
                outline-color: rgba(124, 11, 230, 0.61);
                outline-width: 1px;
                outline-style: dashed;
              }
              .button-group-style *,
              .button-group-style *:before,
              .button-group-style *:after {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
              }
              .button-group-style .buttons {
                margin-top: 25px;
                text-align: center;
              }
              .button-group-style .blob-btn {
                z-index: 1;
                position: relative;
                padding: 10px 23px;
                margin-bottom: 15px;
                text-align: center;
                text-transform: uppercase;
                color: #0fe0f5;
                font-size: 8px;
                font-weight: bold;
                background-color: transparent;
                outline: 0;
                border: 0;
                transition: color 0.5s;
                cursor: pointer;
              }
              .button-group-style .blob-btn:before {
                content: "";
                z-index: 1;
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border: 3px solid #0fe0f5;
              }
              .button-group-style .blob-btn:after {
                content: "";
                z-index: -2;
                position: absolute;
                left: 4.5px;
                top: 4.5px;
                width: 100%;
                height: 100%;
                border: 3px solid #222;
                transition: all 0.3s 0.2s;
              }
              .button-group-style .blob-btn:hover {
                color: #222;
              }
              .button-group-style .blob-btn:hover:after {
                transition: all 0.3s;
                left: 0;
                top: 0;
              }
              .button-group-style .blob-btn__inner {
                z-index: -1;
                overflow: hidden;
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
              }
              .button-group-style .blob-btn__blobs {
                position: relative;
                display: block;
                height: 100%;
                filter: url("#goo");
              }
              .button-group-style .blob-btn__blob {
                position: absolute;
                top: 3px;
                width: 25%;
                height: 100%;
                background: #0fe0f5;
                border-radius: 100%;
                transform: translate3d(0, 150%, 0) scale(1.7);
                transition: transform 0.45s;
              }
              @supports (filter:url("#goo")) {
                .button-group-style .blob-btn__blob {
                  transform: translate3d(0, 150%, 0) scale(1.4);
                }
              }
              .button-group-style .blob-btn__blob:nth-child(1) {
                left: 0;
                transition-delay: 0s;
              }
              .button-group-style .blob-btn__blob:nth-child(2) {
                left: 30%;
                transition-delay: 0.08s;
              }
              .button-group-style .blob-btn__blob:nth-child(3) {
                left: 60%;
                transition-delay: 0.16s;
              }
              .button-group-style .blob-btn__blob:nth-child(4) {
                left: 90%;
                transition-delay: 0.24s;
              }
              .button-group-style .blob-btn:hover .blob-btn__blob {
                transform: translateZ(0) scale(1.7);
              }
              @supports (filter:url("#goo")) {
                .button-group-style .blob-btn:hover .blob-btn__blob {
                  transform: translateZ(0) scale(1.4);
                }
              }
              .dropdown-menu {
                z-index: 10002;
              }
              .sidebar_outbord {
                position: absolute;
              }
              .sidebar_outbord .sidebar_trigger {
                top: 0;
                left: 0;
                position: fixed;
                z-index: 9999;
                width: 2.5%;
                height: 100%;
              }
              .sidebar_outbord .sidebar_trigger:hover .sidebar {
                transform: translateX(0px);
              }
              .sidebar_outbord .sidebar_trigger .sidebar {
                transition: transform 0.5s;
                transform: translateX(-200px);
                top: 0;
                left: 0;
                position: fixed;
                z-index: 9999;
                height: 100%;
                width: 200px;
                background-color: rgba(0, 0, 0, 0.664);
              }
              .sidebar_outbord .sidebar_trigger .sidebar:hover {
                transform: translateX(0px);
              }
              .sidebar_outbord .sidebar_trigger .sidebar .sidebar_type_content {
                position: relative;
                top: 7%;
                left: 40px;
              }
              .sidebar_outbord .sidebar_trigger .sidebar .sidebar_type_content .sidebar_type {
                margin: 0 auto;
                color: #0fe0f5;
                font-size: 2em;
                font-weight: bold;
              }
              .sidebar_outbord .sidebar_trigger .sidebar .sidebar_container {
                padding: 10px;
                padding-left: 15px;
                position: relative;
                top: 15%;
                bottom: 0;
                margin: 0 auto;
              }
              .sidebar_outbord .sidebar_trigger .sidebar .sidebar_container .blob-btn {
                width: 85%;
              }
            `);
        };
    })();

    // 工具
    const Tool = {};
    (function () {
        // 监听URL操作
        const _historyWrap = function (type) {
            const orig = history[type];
            const e = new Event(type);
            return function () {
                const rv = orig.apply(this, arguments);
                e.arguments = arguments;
                window.dispatchEvent(e);
                return rv;
            };
        };
        unsafeWindow.history.pushState = _historyWrap("pushState");
        unsafeWindow.history.replaceState = _historyWrap("replaceState");

        Tool.addUrlChangeEventListener = function (func) {
            unsafeWindow.addEventListener("pushState", func);
            unsafeWindow.addEventListener("replaceState", func);
            unsafeWindow.addEventListener("popstate", func);
            unsafeWindow.addEventListener("hashchange", func);
        };

        // 判断元素是否为dom
        Tool.isDOM =
            typeof HTMLElement === "object"
                ? function (obj) {
                      return obj instanceof HTMLElement;
                  }
                : function (obj) {
                      return (
                          obj &&
                          typeof obj === "object" &&
                          obj.nodeType === 1 &&
                          typeof obj.nodeName === "string"
                      );
                  };
        Tool.getSelectJquery = function (obj) {
            if (
                !(obj instanceof String) &&
                !(obj instanceof jQuery) &&
                !Tool.isDOM(obj)
            ) {
                Logger.exception(obj);
                Logger.exception("参数需要为选择器文本、DOM节点或jquery节点！");
                return null;
            }
            return $(obj);
        };
        Tool.getSelectDOM = function (obj) {
            let res = null;
            if (!(obj instanceof String)) {
                res = document.querySelector(obj);
            } else if (Tool.isDOM(obj)) {
                res = obj;
            } else {
                Logger.exception(obj);
                Logger.exception("参数需要为选择器文本或DOM节点！");
                return null;
            }
            return res;
        };
        Tool.newButton = function (title, id = "") {
            //button-group-style
            let div = document.createElement("div");
            div.className = "button-group-style";
            let button = document.createElement("button");
            button.id = id;
            button.innerText = title;
            button.className = "blob-btn";
            button.setAttribute("style", "margin-left:10px;margin-right:10px;");
            let innerspan = document.createElement("span");
            innerspan.className = "blob-btn__inner";
            innerspan.innerHTML = `
                <span class="blob-btn__blobs">
                    <span class="blob-btn__blob"></span>
                    <span class="blob-btn__blob"></span>
                    <span class="blob-btn__blob"></span>
                    <span class="blob-btn__blob"></span>
                </span>`;
            button.append(innerspan);
            div.append(button);
            return div;
        };
        Tool.newButtonHtml = function (title, id = "script-button-test") {
            return Tool.newButto(...arguments).outerHTML;
        };
        Tool.injectHtmlToDom = function (select, html) {
            select.append(html);
        };

        Tool.insertButton = function (insertpoint, title, bindfunc) {
            let insertnode = Tool.getSelectJquery(insertpoint);
            if (!insertnode || insertnode.length == 0) {
                Logger.warning(
                    "按钮 " + title + " 失败！" + "接入点",
                    insertnode
                );
                return;
            }
            let button = Tool.newButton(title, "script_auto_button");
            $(button).on("click", bindfunc);
            insertnode.append(button);
        };
    })();
    // TweetHtml工具 用于获取推文注入点及注入推文翻译
    const TweetHtml = {};
    (function () {
        TweetHtml.staticAnchorSwitch = function (anchors, switchTo = null) {
            let selem = document.querySelector("#static_elem");
            if (!selem) {
                anchors.rootDom.parentNode.appendChild(anchors.staticElem);
            } else {
                if (selem != anchors.staticElem) {
                    selem.remove();
                    anchors.rootDom.parentNode.appendChild(anchors.staticElem);
                }
            }
            if (
                (anchors.staticElem.style.display == "none" &&
                    switchTo === null) ||
                switchTo === false
            ) {
                anchors.staticElem.style.display = "";
                anchors.rootDom.style.display = "none";
                return;
            }
            anchors.staticElem.style.display = "none";
            anchors.rootDom.style.display = "";
            //anchors.staticElem
        };
        // 页面锚点(样式检索点配置)
        const CSSAnchor = {
            // 根元素锚点
            rootElem(rootDom = document) {
                return rootDom.querySelector(
                    "section[aria-labelledby].css-1dbjc4n"
                );
            },
            // 推文集锚点
            articles(rootDom) {
                return rootDom.querySelectorAll("ARTICLE.css-1dbjc4n");
            },
            // 敏感内容锚点
            articleHides(rootDom) {
                return rootDom.querySelectorAll(
                    "DIV.r-1ndi9ce div[role='button']"
                );
            },
            // 任意推文图片锚点
            articleImages(rootDom) {
                return rootDom.querySelectorAll('a[href*="/photo/"]');
            },
            // 图文描点内联的IMG
            articleInImage(rootDom) {
                return rootDom.querySelector('img[src*="/media/"]');
            },
            // 文本锚点
            articleTexts(rootDom) {
                // DIV.r-bnwqim
                return rootDom.querySelectorAll("div.r-bnwqim");
            },
            // 投票锚点
            articleVotes(rootDom) {
                // 已经结束的投票
                let res = rootDom.querySelectorAll(
                    "DIV.r-mabqd8 DIV.r-1e081e0"
                );
                if (res.length != 0) {
                    return res;
                }
                // 未结束的投票
                return rootDom.querySelectorAll("DIV.r-p1n3y5 SPAN.css-bfa6kz");
            },
            // 推文媒体框锚点
            articleMediaImage(rootDom) {
                return rootDom.querySelectorAll("div.r-1bs4hfb");
            },
            // 转推喜欢检索锚点
            articleRetweetLike(rootDom) {
                // r-tzz3ar r-1yzf0co
                return rootDom.querySelector("div.r-tzz3ar");
            },
            // 时间锚点
            articleTime(rootDom) {
                return rootDom.querySelector("div.r-1r5su4o");
            },
        };
        TweetHtml.CSSAnchor = CSSAnchor;
        TweetHtml.parseAnchors = null;
        TweetHtml.textparse = function (text) {
            const attributesCallback = function (icon, variant) {
                //emoji置换回调
                return {
                    title: "Emoji: " + icon + variant,
                    style: "",
                };
            };
            //文本处理
            text = text.replace(/(\\\\)/gi, "\\&sla; ");
            text = text.replace(/(\\#)/gi, "\\&jh; ");
            text = text.replace(/(\\@)/gi, "\\&AT; ");
            text = text.replace(
                /(\S*)(#[^\s#\!0-9]{1}\S*)/gi,
                '$1<a style="color:#1DA1F2;">$2</a>'
            );
            text = text.replace(
                /([\S]*)(@[A-Za-z0-9_]{4,15})/gi,
                '$1<a style="color:#1DA1F2;">$2</a>'
            );
            text = text.replace(
                /((https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/g,
                '<a style="color:#1DA1F2;">$1</a>'
            );
            text = text.replace(/([^\n]+)\n/gi, "<p>$1</p>");
            text = text.replace(/\n/gi, "<br>\n");
            text = text.replace(/(\\&jh; )/gi, "#");
            text = text.replace(/(\\&AT; )/gi, "@");
            text = text.replace(/(\\&sla; )/gi, "\\");
            return twemoji.parse(text, {
                attributes: attributesCallback,
                base: "https://abs-0.twimg.com/emoji/v2/",
                folder: "svg",
                ext: ".svg",
            });
        };
        TweetHtml.parsingArgStr = function (
            argstr,
            template = "<p>翻译自日语</p>"
        ) {
            /**
            标记模式
            配置项 覆盖模式，默认不覆盖原文，##-或#-!为完全覆盖模式
            起始标记 ##分层 #!层内？
            ##节点标记 注入内容
            节点标记规则：层数(指定层译文),层数+1(层内层翻译),last(最底层推文，主推文，优先使用),config(配置)
            中文标记:层x/回复x,层内x/引用x/内嵌x,图片x,选项x/投票x,配置key
             */
            /**
            trans结构{
                template: template,
                levels: {
                    1:{
                        key:1,
                        content:"节点的注入内容",
                        config:{
                            "覆盖":{
                                mark: "config",
                                expre:/^配置([^\s\+\-开关禁不启停A-Za-z0-9]+)/,
                                default:()=>("default"),
                                value: (match)=>(match[1]),
                                result:"覆盖",
                                content:"开"
                            }
                        },
                        inlevel:{},
                        img:{},
                        vote:{},
                    }
                },
            }
             */
            let trans = {
                template: template,
                levels: {},
            };
            let idIter = function () {
                let oid = 1;
                return function () {
                    return oid++;
                };
            };
            let getNewLevel = idIter();
            let getInLevel = idIter();
            let getImgLevel = idIter();
            let getVoteLevel = idIter();
            // 标记正则表
            let MARKS = {
                level: [
                    {
                        mark: "level",
                        expre: /^last/,
                        default: () => "last",
                        value: (match) => null,
                    },
                    {
                        mark: "level",
                        expre: /^层([0-9]*)/,
                        default: () => getNewLevel(),
                        value: (match) => match[1],
                    },
                    {
                        mark: "level",
                        expre: /^回复([0-9]*)/,
                        default: () => getNewLevel(),
                        value: (match) => match[1],
                    },
                    {
                        mark: "level",
                        expre: /^([0-9]+)/,
                        default: () => getNewLevel(),
                        value: (match) => match[1],
                    },
                ],
                inlevel: [
                    {
                        mark: "inlevel",
                        expre: /^层内([0-9]*)/,
                        default: () => getInLevel(),
                        value: (match) => match[1],
                    },
                    {
                        mark: "inlevel",
                        expre: /^引用([0-9]*)/,
                        default: () => getInLevel(),
                        value: (match) => match[1],
                    },
                    {
                        mark: "inlevel",
                        expre: /^内嵌([0-9]*)/,
                        default: () => getInLevel(),
                        value: (match) => match[1],
                    },
                ],
                img: [
                    {
                        mark: "img",
                        expre: /^图片([0-9]*)/,
                        default: () => getImgLevel(),
                        value: (match) => match[1],
                    },
                ],
                vote: [
                    {
                        mark: "vote",
                        expre: /^投票([0-9]*)/,
                        default: () => getVoteLevel(),
                        value: (match) => match[1],
                    },
                    {
                        mark: "vote",
                        expre: /^选项([0-9]*)/,
                        default: () => getVoteLevel(),
                        value: (match) => match[1],
                    },
                ],
                config: [
                    {
                        mark: "config",
                        expre: /^配置([^\s\+\-开关禁不启停A-Za-z0-9]+)/,
                        default: () => "default",
                        value: (match) => match[1],
                    },
                ],
            };
            let createNewLevel = function () {
                return {
                    key: -1,
                    content: "",
                    config: {},
                    inlevel: {},
                    img: {},
                    vote: {},
                };
            };
            let spargs;
            if (ConfigTool.getConfig("isEdit")) {
                spargs = argstr.trim().split("<p>##");
                for (let mark in MARKS) {
                    for (let ii = 0; ii < MARKS[mark].length; ii++) {
                        let matchitem = MARKS[mark][ii];
                        matchitem.expre = new RegExp(
                            matchitem.expre.source + "(</p>)*"
                        );
                    }
                }
            } else {
                spargs = argstr.trim().split("##");
            }
            let nowstr;
            let level = createNewLevel();
            for (let i = 0; i < spargs.length; i++) {
                nowstr = spargs[i].trim();
                if (nowstr == "") {
                    continue;
                }
                // 匹配到的mark
                let markitem = null;
                try {
                    for (let mark in MARKS) {
                        for (let ii = 0; ii < MARKS[mark].length; ii++) {
                            let matchitem = MARKS[mark][ii];
                            let match = nowstr.match(matchitem.expre);
                            if (match) {
                                // 使用item覆盖减少内存使用的同时区分原item
                                markitem = Object.assign({}, matchitem);
                                markitem.result = matchitem.value(match);
                                if (!markitem.result) {
                                    markitem.result = matchitem.default();
                                }
                                markitem.content = nowstr
                                    .replace(matchitem.expre, "")
                                    .trim();
                                break;
                            }
                        }
                        if (markitem) {
                            break;
                        }
                    }
                    if (markitem == null) {
                        markitem = {
                            mark: "level",
                            expre: /(.+)/,
                            default: () => getNewLevel(),
                            value: (match) => null,
                        };
                        markitem.result = markitem.default();
                        markitem.content = nowstr;
                        level.key = markitem.result;
                        level.content = markitem.content;
                    }
                    if (markitem.mark == "level") {
                        if (level.key != -1) {
                            trans.levels[level.key] = level;
                        }
                        getInLevel = idIter();
                        getImgLevel = idIter();
                        getVoteLevel = idIter();
                        level = createNewLevel();
                        level.key = markitem.result;
                        level.content = markitem.content;
                        continue;
                    }
                    level[markitem.mark][markitem.result] = markitem;
                } catch (error) {
                    Logger.warning("匹配 ", nowstr, " 时异常");
                    Logger.exception(error);
                }
            }
            if (level.key != -1) {
                trans.levels[level.key] = level;
            }
            return trans;
        };
        // 获取注入点信息组
        TweetHtml.getAnchors = function () {
            // 静态元素
            let staticElem = document.createElement("div");
            staticElem.id = "static_elem";
            staticElem.style.display = "none";
            let staticMainElem = document.createElement("div");
            staticMainElem.id = "static_main_elem";
            let staticReplayElem = document.createElement("div");
            staticReplayElem.id = "static_replay_elem";
            staticElem.appendChild(staticMainElem);
            staticElem.appendChild(staticReplayElem);
            // 主元素
            let rootDom = CSSAnchor.rootElem(document);
            if (!rootDom) {
                return [false, "推文不存在"];
            }
            // 推文集
            let articles = CSSAnchor.articles(rootDom);
            if (articles.length == 0) {
                return [false, "未发现推文，请重试"];
            }

            //注入点收集表
            let tweetAnchors = [];
            let tweetAnchor = [];
            let mainTweet = true;
            //搜索可注入元素
            for (var i = 0; 1 == 1; i++) {
                //发现元素不存在时
                if (typeof articles[i] == "undefined") {
                    if (!mainTweet) {
                        break;
                    }
                    return [false, "未搜索到推文结束位置，请联系制作者反馈！"];
                }
                //搜索推文
                let elart = articles[i];
                if (elart) {
                    elart = elart.cloneNode(true);
                    if (mainTweet) {
                        staticMainElem.append(elart);
                    } else {
                        elart.style.display = "none";
                        staticReplayElem.append(elart);
                    }
                    // 初始化item
                    let elartItem = {
                        dom: elart,
                        textAnchors: [],
                        imgAnchors: [],
                        voteAnchors: [],
                        endAnchor: null,
                    };
                    // 搜索可注入的文本锚点
                    let elemtexts = CSSAnchor.articleTexts(elart);
                    for (var j = 0; j < elemtexts.length; j++) {
                        elartItem.textAnchors.push({
                            dom: elemtexts[j],
                            text: elemtexts[j].innerText,
                        });
                    }
                    // 搜索可注入的图片锚点
                    let elemimgs = CSSAnchor.articleImages(elart);
                    for (var j = 0; j < elemimgs.length; j++) {
                        let imgdom = CSSAnchor.articleInImage(elemimgs[j]);
                        elartItem.imgAnchors.push({
                            dom: elemimgs[j],
                            href: elemimgs[j].href,
                            imgdom: imgdom,
                            imgsrc: imgdom == null ? "" : imgdom.src,
                        });
                    }
                    // 搜索可注入的投票锚点
                    let elemvotes = CSSAnchor.articleVotes(elart);
                    for (var j = 0; j < elemvotes.length; j++) {
                        elartItem.voteAnchors.push({
                            dom: elemvotes[j],
                            text: elemvotes[j].innerText,
                        });
                    }
                    //检测推文是否结束
                    if (mainTweet) {
                        let endAnchor = null;
                        if (!endAnchor) {
                            //转推喜欢
                            endAnchor = CSSAnchor.articleRetweetLike(elart);
                            if (endAnchor) {
                                endAnchor.remove();
                            }
                        }
                        if (!endAnchor) {
                            //时间
                            endAnchor = CSSAnchor.articleTime(elart);
                        }
                        if (endAnchor) {
                            mainTweet = false;
                            elartItem.endAnchor = endAnchor;
                        }
                    }
                    tweetAnchor.push(elartItem);
                    if (!mainTweet) {
                        tweetAnchors.push(tweetAnchor);
                        tweetAnchor = [];
                        continue;
                    }
                }
            }
            return [
                true,
                "成功！",
                {
                    staticElem: staticElem,
                    rootDom: rootDom,
                    tweetAnchors: tweetAnchors,
                },
            ];
        };
        // 显示所有敏感内容隐藏
        TweetHtml.showAllHide = function () {
            try {
                let elems = CSSAnchor.articleHides(CSSAnchor.rootElem());
                let count = 0;
                for (let j = 0; j < elems.length; j++) {
                    try {
                        if (elems[j].textContent == "查看" || elems[j].textContent == "显示") {
                            elems[j].click();
                            count++;
                        }
                    } catch (e) {
                        Logger.exception("显示隐藏内容时异常 -> ", e);
                        return -1;
                    }
                }
                return count;
            } catch (error) {
                Logger.warning("敏感信息显示功能异常。");
                return 0;
            }
        };
        // 推特加载等待
        TweetHtml.waitLoad = function (loadComplateFunc, timeout = 15000) {
            let waitTimeCount = 0;
            let waitRootDom = function () {
                return new Promise(function (resolve, reject) {
                    let checkloop = function () {
                        waitTimeCount += 100;
                        if (waitTimeCount > timeout) {
                            reject("等待超时！");
                            return;
                        }
                        if (CSSAnchor.rootElem() == null) {
                            setTimeout(checkloop, 100);
                        } else {
                            resolve();
                            return;
                        }
                    };
                    // 启动检查循环
                    setTimeout(checkloop, 100);
                });
            };
            let waitTweetLoad = function () {
                // 推文等待数
                const waitNum = 1;
                return new Promise(function (resolve, reject) {
                    let rootDom = CSSAnchor.rootElem();
                    let checkloop = function () {
                        waitTimeCount += 100;
                        if (waitTimeCount > timeout) {
                            reject("等待超时！");
                            return;
                        }
                        if (CSSAnchor.articles(rootDom).length < waitNum) {
                            setTimeout(checkloop, 100);
                        } else {
                            resolve();
                            return;
                        }
                    };
                    // 启动检查循环
                    setTimeout(checkloop, 100);
                });
            };
            let showAllHide = function () {
                return new Promise(function (resolve, reject) {
                    resolve(TweetHtml.showAllHide());
                });
            };
            let waitImageComplate = function () {
                return new Promise(function (resolve, reject) {
                    let rootDom = CSSAnchor.rootElem();
                    //判断图片是否加载完成
                    let imgIsAllLoadComplete = function () {
                        let photos = CSSAnchor.articleImages(rootDom);
                        if (photos.length == 0) {
                            Logger.info("未找到可加载图片");
                            return true;
                        }
                        for (let i = 0; i < photos.length; i++) {
                            let img = photos[i].querySelector("img");
                            try {
                                if (img == null || !img.complete) {
                                    return false;
                                }
                            } catch (e) {
                                Logger.exception(e);
                                return true;
                            }
                        }
                        return true;
                    };
                    let checkloop = function () {
                        waitTimeCount += 100;
                        if (waitTimeCount > timeout) {
                            reject("等待超时！");
                            return;
                        }
                        if (!imgIsAllLoadComplete()) {
                            setTimeout(checkloop, 100);
                        } else {
                            resolve();
                        }
                    };
                    // 启动检查循环
                    setTimeout(checkloop, 100);
                });
            };

            waitRootDom()
                .then(function (data) {
                    Logger.debug("检测到根元素，计时：" + waitTimeCount + "ms");
                    return waitTweetLoad();
                })
                .then(function (data) {
                    Logger.debug("已等待到推文，计时：" + waitTimeCount + "ms");
                    return showAllHide();
                })
                .then(function (data) {
                    Logger.debug(
                        "隐藏内容已解锁，计时：" + waitTimeCount + "ms"
                    );
                    return waitImageComplate();
                })
                .then(function (data) {
                    Logger.debug("图片加载完成，计时：" + waitTimeCount + "ms");
                    if (loadComplateFunc) {
                        loadComplateFunc();
                    }
                    return;
                })
                .catch(function (reason, data) {
                    if (loadComplateFunc) {
                        loadComplateFunc();
                    }
                    Logger.warning("异常：", reason, data);
                });
        };

        TweetHtml.loopShowHide = function () {
            let loopTime = 0;
            let checkloop = function () {
                loopTime += 500;
                setTimeout(checkloop, 500);
                if (ConfigTool.getConfig("loopShowHide", true)) {
                    let showCount = TweetHtml.showAllHide();
                    if (showCount > 0) {
                        Logger.debug(
                            "已显示 " +
                                showCount +
                                " 条隐藏内容，循环时 " +
                                loopTime / 1000 +
                                "s"
                        );
                    }
                }
            };
            // 启动检查循环
            setTimeout(checkloop, 500);
        };

        TweetHtml.parsing = function () {
            if (Tweet.isTweet) {
                if (TweetHtml.parseAnchors) {
                    TweetHtml.staticAnchorSwitch(TweetHtml.parseAnchors, true);
                }
                let tweetId = Tweet.getNowTweetId();
                let parseAnchors = TweetHtml.getAnchors();
                if (!parseAnchors[0]) {
                    layer.msg(
                        "推文 " +
                            tweetId +
                            " 解析失败，可能是由于地址切换过快引起的！" +
                            parseAnchors[1]
                    );
                    Logger.warning(parseAnchors[1]);
                    TweetHtml.parseAnchors = null;
                    return false;
                }
                TweetHtml.parseAnchors = parseAnchors[2];
                Logger.info("推文", tweetId, "解析成功");
                //Logger.debug(parseAnchors);
                return true;
            }
            return false;
        };
        const MARKCLASS = "static_insert_trans"; // 注入标记类
        TweetHtml.insertTrans = function (tweetAnchors, trans) {
            /**
            trans结构
            {
                template: template,
                levels: {
                    1:{
                        key:1,
                        content:"节点的注入内容",
                        config:{
                            "覆盖":{
                                mark: "config",
                                expre:/^配置([^\s\+\-开关禁不启停A-Za-z0-9]+)/,
                                default:()=>("default"),
                                value: (match)=>(match[1]),
                                result:"覆盖",
                                content:"true"
                            }
                        },
                        inlevel:{},
                        img:{},
                        vote:{},
                    }
                },
            }
            tweetAnchors结构
            [
                [
                    {
                        dom: elart,
                        textAnchors: [
                            {
                                dom: elemtexts[j],
                                text: elemtexts[j].innerText,
                            }
                        ],
                        imgAnchors: [
                            {
                                dom: elemimgs[j],
                                href: elemimgs[j].href,
                                imgdom:imgdom,
                                imgsrc: (imgdom == null?"":imgdom.src)
                            }
                        ],
                        voteAnchors: [
                            {
                                dom: elemvotes[j],
                                text: elemvotes[j].innerText,
                            }
                        ],
                        endAnchor: null,
                    },
                ]
            ]
            */

            const TRANSTEXTCLASS = "insert_trans_text"; // 翻译文本
            const TRANSTYPECLASS = "insert_trans_type"; // 翻译标识
            const TRANSMEDIACLASS = "insert_trans_media"; // 媒体
            const TRANSVOTECLASS = "insert_trans_vote"; // 投票
            try {
                // 获取覆盖配置
                let coverconfig = {
                    replay_cover: ConfigTool.getConfig("replay_cover", false),
                    quote_cover: ConfigTool.getConfig("quote_cover", false),
                    main_cover: ConfigTool.getConfig("main_cover", false),
                };
                // 创建DOM的函数 tweettext transtype
                let createInsertDom = function (type, data) {
                    let dom = document.createElement("div");
                    let indom = null;
                    dom.className = MARKCLASS;
                    if (type == "tweettext") {
                        indom = document.createElement("div");
                        indom.className = TRANSTEXTCLASS;
                        indom.innerHTML = data;
                        dom.appendChild(indom);
                    } else if (type == "transtype") {
                        indom = document.createElement("div");
                        indom.className = TRANSTYPECLASS;
                        indom.innerHTML = data;
                        dom.appendChild(indom);
                    } else if (type == "media") {
                        indom = document.createElement("div");
                        indom.className = TRANSMEDIACLASS;
                        indom.innerHTML = data;
                        dom.appendChild(indom);
                    } else if (type == "vote"){
                        indom = document.createElement("div");
                        indom.className = TRANSVOTECLASS;
                        indom.innerHTML = data;
                        dom.appendChild(indom);
                    }
                    return dom;
                };
                // 在指定元素后插入元素
                let insertAfter = function (newElement, targetElement) {
                    var parent = targetElement.parentNode;
                    if (parent.lastChild == targetElement) {
                        // 如果最后的节点是目标元素，则直接添加。因为默认是最后
                        parent.appendChild(newElement);
                    } else {
                        //如果不是，则插入在目标元素的下一个兄弟节点的前面。也就是目标元素的后面
                        parent.insertBefore(
                            newElement,
                            targetElement.nextSibling
                        );
                    }
                };
                // 文本段注入 参数 覆盖标识，原始dom，新元素标识，新元素内容数据
                let insertTextData = function (
                    cover_flag,
                    sourcedom,
                    data,
                    isMain = false
                ) {
                    if (!ConfigTool.getConfig("isEdit", false)) {
                        data = TweetHtml.textparse(data);
                    }
                    if (isMain == false && cover_flag == false) {
                        data = "--------<br>\n" + data;
                    }
                    let tempDom = createInsertDom("tweettext", data);
                    tempDom.className =
                        sourcedom.className + " " + tempDom.className;
                    if (cover_flag) {
                        sourcedom.innerHTML = "";
                        sourcedom.appendChild(tempDom);
                    } else {
                        insertAfter(tempDom, sourcedom);
                    }
                    return tempDom;
                };
                // 媒体注入 参数 原始dom，新元素标识，新元素内容数据
                let insertMediaData = function (sourcedom, data) {
                    let tempDom = createInsertDom("media", data);
                    sourcedom.innerHTML = "";
                    sourcedom.appendChild(tempDom);
                    return tempDom;
                };
                // 投票注入 参数 原始dom，元素标识，元素内容
                let insertVoteData = function (sourcedom, data) {
                    let tempDom = createInsertDom("vote", data);
                    if (ConfigTool.getConfig("isEdit", false)) {
                        tempDom = createInsertDom("vote", data.replace("<br>","").replace("<br/>",""));
                    } else {
                        tempDom = createInsertDom("vote", data);
                    }
                    sourcedom.innerHTML = "";
                    sourcedom.appendChild(tempDom);
                    return tempDom;
                };
                // 翻译标识注入 参数 原始dom，元素标识，元素内容
                let insertTransFlag = function (sourcedom, data) {
                    let tempDom = createInsertDom("transtype", data);
                    tempDom.className =
                        sourcedom.className + " " + tempDom.className;
                    insertAfter(tempDom, sourcedom);
                    return tempDom;
                };
                // 推文计数
                let elartCount = 0;
                // 最后一个注入所在的推文坐标
                let endInsert = 0;
                let inTweetAnchors;
                let tweetAnchor;
                let tranlevel;
                if (trans.levels["last"]) {
                    if (!trans.level[tweetAnchors[0].length - 1]) {
                        // last存在且没有显示定义主元素翻译内容则使用last内容替换主元素翻译内容
                        trans.level[tweetAnchors[0].length - 1] =
                            trans.levels["last"];
                    }
                }

                for (let i = 0; i < tweetAnchors.length; i++) {
                    inTweetAnchors = tweetAnchors[i];
                    for (let j = 0; j < inTweetAnchors.length; j++) {
                        // 遍历推文注入点
                        // 当 i == 1 时存在特殊注入点last，用于注入
                        tweetAnchor = inTweetAnchors[j];
                        elartCount++;
                        // 检查注入点
                        if (!trans.levels[elartCount]) {
                            if(i != 0){
                                tweetAnchor.dom.style.display = "none";
                            }
                            continue;
                        }
                        endInsert = elartCount;
                        tranlevel = trans.levels[elartCount];
                        if(i != 0){
                            tweetAnchor.dom.style.display = "";
                        }
                        // 开始注入

                        // 文本注入
                        // 文本
                        if (tweetAnchor.textAnchors[0]) {
                            if (i == 0 && j == inTweetAnchors.length - 1) {
                                // 主元素
                                let dom = insertTransFlag(
                                    tweetAnchor.textAnchors[0].dom,
                                    trans.template
                                );
                                // 仅覆盖原文时使用原文坐标，非覆盖情况下使用注入标签后的标签坐标
                                insertTextData(
                                    coverconfig.main_cover,
                                    coverconfig.main_cover
                                        ? tweetAnchor.textAnchors[0].dom
                                        : dom,
                                    tranlevel.content,
                                    true
                                );
                            } else {
                                insertTextData(
                                    coverconfig.replay_cover,
                                    tweetAnchor.textAnchors[0].dom,
                                    tranlevel.content
                                );
                            }
                        }
                        // 内嵌文本
                        if (tweetAnchor.textAnchors.length > 1) {
                            for (
                                let k = 1;
                                k < tweetAnchor.textAnchors.length;
                                k++
                            ) {
                                if (tweetAnchor.textAnchors[k]) {
                                    if (tranlevel.inlevel[k]) {
                                        insertTextData(
                                            coverconfig.quote_cover,
                                            tweetAnchor.textAnchors[k].dom,
                                            tranlevel.inlevel[k].content
                                        );
                                    }
                                }
                            }
                        }

                        // 图片注入
                        tranlevel.img;
                        if (tweetAnchor.imgAnchors.length > 0) {
                            for (
                                let k = 0;
                                k < tweetAnchor.imgAnchors.length;
                                k++
                            ) {
                                if (tweetAnchor.imgAnchors[k]) {
                                    if (tranlevel.img[k + 1]) {
                                        insertMediaData(
                                            tweetAnchor.imgAnchors[k].dom,
                                            tranlevel.img[k + 1].content
                                        );
                                    }
                                }
                            }
                        }
                        // 投票注入
                        if (tweetAnchor.voteAnchors.length > 0) {
                            for (
                                let k = 0;
                                k < tweetAnchor.voteAnchors.length;
                                k++
                            ) {
                                if (tweetAnchor.voteAnchors[k]) {
                                    if (tranlevel.vote[k + 1]) {
                                        insertVoteData(
                                            tweetAnchor.voteAnchors[k].dom,
                                            tranlevel.vote[k + 1].content
                                        );
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                Logger.exception(error);
                return [false, "注入翻译时异常", error];
            }
        };
        TweetHtml.removeAllInsert = function () {
            $("." + MARKCLASS.replace(/\s+/g,".")).remove();
        };
    })();

    // display 窗口工具
    const DisplayTool = {};
    (function () {
        let editormenu = [
            "head",
            "bold",
            "fontSize",
            "fontName",
            "italic",
            "underline",
            "strikeThrough",
            "foreColor",
            "backColor",
            "emoticon",
            "image",
            "undo",
            "redo",
        ];
        let emotions = [
            {
                title: "笑脸", // tab 的标题
                type: "emoji", // 'emoji' / 'image'
                // emoji 表情，content 是一个数组即可
                content: "😀 😃 😄 😁 😆 😅 😂 🤣 🥲 ☺ 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🥸 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🤭 🤫 🤥 😶 😐 😑 😬 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠 😈 👿 👹 👺 🤡 💩 👻 💀 ☠ 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾"
                    .replace(/[\u200B-\u200D\uFEFF]/g, "")
                    .split(/\s/),
            },
            {
                title: "人物", // tab 的标题
                type: "emoji", // 'emoji' / 'image'
                // emoji 表情，content 是一个数组即可
                content: "👋 🤚 🖐 ✋ 🖖 👌 🤌 🤏 ✌ 🤞 🤟 🤘 🤙 👈 👉 👆 🖕 👇 ☝ 👍 👎 ✊ 👊 🤛 🤜 👏 🙌 👐 🤲 🤝 🙏 ✍ 💅 🤳 💪 🦾 🦵 🦿 🦶 👣 👂 🦻 👃 🫀 🫁 🧠 🦷 🦴 👀 👁 👅 👄 💋 🩸 👶 👧 🧒 👦 👩 🧑 👨 👩‍🦱 🧑‍🦱 👨‍🦱 👩‍🦰 🧑‍🦰 👨‍🦰 👱‍♀ 👱 👱‍♂ 👩‍🦳 🧑‍🦳 👨‍🦳 👩‍🦲 🧑‍🦲 👨‍🦲 🧔 👵 🧓 👴 👲 👳‍♀ 👳 👳‍♂ 🧕 👮‍♀ 👮 👮‍♂ 👷‍♀ 👷 👷‍♂ 💂‍♀ 💂 💂‍♂ 🕵‍♀ 🕵 🕵‍♂ 👩‍⚕ 🧑‍⚕ 👨‍⚕ 👩‍🌾 🧑‍🌾 👨‍🌾 👩‍🍳 🧑‍🍳 👨‍🍳 👩‍🎓 🧑‍🎓 👨‍🎓 👩‍🎤 🧑‍🎤 👨‍🎤 👩‍🏫 🧑‍🏫 👨‍🏫 👩‍🏭 🧑‍🏭 👨‍🏭 👩‍💻 🧑‍💻 👨‍💻 👩‍💼 🧑‍💼 👨‍💼 👩‍🔧 🧑‍🔧 👨‍🔧 👩‍🔬 🧑‍🔬 👨‍🔬 👩‍🎨 🧑‍🎨 👨‍🎨 👩‍🚒 🧑‍🚒 👨‍🚒 👩‍✈ 🧑‍✈ 👨‍✈ 👩‍🚀 🧑‍🚀 👨‍🚀 👩‍⚖ 🧑‍⚖ 👨‍⚖ 👰‍♀ 👰 👰‍♂ 🤵‍♀ 🤵 🤵‍♂ 👸 🤴 🥷 🦸‍♀ 🦸 🦸‍♂ 🦹‍♀ 🦹 🦹‍♂ 🤶 🧑‍🎄 🎅 🧙‍♀ 🧙 🧙‍♂ 🧝‍♀ 🧝 🧝‍♂ 🧛‍♀ 🧛 🧛‍♂ 🧟‍♀ 🧟 🧟‍♂ 🧞‍♀ 🧞 🧞‍♂ 🧜‍♀ 🧜 🧜‍♂ 🧚‍♀ 🧚 🧚‍♂ 👼 🤰 🤱 👩‍🍼 🧑‍🍼 👨‍🍼 🙇‍♀ 🙇 🙇‍♂ 💁‍♀ 💁 💁‍♂ 🙅‍♀ 🙅 🙅‍♂ 🙆‍♀ 🙆 🙆‍♂ 🙋‍♀ 🙋 🙋‍♂ 🧏‍♀ 🧏 🧏‍♂ 🤦‍♀ 🤦 🤦‍♂ 🤷‍♀ 🤷 🤷‍♂ 🙎‍♀ 🙎 🙎‍♂ 🙍‍♀ 🙍 🙍‍♂ 💇‍♀ 💇 💇‍♂ 💆‍♀ 💆 💆‍♂ 🧖‍♀ 🧖 🧖‍♂ 💅 🤳 💃 🕺 👯‍♀ 👯 👯‍♂ 🕴 👩‍🦽 🧑‍🦽 👨‍🦽 👩‍🦼 🧑‍🦼 👨‍🦼 🚶‍♀ 🚶 🚶‍♂ 👩‍🦯 🧑‍🦯 👨‍🦯 🧎‍♀ 🧎 🧎‍♂ 🏃‍♀ 🏃 🏃‍♂ 🧍‍♀ 🧍 🧍‍♂ 👭 🧑‍🤝‍🧑 👬 👫 👩‍❤‍👩 💑 👨‍❤‍👨 👩‍❤‍👨 👩‍❤‍💋‍👩 💏 👨‍❤‍💋‍👨 👩‍❤‍💋‍👨 👪 👨‍👩‍👦 👨‍👩‍👧 👨‍👩‍👧‍👦 👨‍👩‍👦‍👦 👨‍👩‍👧‍👧 👨‍👨‍👦 👨‍👨‍👧 👨‍👨‍👧‍👦 👨‍👨‍👦‍👦 👨‍👨‍👧‍👧 👩‍👩‍👦 👩‍👩‍👧 👩‍👩‍👧‍👦 👩‍👩‍👦‍👦 👩‍👩‍👧‍👧 👨‍👦 👨‍👦‍👦 👨‍👧 👨‍👧‍👦 👨‍👧‍👧 👩‍👦 👩‍👦‍👦 👩‍👧 👩‍👧‍👦 👩‍👧‍👧 🗣 👤 👥 🫂"
                    .replace(/ ?[\u200B-\u200D\uFEFF] ?/g, " ")
                    .split(/\s/),
            },
            {
                title: "服装", // tab 的标题
                type: "emoji", // 'emoji' / 'image'
                // emoji 表情，content 是一个数组即可
                content: "🧳 🌂 ☂ 🧵 🪡 🪢 🧶 👓 🕶 🥽 🥼 🦺 👔 👕 👖 🧣 🧤 🧥 🧦 👗 👘 🥻 🩴 🩱 🩲 🩳 👙 👚 👛 👜 👝 🎒 👞 👟 🥾 🥿 👠 👡 🩰 👢 👑 👒 🎩 🎓 🧢 ⛑ 🪖 💄 💍 💼"
                    .replace(/ ?[\u200B-\u200D\uFEFF] ?/g, " ")
                    .split(/\s/),
            },
            {
                title: "饮食", // tab 的标题
                type: "emoji", // 'emoji' / 'image'
                // emoji 表情，content 是一个数组即可
                content: "🍏 🍎 🍐 🍊 🍋 🍌 🍉 🍇 🍓 🫐 🍈 🍒 🍑 🥭 🍍 🥥 🥝 🍅 🍆 🥑 🥦 🥬 🥒 🌶 🫑 🌽 🥕 🫒 🧄 🧅 🥔 🍠 🥐 🥯 🍞 🥖 🥨 🧀 🥚 🍳 🧈 🥞 🧇 🥓 🥩 🍗 🍖 🦴 🌭 🍔 🍟 🍕 🫓 🥪 🥙 🧆 🌮 🌯 🫔 🥗 🥘 🫕 🥫 🍝 🍜 🍲 🍛 🍣 🍱 🥟 🦪 🍤 🍙 🍚 🍘 🍥 🥠 🥮 🍢 🍡 🍧 🍨 🍦 🥧 🧁 🍰 🎂 🍮 🍭 🍬 🍫 🍿 🍩 🍪 🌰 🥜 🍯 🥛 🍼 🫖 ☕ 🍵 🧃 🥤 🧋 🍶 🍺 🍻 🥂 🍷 🥃 🍸 🍹 🧉 🍾 🧊 🥄 🍴 🍽 🥣 🥡 🥢 🧂"
                    .replace(/ ?[\u200B-\u200D\uFEFF] ?/g, " ")
                    .split(/\s/),
            },
            {
                title: "运动", // tab 的标题
                type: "emoji", // 'emoji' / 'image'
                // emoji 表情，content 是一个数组即可
                content: "⚽ 🏀 🏈 ⚾ 🥎 🎾 🏐 🏉 🥏 🎱 🪀 🏓 🏸 🏒 🏑 🥍 🏏 🪃 🥅 ⛳ 🪁 🏹 🎣 🤿 🥊 🥋 🎽 🛹 🛼 🛷 ⛸ 🥌 🎿 ⛷ 🏂 🪂 🏋‍♀ 🏋 🏋‍♂ 🤼‍♀ 🤼 🤼‍♂ 🤸‍♀ 🤸 🤸‍♂ ⛹‍♀ ⛹ ⛹‍♂ 🤺 🤾‍♀ 🤾 🤾‍♂ 🏌‍♀ 🏌 🏌‍♂ 🏇 🧘‍♀ 🧘 🧘‍♂ 🏄‍♀ 🏄 🏄‍♂ 🏊‍♀ 🏊 🏊‍♂ 🤽‍♀ 🤽 🤽‍♂ 🚣‍♀ 🚣 🚣‍♂ 🧗‍♀ 🧗 🧗‍♂ 🚵‍♀ 🚵 🚵‍♂ 🚴‍♀ 🚴 🚴‍♂ 🏆 🥇 🥈 🥉 🏅 🎖 🏵 🎗 🎫 🎟 🎪 🤹 🤹‍♂ 🤹‍♀ 🎭 🩰 🎨 🎬 🎤 🎧 🎼 🎹 🥁 🪘 🎷 🎺 🪗 🎸 🪕 🎻 🎲 ♟ 🎯 🎳 🎮 🎰 🧩"
                    .replace(/ ?[\u200B-\u200D\uFEFF] ?/g, " ")
                    .split(/\s/),
            },
        ];
        for (let itemi in emotions) {
            let cons = emotions[itemi];
            cons.type = "image";
            for (let coni in cons.content) {
                cons.content[coni] = {
                    alt: cons.content[coni],
                    src:
                        "https://abs-0.twimg.com/emoji/v2/svg/" +
                        twemoji.convert.toCodePoint(cons.content[coni]) +
                        ".svg",
                };
            }
        }
        Vue.component("cssbutton", {
            props: ["title"],
            template: `
                <button class="blob-btn" style="margin-left:10px;margin-right:10px;"
                    @click="$emit('click')">{{ title }}<span class="blob-btn__inner">
                        <span class="blob-btn__blobs">
                            <span class="blob-btn__blob"></span>
                            <span class="blob-btn__blob"></span>
                            <span class="blob-btn__blob"></span>
                            <span class="blob-btn__blob"></span>
                        </span>
                    </span>
                </button>
            `,
        });
        const E = window.wangEditor;
        DisplayTool.createWangEditor = function (select) {
            let editor = new E(select);
            editor.config.uploadImgShowBase64 = true;
            editor.config.menus = editormenu;
            editor.config.emotions = emotions;
            editor.config.pasteFilterStyle = false;
            editor.create();
            return editor;
        };

        DisplayTool.configWindowId = null;
        DisplayTool.configDom = null;
        DisplayTool.configApp = null;

        DisplayTool.basicDom = document.createElement("div");
        DisplayTool.basicDom.className = "tm_script";
        document.body.appendChild(DisplayTool.basicDom);

        const BASICMOUNT = ".tm_script ";
        // 初始化配置界面
        DisplayTool.initConfig = function () {
            if (DisplayTool.configApp != null) {
                return;
            }
            let configDom = document.createElement("div");
            configDom.id = "script_trans_config_out";
            configDom.style.display = "none";
            configDom.className = "script_out";
            configDom.innerHTML = `
                    <div id="script_trans_config" style="padding:20px">
                        <div id="trans_config">
                            <div class="alert alert-primary" role="alert">
                                如果不进行保存，配置将在刷新后失效
                            </div>
                            <div class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">模版</span>
                                    </div>
                                    <input type="text" class="form-control edit_template_edit"
                                        aria-label="Text input with dropdown button" readonly :value="trans_tamplate">
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-secondary dropdown-toggle" type="button"
                                            data-toggle="dropdown" aria-haspopup="true"
                                            aria-expanded="false">操作</button>
                                        <div class="dropdown-menu">
                                            <button class="dropdown-item edit_template"
                                                @click="editTemplateName">重命名</button>
                                            <button class="dropdown-item create_template"
                                                @click="createTemplate">新建模版</button>
                                            <button class="dropdown-item delete_template"
                                                @click="deleteTemplate">删除模版</button>
                                        </div>
                                    </div>
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-secondary dropdown-toggle edit_template_select"
                                            type="button" data-toggle="dropdown" aria-haspopup="true"
                                            aria-expanded="false">选择模版</button>
                                        <div class="dropdown-menu">
                                            <button class="dropdown-item" @click="selectTemplate(k)"
                                                v-for="v,k in trans_tamplates">{{ k
                                                }}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <div class="container-fluid">
                                    <div class="row row-cols-3">
                                        <div class="col" v-for="(v,k) in switch_config">
                                            <div class="custom-control custom-switch custom-control-inline">
                                                <input type="checkbox" class="custom-control-input" v-model="v.value"
                                                    :id="'config_' + k">
                                                <label class="custom-control-label" :for="'config_' + k" data-toggle="tooltip"
                                                    :title="v.des" data-placement="right">{{ v.title }}</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <div id="wangeditor_config"></div>
                            </div>
                            <div>
                                <button type="button" class="btn btn-primary" @click="configSave">保存</button>
                                <button type="button" class="btn btn-primary" @click="configTempSave">临时保存</button>
                                <button type="button" class="btn btn-primary" @click="configReset">重置</button>
                                <button type="button" class="btn btn-secondary" @click="configCancel">取消</button>
                            </div>
                        </div>
                    </div>
            `;
            DisplayTool.basicDom.appendChild(configDom);

            let configapp = new Vue({
                el: BASICMOUNT + "#script_trans_config_out",
                data: {
                    editor: null,
                    default_tamplate: "<p>翻译自日语</p>",
                    trans_tamplate: "default",
                    trans_tamplate_str: "<p>翻译自日语</p>",
                    trans_tamplates: {
                        default: `<p>翻译自日语</p>`,
                    },
                    switch_config: {},
                },
                methods: {
                    _flushEdit() {
                        this.editor.txt.html(this.trans_tamplate_str);
                    },
                    _fillConfig() {
                        this.trans_tamplate = ConfigTool.getConfig(
                            "trans_tamplate"
                        );
                        this.trans_tamplate_str = ConfigTool.getConfig(
                            "trans_tamplate_str"
                        );
                        this.trans_tamplates = ConfigTool.getConfig(
                            "trans_tamplates"
                        );
                        for (let key in ConfigTool.CONFIG_SWITCH) {
                            let value = ConfigTool.CONFIG_SWITCH[key];
                            this.switch_config[value] =
                                ConfigTool.CONFIG_DES[value];
                            this.switch_config[
                                value
                            ].value = ConfigTool.getConfig(value);
                        }
                    },
                    _tempSaveConfig() {
                        this.trans_tamplates[
                            this.trans_tamplate
                        ] = this.trans_tamplate_str;
                        ConfigTool.setConfig(
                            "trans_tamplate",
                            this.trans_tamplate
                        );
                        ConfigTool.setConfig(
                            "trans_tamplate_str",
                            this.trans_tamplate_str
                        );
                        ConfigTool.setConfig(
                            "trans_tamplates",
                            this.trans_tamplates
                        );
                        for (let key in this.switch_config) {
                            ConfigTool.setConfig(
                                key,
                                this.switch_config[key].value
                            );
                        }
                    },
                    _closeConfigWindow() {
                        if (DisplayTool.transWindowId != null) {
                            layer.close(DisplayTool.configWindowId);
                            DisplayTool.transWindowId = null;
                        } else {
                            layer.closeAll();
                        }
                    },
                    _changeTemplateName() {
                        let newTemplateName = $(
                            BASICMOUNT + ".edit_template_edit"
                        ).val();
                        this.trans_tamplates[
                            newTemplateName
                        ] = this.trans_tamplates[this.trans_tamplate];
                        delete this.trans_tamplates[this.trans_tamplate];
                        this.trans_tamplate = newTemplateName;
                    },
                    editTemplateName(goEdit = false) {
                        let vthis = this;
                        if (
                            $(BASICMOUNT + ".edit_template").text() ==
                                "重命名" ||
                            goEdit == true
                        ) {
                            $(BASICMOUNT + ".edit_template_edit").attr(
                                "readonly",
                                null
                            );
                            $(BASICMOUNT + ".edit_template_select").attr(
                                "disabled",
                                "disabled"
                            );
                            $(BASICMOUNT + ".edit_template").text("完成");
                        } else {
                            $(BASICMOUNT + ".edit_template_edit").attr(
                                "readonly",
                                "readonly"
                            );
                            $(BASICMOUNT + ".edit_template_select").attr(
                                "disabled",
                                null
                            );
                            $(BASICMOUNT + ".edit_template").text("重命名");
                            // 移除首尾空白符
                            $(BASICMOUNT + ".edit_template_edit").val(
                                $(BASICMOUNT + ".edit_template_edit")
                                    .val()
                                    .replace(/^\s*|\s*$/g, "")
                            );
                            let newTemplateName = $(
                                BASICMOUNT + ".edit_template_edit"
                            ).val();
                            if (newTemplateName == this.trans_tamplate) {
                                return;
                            }
                            if (this.trans_tamplates[newTemplateName]) {
                                layer.confirm(
                                    "该模版名已存在，是否覆盖？",
                                    {
                                        btn: ["是", "否"], //按钮
                                    },
                                    function () {
                                        vthis._changeTemplateName();
                                        layer.msg("修改成功！");
                                    }
                                );
                                return;
                            }
                            vthis._changeTemplateName();
                            layer.msg("修改成功！");
                        }
                    },
                    createTemplate() {
                        let newName = "新模版";
                        let count = 1;
                        while (this.trans_tamplates[newName]) {
                            newName = "新模版" + count;
                            count++;
                        }
                        this.trans_tamplate = newName;
                        this.trans_tamplate_str = this.default_tamplate;
                        this.trans_tamplates[newName] = this.trans_tamplate_str;
                        this._flushEdit();
                        this.editTemplateName(true);
                    },
                    deleteTemplate() {
                        let vthis = this;
                        layer.confirm(
                            "确认删除当前模版？",
                            {
                                btn: ["确认", "再想想"], //按钮
                            },
                            function (index) {
                                delete vthis.trans_tamplates[
                                    vthis.trans_tamplate
                                ];
                                vthis.trans_tamplate = "";
                                for (let tampName in vthis.trans_tamplates) {
                                    vthis.trans_tamplate = tampName;
                                    break;
                                }
                                if (vthis.trans_tamplate == "") {
                                    vthis.trans_tamplates["default"] =
                                        vthis.default_tamplate;
                                    vthis.trans_tamplate = "default";
                                }
                                vthis.trans_tamplate_str =
                                    vthis.trans_tamplates[vthis.trans_tamplate];
                                vthis._flushEdit();
                                layer.close(index);
                            }
                        );
                    },
                    selectTemplate(key) {
                        this.trans_tamplate = key;
                        this.trans_tamplate_str = this.trans_tamplates[
                            this.trans_tamplate
                        ];
                        this._flushEdit();
                    },
                    configSave() {
                        this._tempSaveConfig();
                        ConfigTool.saveConfig();
                        this._closeConfigWindow();
                        layer.msg("已保存配置");
                    },
                    configTempSave() {
                        // 更新值
                        this._tempSaveConfig();
                        this._closeConfigWindow();
                        layer.msg("临时保存配置");
                    },
                    configReset() {
                        this._flushEdit();
                        layer.msg("已重置选项");
                    },
                    configCancel() {
                        this._closeConfigWindow();
                        layer.msg("已取消配置");
                    },
                },
                mounted() {
                    // `this` 指向 vm 实例
                    let vthis = this;
                    // 初始化编辑器
                    vthis.editor = DisplayTool.createWangEditor(
                        BASICMOUNT + "#wangeditor_config"
                    );
                    vthis.editor.config.onchange = function (newHtml) {
                        vthis.trans_tamplate_str = newHtml;
                        vthis.trans_tamplates[vthis.trans_tamplate] =
                            vthis.trans_tamplate_str;
                        ConfigTool.setConfig("trans_tamplate_str", newHtml);
                    };
                    vthis._fillConfig();
                    vthis._flushEdit();
                },
            });
            DisplayTool.configDom = configDom;
            DisplayTool.configApp = configapp;
        };

        DisplayTool.transWindowId = null;
        DisplayTool.transDom = null;
        DisplayTool.transApp = null;

        // 初始化烤推界面
        DisplayTool.initTrans = function () {
            if (DisplayTool.transApp != null) {
                return;
            }
            let transDom = document.createElement("div");
            transDom.id = "script_trans_out";
            transDom.style.display = "none";
            transDom.className = "script_out";
            transDom.innerHTML = `
                    <div id="script_trans" style="padding:20px">
                        <div class="trans">
                            <div class="card">
                                <div class="card-header">
                                    原文及模版预览
                                </div>
                                <div class="card-body">
                                    <div v-html="tweet_html"></div>
                                    <hr>
                                    <div class="insert_trans_type" v-html="trans_tamplate_str"></div>
                                    <br>
                                    <button class="btn btn-primary" @click="pasteToEdit">粘贴原文到编辑器</button>
                                </div>
                            </div>
                            <hr>
                            <div>
                                <div>
                                    <h3>翻译内容</h3>
                                </div>
                                <div class="form-group">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">模版</span>
                                        </div>
                                        <input type="text" class="form-control edit_template_edit"
                                            aria-label="Text input with dropdown button" readonly :value="trans_tamplate">
                                        <div class="input-group-append">
                                            <button class="btn btn-outline-secondary dropdown-toggle edit_template_select"
                                                type="button" data-toggle="dropdown" aria-haspopup="true"
                                                aria-expanded="false">选择模版</button>
                                            <div class="dropdown-menu">
                                                <button class="dropdown-item" @click="selectTemplate(k)"
                                                    v-for="v,k in trans_tamplates">{{ k
                                                    }}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div id="wangeditor_trans"></div>
                                </div>
                                <div>
                                    <button type="button" class="btn btn-primary" @click="trans_submit">提交</button>
                                    <button type="button" class="btn btn-primary" @click="trans_reset">重置</button>
                                    <button type="button" class="btn btn-secondary" @click="trans_cancel">取消</button>
                                </div>
                            </div>
                        </div>
                    </div>
            `;
            DisplayTool.basicDom.appendChild(transDom);

            let transApp = new Vue({
                el: BASICMOUNT + "#script_trans_out",
                data: {
                    tweet_html: "",
                    tweet_text: "",
                    transtr: "",
                    trans_tamplate: "default",
                    trans_tamplate_str: "<p>翻译自日语</p>",
                    trans_tamplates: {
                        default: `<p>翻译自日语</p>`,
                    },
                },
                watch: {
                    tweet_text() {
                        this.tweet_html = TweetHtml.textparse(this.tweet_text);
                    },
                },
                methods: {
                    _closeConfigWindow() {
                        if (DisplayTool.transWindowId != null) {
                            layer.close(DisplayTool.transWindowId);
                            DisplayTool.transWindowId = null;
                        } else {
                            layer.closeAll();
                        }
                    },
                    _fillConfig() {
                        this.trans_tamplate = ConfigTool.getConfig(
                            "trans_tamplate"
                        );
                        this.trans_tamplate_str = ConfigTool.getConfig(
                            "trans_tamplate_str"
                        );
                        this.trans_tamplates = ConfigTool.getConfig(
                            "trans_tamplates"
                        );
                    },
                    selectTemplate(key) {
                        this.trans_tamplate = key;
                        this.trans_tamplate_str = this.trans_tamplates[
                            this.trans_tamplate
                        ];
                    },
                    pasteToEdit() {
                        this.transtr = this.editor.txt.html() + this.tweet_html;
                        this.editor.txt.html(this.transtr);
                    },
                    trans_submit() {
                        try {
                            TweetHtml.removeAllInsert();
                            let trans = TweetHtml.parsingArgStr(
                                this.transtr,
                                ConfigTool.getConfig("trans_tamplate_str")
                            );
                            TweetHtml.staticAnchorSwitch(
                                TweetHtml.parseAnchors,
                                false
                            );
                            TweetHtml.insertTrans(
                                TweetHtml.parseAnchors.tweetAnchors,
                                trans
                            );

                            Logger.debug(
                                trans,
                                TweetHtml.parseAnchors.tweetAnchors
                            );
                            this._closeConfigWindow();
                            layer.msg("已注入翻译，并切换到烤推视图。");
                        } catch (error) {
                            layer.msg("出错了！");
                            Logger.exception(error);
                        }
                    },
                    trans_reset() {
                        this.transtr = this.tweet_html;
                        this.editor.txt.html(this.tweet_html);
                    },
                    trans_cancel() {
                        this._closeConfigWindow();
                    },
                },
                mounted() {
                    // `this` 指向 vm 实例
                    let vthis = this;
                    vthis.editor = DisplayTool.createWangEditor(
                        BASICMOUNT + "#wangeditor_trans"
                    );
                    vthis.editor.txt.html(vthis.transtr);
                    vthis.editor.config.onchange = function (newHtml) {
                        vthis.transtr = newHtml;
                    };
                    vthis._fillConfig();
                },
            });
            DisplayTool.transDom = transDom;
            DisplayTool.transApp = transApp;
        };

        DisplayTool.sideDom = null;
        DisplayTool.sideApp = null;
        // 初始化侧边栏
        DisplayTool.initSide = function () {
            if (DisplayTool.sideApp != null) {
                return;
            }
            let sideDom = document.createElement("div");
            sideDom.id = "vue_sidebar";
            sideDom.innerHTML = `
                <div class="sidebar_outbord">
                    <div class="sidebar_trigger">
                        <div class="sidebar">
                            <div class="sidebar_type_content">
                                <div class="sidebar_type">
                                    <span>脚本烤推</span>
                                </div>
                            </div>
                            <div class="sidebar_container button-group-style">
                                <CSSbutton :title="'标记'" @click="parsing"></CSSbutton>
                                <CSSbutton :title="'视图'" @click="onlymainswitch"></CSSbutton>
                                <CSSbutton :title="'配置'" @click="displayConfig"></CSSbutton>
                                <CSSbutton :title="'烤推'" @click="displayTrans"></CSSbutton>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            DisplayTool.basicDom.appendChild(sideDom);
            let markLimit = false;
            let sideApp = new Vue({
                el: ".sidebar_outbord",
                data: {},
                methods: {
                    parsing() {
                        if (!Tweet.isTweet) {
                            layer.msg("不在具体推文界面中！");
                            return;
                        }
                        if (!TweetHtml.parseAnchors) {
                            if (TweetHtml.parsing()) {
                                layer.msg("解析成功！");
                                let parseAnchors = TweetHtml.parseAnchors;
                                Logger.info("开启轮廓标记");
                                TweetHtml.staticAnchorSwitch(
                                    parseAnchors,
                                    false
                                );
                                for (let elarti in parseAnchors.tweetAnchors
                                    .elarts) {
                                    let elart =
                                        parseAnchors.tweetAnchors.elarts[
                                            elarti
                                        ];
                                    $(elart.dom).addClass(
                                        "script_parsing_flag"
                                    );
                                    for (let texti in elart.textAnchors) {
                                        let textPoint =
                                            elart.textAnchors[texti];
                                        $(textPoint.dom).addClass(
                                            "script_parsing_flag"
                                        );
                                    }
                                }

                                setTimeout(function () {
                                    for (let elarti in parseAnchors.tweetAnchors
                                        .elarts) {
                                        let elart =
                                            parseAnchors.tweetAnchors.elarts[
                                                elarti
                                            ];
                                        $(elart.dom).removeClass(
                                            "script_parsing_flag"
                                        );
                                        for (let texti in elart.textAnchors) {
                                            let textPoint =
                                                elart.textAnchors[texti];
                                            $(textPoint.dom).removeClass(
                                                "script_parsing_flag"
                                            );
                                        }
                                    }
                                    Logger.info("关闭轮廓显示");
                                }, 3000);
                            }
                        } else {
                            if (!markLimit) {
                                markLimit = true;
                                for (let key in TweetHtml.CSSAnchor) {
                                    $(
                                        TweetHtml.CSSAnchor[key](
                                            TweetHtml.CSSAnchor.rootElem()
                                        )
                                    ).addClass("script_parsing_flag");
                                }
                                setTimeout(function () {
                                    markLimit = false;
                                    for (let key in TweetHtml.CSSAnchor) {
                                        $(
                                            TweetHtml.CSSAnchor[key](
                                                TweetHtml.CSSAnchor.rootElem()
                                            )
                                        ).removeClass("script_parsing_flag");
                                    }
                                }, 5000);
                            }
                        }
                    },
                    displayConfig() {
                        DisplayTool.configWindowId = layer.open({
                            type: 1,
                            area: "800px",
                            title: "配置",
                            resize: false,
                            shadeClose: false, //点击遮罩关闭
                            content: $(DisplayTool.configApp.$el),
                        });
                    },
                    displayTrans() {
                        if (!Tweet.isTweet) {
                            layer.msg("当前不在推文查看页面，功能无法使用！");
                            return;
                        }
                        DisplayTool.transApp.tweet_text = Tweet.getTransDisplayText(
                            Tweet.nowTweetInfo.tweet
                        );
                        DisplayTool.transWindowId = layer.open({
                            type: 1,
                            area: "800px",
                            title: "烤推",
                            resize: false,
                            shadeClose: false, //点击遮罩关闭
                            content: $(DisplayTool.transApp.$el),
                        });
                    },
                    onlymainswitch() {
                        if (!Tweet.isTweet) {
                            layer.msg("当前不在推文查看页面，功能无法使用！");
                            return;
                        }
                        if (TweetHtml.parseAnchors) {
                            layer.msg("视图切换");
                            TweetHtml.staticAnchorSwitch(
                                TweetHtml.parseAnchors
                            );
                        } else {
                            layer.msg("请先解析推文！");
                        }
                    },
                },
            });
            DisplayTool.sideDom = sideDom;
            DisplayTool.sideApp = sideApp;
        };
    })();

    function initGlobalEnv() {
        unsafeWindow.layer = layer;
        unsafeWindow.ConfigTool = ConfigTool;
        unsafeWindow.wangEditor = window.wangEditor;
        unsafeWindow.DisplayTool = DisplayTool;
        unsafeWindow.TweetHtml = TweetHtml;
        unsafeWindow.AjaxHook = AjaxHook;
        unsafeWindow.Tweet = Tweet;
        unsafeWindow.Logger = Logger;
        unsafeWindow.$ = $;
    }

    function init() {
        initGlobalEnv();
        Style.load();
        ConfigTool.readConfig();
    }

    function main() {
        DisplayTool.initConfig();
        DisplayTool.initTrans();
        DisplayTool.initSide();
        TweetHtml.loopShowHide();
        // URL变化时更新状态
        let hasParsing = false;
        Tool.addUrlChangeEventListener(function (e) {
            let tweetId = Tweet.getNowTweetId();
            Logger.debug(
                "页面URL变化 ->",
                window.location.href,
                ";推文ID解析=",
                tweetId
            );
            if (tweetId == null) {
                TweetHtml.parseAnchors = null;
            }
            if (!hasParsing) {
                TweetHtml.waitLoad(function () {
                    hasParsing = true;
                    setTimeout(function () {
                        TweetHtml.parsing();
                        hasParsing = false;
                    }, 1);
                }, 1500);
            }
        });
        TweetHtml.parsing();
    }
    init();
    TweetHtml.waitLoad(main, 15000);
})();




