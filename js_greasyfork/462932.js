// ==UserScript==
// @name         GGn 20 Questions Host
// @namespace    https://greasyfork.org
// @license      MIT
// @version      0.6b
// @description  Help Host 20 questions type games on GGn
// @author       drlivog
// @match        https://gazellegames.net/forums.php?*action=viewthread*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462932/GGn%2020%20Questions%20Host.user.js
// @updateURL https://update.greasyfork.org/scripts/462932/GGn%2020%20Questions%20Host.meta.js
// ==/UserScript==
/* globals $ */
//from htmlToBBCode taken and modified from https://gist.github.com/soyuka/6183947
//https://gazellegames.net/forums.php?action=viewthread&threadid=20829

const activategames = [960, 20829]; //threadids to work on
const default_numbered = false;
const use_floating_window = false;

const first_letter_case = "lower"; //upper or lower, anything else will not change

const htmlToBBCodeInject = `function htmlToBBCode(html)
{
    html = html.replace(/<pre(.*?)>(.*?)<\\/pre>/gmi, "[code]$2[/code]");
    html = html.replace(/<br>\\s*?<br>\\s*?Last edited by([\\s\\S]*)<\\/span>/, "");
    html = html.replace(/<blockquote(.*?)>(.*?)<\\/blockquote>/gmi, "[quote]$2[/quote]");
    html = html.replace(/<h[1-7](.*?)>(.*?)<\\/h[1-7]>/, "\\n[h]$2[/h]\\n");
    html = html.replace(/<span class="size([0-9]*?)">(.*?)<\\/span>/, "[size=$1]$2[/size]");
    html = html.replace(/<span style="color: (.*?);">(.*?)<\\/span>/, "[color=$1]$2[/color]");
    html = html.replace(/<br(.*?)>/gi, "");
    html = html.replace(/<textarea(.*?)>(.*?)<\\/textarea>/gmi, "\\[code]\$2\\[\\/code]");
    html = html.replace(/<b>/gi, "[b]");html = html.replace(/<i>/gi, "[i]");
    html = html.replace(/<u>/gi, "[u]");
    html = html.replace(/<\\/b>/gi, "[/b]");html = html.replace(/<\\/i>/gi, "[/i]");
    html = html.replace(/<\\/u>/gi, "[/u]");html = html.replace(/<em>/gi, "[b]");
    html = html.replace(/<\\/em>/gi, "[/b]");html = html.replace(/<strong(.*?)>/gi, "[b]");
    html = html.replace(/<\\/strong>/gi, "[/b]");html = html.replace(/<cite>/gi, "[i]");
    html = html.replace(/<\\/cite>/gi, "[/i]");
    html = html.replace(/<font color="(.*?)">(.*?)<\\/font>/gmi, "[color=\$1]\$2[/color]");
    html = html.replace(/<font color=(.*?)>(.*?)<\\/font>/gmi, "[color=\$1]\$2[/color]");
    html = html.replace(/<link(.*?)>/gi, "");
    html = html.replace(/<li(.*?)>(.*?)<\\/li>/gi, "[*]\$2\\n");
    html = html.replace(/<ul(.*?)>/gi, "");
    html = html.replace(/<\\/ul>/gi, "");
    html = html.replace(/<ol(.*?)>/gi, "");
    html = html.replace(/<\\/ol>/gi, "");
    html = html.replace(/<span(.*?)>/gi, "");
    html = html.replace(/<\\/span>/gi, "");
    html = html.replace(/<div(.*?)>/gi, "\\n");
    html = html.replace(/<\\/div>/gi, "\\n");
    html = html.replace(/<td(.*?)>/gi, " ");
    html = html.replace(/<tr(.*?)>/gi, "\\n");
    html = html.replace(/<img(.*?)src="(http:.*?)"(.*?)>/gi, "[img=$2]");
    html = html.replace(/<img(.*?)src="(static.*?)"(.*?)>/gi, "[img=https:\\/\\/gazellegames.net\\/$2]");
    html = html.replace(/<a(.*?)href="(.*?)"(.*?)>(.*?)<\\/a>/gi, "[url=$2]$4[\\/url]");
    html = html.replace(/<!--(.*?)-->/gmi, "\\n");html = html.replace(/<(.*?)>/gmi, "");
    /*html = html.replace(/\\/\\/gi, "/")*/;
    html = html.replace(/http:\\//gi, "http:\\/\\/");
    html = html.replace(/\\r\\r/gi, "");
    html = html.replace(/\\[img]\\//gi, "[img]");
    html = html.replace(/\\[url=\\//gi, "[url=");
    return html.trim();
}`;

const copyFloatingWindowInject=`function Copy(postid, user, link) {
    let post;
    if (document.getSelection().toString() && inPost(document.getSelection().anchorNode) && inPost(document.getSelection().focusNode)) {
        post=getSelection().toString();
    } else {
        post = htmlToBBCode(\$("#content"+postid).html().trim());
    };
    if (\$("#float_numbered").is(":checked")){
        post=post.replace(/^\\[\\*\\]\\s?/mg, "[#] ")
    }
    \$("#float").css("display","block");
    \$("#float_quickpost").val(function (i,text){
        let numbered="";
        if (\$("#float_numbered").is(":checked") && !post.startsWith("[#]")) {
            numbered="[#] ";
        }
        if (text.length===0) {
            return numbered+post+" ";
        }
        return text+"\\n"+numbered+post+" "
    });
    function inPost(elt) {
        return \$.contains(\$("#post" + postid)[0],elt);
    }
}`;

const floatingWindowInject='const fabElement = document.getElementById("float");const float_header = document.getElementById("float_header");let oldPositionX,oldPositionY;const move = (e) => {if (!document.body.matches(":active")) {window.removeEventListener("mousemove", move);return;};if (e.type === "touchmove") {fabElement.style.top = (e.touches[0].clientY-oldPositionY) + "px";fabElement.style.left = (e.touches[0].clientX-oldPositionX) + "px";} else {fabElement.style.top = (e.clientY-oldPositionY) + "px";fabElement.style.left = (e.clientX-oldPositionX) + "px";};};const mouseDown = (e) => {oldPositionY = e.clientY-fabElement.offsetTop;oldPositionX = e.clientX-fabElement.offsetLeft;if (e.type === "mousedown") {window.addEventListener("mousemove", move);} else {window.addEventListener("touchmove", move);};};const mouseUp = (e) => {if (e.type === "mouseup") {window.removeEventListener("mousemove", move);} else {window.removeEventListener("touchmove", move);};};float_header.addEventListener("mousedown", mouseDown);window.addEventListener("mouseup", mouseUp);float_header.addEventListener("touchstart", mouseDown);window.addEventListener("touchend", mouseUp);';

(function() {
    'use strict';
    if (!checkThread()) {return;}
    //$('a:contains("[Quote]")').after(function() {return ' <a id="'+this.id.replace('quote','copy')+'" href="#0" style="font-size: .8em;" data-id='+this.id.replace('quote','')+' onclick="'+$('#'+this.id).attr('onclick').replace('Quote','Yes')+'">[yes]</a>'});
    $('a:contains("[Quote]")')
        .after(function() { return ` <a id="${this.id.replace('quote','qmark')}" class="addqmark" data-id="${this.id.replace('quote_','')}" href="#0" style="font-size: .8em;">[?]</a>`;})
        .after(function() { return ` <a id="${this.id.replace('quote','no')}" class="answerno" data-id="${this.id.replace('quote_','')}" href="#0" style="font-size: .8em;">[No]</a>`;})
        .after(function() { return ` <a id="${this.id.replace('quote','yes')}" class="answeryes" data-id="${this.id.replace('quote_','')}" href="#0" style="font-size: .8em;">[Yes]</a>`;});
    $('.answeryes').click( (event) => answer(event.target.dataset.id, "yes"));
    $('.answerno').click( (event) => answer(event.target.dataset.id, "no"));
    $('head').append(`<script>${htmlToBBCodeInject}</script>`);
    if (use_floating_window) {
        $('head').append(`<script>${copyFloatingWindowInject}</script>`);
        $('head').append('<style>#float {position: fixed;z-index: 10000;left: calc(97vw - 400px);top: calc(50vh);block-size: fit-content;text-align: center;padding: 0; border-radius: 5px; display: none}#float_header {display: block; position: relative; border-top-left-radius: 5px; border-top-right-radius: 5px;cursor: move;height: 15px;background-color: #2196F3;color: #fff; user-select: none;} #float_close {background-color: #ff0000; position: absolute; vertical-align: middle; text-align: center; line-height: 10px; margin: 0; padding: 0; float: right; top: 3px; right: 10px; height: 10px; width: 10px; cursor: pointer}#float_quickpost{position: relative; display: block; padding: 0;margin: 0; width: 400px; height: 200px;}</style>');
        $('body').append('<div id="float"><div id="float_header"><div id="float_close">&times;</div></div><textarea id="float_quickpost" placeholder="Enter text here"></textarea><div><input type=button id="float_post" value="Post" style="float: left"><input type=button id="float_clear" value="Clear" style="float: left"><input type="checkbox" id="float_numbered" checked="'+default_numbered+'"><label for="float_numbered">Numbered</label></div></div>');
        $('#float_post').click(function() {
            $('#quickpost').val($('#float_quickpost').val());
            window.location.href = "#quickpost";
        });
        $('#float_clear').click(function() {$('#float_quickpost').val("");});
        $('#float_close').click(function() {$('#float_quickpost').val(""); $('#float').css('display', 'none');});
        $('#float_numbered').click(function() {
            if ($('#float_numbered').is(":checked")) {
                let v = $('#float_quickpost').val().replace(/^\[\*\]\\s?/mg, "[#] ").split('\n');
                let t="";
                for(let i=0; i<v.length; i++) {
                    if (!v[i].startsWith("[#]")) {
                        t+="[#] " + v[i];
                    } else {
                        t+=v[i];
                    }
                    if (i < v.length - 1) {
                        t+="\n";
                    }
                }
                console.log(t);
                $('#float_quickpost').val(t);
            }
        });
        $('head').append(`<script>${floatingWindowInject}</script>`);
    } else {
        $('head').append('<script>const default_numbered='+default_numbered+'; function Copy(postid, user, link) {let post; if (getSelection().toString() && inPost(getSelection().anchorNode) && inPost(getSelection().focusNode)) {post=getSelection().toString();} else { post = htmlToBBCode($("#content"+postid).html().trim()); }; if(default_numbered===true){post=post.replace(/^\\[\\*\\]\\s?/mg, "[#] ")} $("#quickpost").val(function (i,text){let numbered=""; if(default_numbered===true && !post.startsWith("[#]")) {numbered="[#] ";} if (text.length===0) {return numbered+post+" ";} return text+"\\n"+numbered+post+" "}); function inPost(elt) {return $.contains($("#post" + postid)[0],elt);}};</script>');
        if (!default_numbered) {
            $("#quickreplytext").append('<form id="quicknumberform"><input type="button" id="quicknumber" value="Number"/>&nbsp;&nbsp;<label for="quicknumberstart">Start from:<input type="number" id="quicknumberstart" value="1" size="3"/></label></form>');
            $("#quicknumber").click(function() {
                let text = $("#quickpost").val().split("\n");
                let count=parseInt($("#quicknumberstart").val()) || 1;
                for(let i=0; i<text.length; i++) {
                    if (text[i] == "") {
                        continue;
                    }
                    if (text[i].match(/^(\d*?\.\s?).*/)) {
                        text[i] = text[i].replace(/^(\d*?\.\s?)/, (count++)+". ");
                        continue;
                    }
                    if (text[i].match(/^(\[\*\]\s?)/)) {
                        text[i] = text[i].replace(/^(\[\*#\]\s?)/, (count++)+". ");
                        continue;
                    }
                    if (text[i].indexOf("?") > -1) { //only number lines that have a question mark
                        text[i] = (count++)+". "+text[i];
                    }
                }
                $("#quickpost").val(text.join("\n"));
                return false;
            });
            $("#quicknumberform").submit(function(event) {
                $("#quicknumber").click();
                event.preventDefault();
            });
        }
    }
})();

function answer(postid, response) {
    let post;
    if (getSelection().toString() && inPost(getSelection().anchorNode) && inPost(getSelection().focusNode)) {
        post=getSelection().toString();
    } else {
        post = htmlToBBCode($("#content"+postid).html().trim());
        if (post.indexOf("?") > 0) { //Return up to first ?
            post = post.substring(0, post.indexOf("?")+1);
        } else if (post.indexOf("\n") > 0) { //Or return first line
            post = post.substring(0, post.indexOf("\n"));
        }
        post = post.trim().replace(/^is it/i,"").trim(); //remove is it from the begining
        if (!post.indexOf("?")) {
            post+="?";
        }
        if (first_letter_case.toLowerCase() == "upper") {
            post = post.slice(0,1).toUpperCase() + post.substring(1);
        } else if (first_letter_case.toLowerCase() == "lower") {
            post = post.slice(0,1).toLowerCase() + post.substring(1);
        }
    }
    if(default_numbered===true){
        post = post.replace(/^[*]\s?/mg, "[#] ");
    }
    $("#quickpost").val(function (i,text) {
        let numbered="";
        if(default_numbered===true && !post.startsWith("[#]")) {
            numbered="[#] ";
        }
        if (text.length===0) {
            return numbered+post+" "+response;
        } return text+"\n"+numbered+post+" "+response;
    });
    function inPost(elt) {return $.contains($("#post" + postid)[0], elt);}
}



function checkThread() {
    let threadid = window.location.href.match(/threadid=([0-9]+)/)[1];
    return activategames.includes(parseInt(threadid));
}

function htmlToBBCode(html)
{
    html = html.replace(/<pre(.*?)>(.*?)<\/pre>/gmi, "[code]$2[/code]");
    html = html.replace(/<br>\s*?<br>\s*?Last edited by([\s\S]*)<\/span>/, "");
    html = html.replace(/<blockquote(.*?)>(.*?)<\/blockquote>/gmi, "[quote]$2[/quote]");
    html = html.replace(/<h[1-7](.*?)>(.*?)<\/h[1-7]>/, "\n[h]$2[/h]\n");
    html = html.replace(/<span class="size([0-9]*?)">(.*?)<\/span>/, "[size=$1]$2[/size]");
    html = html.replace(/<span style="color: (.*?);">(.*?)<\/span>/, "[color=$1]$2[/color]");
    html = html.replace(/<br(.*?)>/gi, "");
    html = html.replace(/<textarea(.*?)>(.*?)<\textarea>/gmi, "[code]$2[/code]");
    html = html.replace(/<b>/gi, "[b]");
    html = html.replace(/<i>/gi, "[i]");
    html = html.replace(/<u>/gi, "[u]");
    html = html.replace(/<\/b>/gi, "[/b]");
    html = html.replace(/<\/i>/gi, "[/i]");
    html = html.replace(/<\/u>/gi, "[/u]");
    html = html.replace(/<em>/gi, "[b]");
    html = html.replace(/<\/em>/gi, "[/b]");
    html = html.replace(/<strong(.*?)>/gi, "[b]");
    html = html.replace(/<\/strong>/gi, "[/b]");
    html = html.replace(/<cite>/gi, "[i]");
    html = html.replace(/<\/cite>/gi, "[/i]");
    html = html.replace(/<font color="(.*?)">(.*?)<\/font>/gmi, "[color=$1]$2[/color]");
    html = html.replace(/<font color=(.*?)>(.*?)<\/font>/gmi, "[color=$1]$2[/color]");
    html = html.replace(/<link(.*?)>/gi, "");
    html = html.replace(/<li(.*?)>(.*?)<\/li>/gi, "[*]$2\n");
    html = html.replace(/<ul(.*?)>/gi, "");
    html = html.replace(/<\/ul>/gi, "");
    html = html.replace(/<ol(.*?)>/gi, "");
    html = html.replace(/<\/ol>/gi, "");
    html = html.replace(/<span(.*?)>/gi, "");
    html = html.replace(/<\/span>/gi, "");
    html = html.replace(/<div(.*?)>/gi, "\n");
    html = html.replace(/<\/div>/gi, "\n");
    html = html.replace(/<td(.*?)>/gi, " ");
    html = html.replace(/<tr(.*?)>/gi, "\n");
    html = html.replace(/<img(.*?)src="(http:.*?)"(.*?)>/gi, "[img=$2]");
    html = html.replace(/<img(.*?)src="(static.*?)"(.*?)>/gi, "[img=https://gazellegames.net/$2]");
    html = html.replace(/<a(.*?)href="(.*?)"(.*?)>(.*?)<\/a>/gi, "[url=$2]$4[/url]");
    html = html.replace(/<!--(.*?)-->/gmi, "\\n");html = html.replace(/<(.*?)>/gmi, "");
    /*html = html.replace(/\\/\\//gi, "/");*/
    html = html.replace(/http:\\\\/gi, "http://");
    html = html.replace(/\\r\\r/gi, "");
    html = html.replace(/\\[img]\\/gi, "[img]");
    html = html.replace(/\[url=\//gi, "[url=");
    return html.trim();
}