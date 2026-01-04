// ==UserScript==
// @name         GGn Guess the Number Game
// @namespace    http://greasyfork.org/
// @version      1.0
// @license      MIT
// @description  Assist with hosting a guess the number game
// @author       drlivog
// @match        https://gazellegames.net/forums.php?*action=viewthread*&threadid=28282*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gazellegames.net
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/462929/GGn%20Guess%20the%20Number%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/462929/GGn%20Guess%20the%20Number%20Game.meta.js
// ==/UserScript==
/* globals $ */

//https://gazellegames.net/forums.php?action=viewthread&threadid=28282

const save_data_on_create_post = true;
const display_toggle = true;              //show [+] to expand or contract game host information
const number_life = -1;                   //amount to subtract for each number guess
const rule_life = -15;                    //amount to subtract for each rule guess
const processRules = true;                //basic rule processing

function htmlToBBCode(html)
{
    html = html.replace(/<br>\s*?<br>\s*?Last edited by([\s\S]*)<\/span>/m, "");
    html = html.replace(/<br(.*?)>/gi, "");
    html = html.replace(/<li(.*?)>(.*?)<\/li>/gi, "$2\n");
    html = html.replace(/<div(.*?)>/gi, "\n");
    html = html.replace(/<\/div>/gi, "\n");
    html = html.replace(/<td(.*?)>/gi, " ");
    html = html.replace(/<tr(.*?)>/gi, "\n");
    html = html.replace(/<a(.*?)href="(.*?)"(.*?)>(.*?)<\/a>/gi, "[url=$2]$4[/url]");
    html = html.replace(/<!--(.*?)-->/gmi, "\n");
    html = html.replace(/<(.*?)>/gm, "");
    html = html.replace(/&gt;/gmi, ">");
    html = html.replace(/&lt;/gmi, "<");
    html = html.replace(/\/\//gmi, "/");
    html = html.replace(/http:\/\//gmi, "http:\\");
    html = html.replace(/\r\r/gmi, "");
    return html.trim();
}

function processRule(rule, number)
{
    rule = rule.trim();
    let match;
    number = parseInt(number);
    if (isNaN(number)) { //if cannot parse number, do not process rules
        console.log("processRule: Number not parseable")
        return null;
    }
    if (match=rule.match(/^([0-9,\.]+)\s?<\s?\w\s?<([0-9,\.]+[\?\.,\!\s]*$)/i) || rule.match(/^([0-9,\.]+)\s?[-:]\s?([0-9,\.]+)[\?\.,\!\s]*$/i) || rule.match(/^between\s?([0-9,\.]+)\s?and\s?([0-9,\.]+)[\?\.,\!\s]*$/i)) { //Between
        let lower=parseInt(match[1].replace(/[,\.]/g,""));
        let upper=parseInt(match[2].replace(/[,\.]/g,""));
        if (lower<number && number<upper) {
            return lower.toLocaleString()+"< x <"+upper.toLocaleString();
        } else {
            return "not "+lower.toLocaleString()+"< x <"+upper.toLocaleString();
        }
    }
    else if (match=rule.match(/^>=\s*?([0-9,\.]+)[\?\.,\!\s]*$/)) { //greater than or equal to
        let compare = parseInt(match[1].replace(/[,\.]/g,""));
        if (number >= compare) {
            return ">="+compare.toLocaleString();
        }
        else {
            return "<"+compare.toLocaleString();
        }
    }
    else if (match=rule.match(/^>\s*?([0-9,\.]+)[\?\.,\!\s]*$/)||rule.match(/^greater\s?(than)?\s*?([0-9,\.]+)[\?\.,\!\s]*$/i)) { //greater than
        let compare = parseInt(match[1].replace(/[,\.]/g,""));
        if (number > compare) {
            return ">"+compare.toLocaleString();
        }
        else {
            return "<="+compare.toLocaleString();
        }
    } else if (match=rule.match(/^<=\s*?([0-9,\.]+)[\?\.,\!\s]*$/)) { //less than or equal to
        let compare = parseInt(match[1].replace(/[,\.]/g,""));
        if (number <= compare) {
            return "<="+compare.toLocaleString();
        }
        else {
            return ">"+compare.toLocaleString();
        }
    } else if (match=rule.match(/^<\s*?([0-9,\.]+)[\?\.,\!\s]*$/) || rule.match(/^less\s?(than)?\s*?([0-9,\.]+)[\?\.,\!\s]*$/i)) { //less than
        let compare = parseInt(match[1].replace(/[,\.]/g,""));
        if (number < compare) {
            return "<"+compare.toLocaleString();
        }
        else {
            return ">="+compare.toLocaleString();
        }
    } else if (match=rule.match(/^(is)?\s*?((odd)|(even))[\?\.,\!\s]*$/i)) { //even or odd number
        if (number % 2 === 0) {
            return "even";
        } else {
            return "odd";
        }
    } else if (match=rule.match(/^(?:is)?\s*(?:(?:divisible)|(?:divided))\s?(?:by)\s?([0-9,\.]+)[\?\.,\!\s]*$/i)) { //divisible by x
        let x = parseInt(match[1].replace(/[,\.]/g,""))
        if (number % x == 0) {
            return "divisible by "+x;
        } else {
            return "not divisible by  "+x;
        }
    }
    return null;
}

const hostingtoolshtml = `<div>
<span id="display_host" alt="Show Hosting Tools" style="cursor: pointer">[+]</span> Hosting Tools
<form id="createpost" style="display: none; background-color: rgba(0, 0, 0, 0.3); padding: 5px;"">
<table style="background-image: none;">
    <tr>
        <td>
            <label for="rules">Rules:
        </td>
        <td class="lefty">
            <textarea id="rules" cols="90" rows="2" style="margin-top: 10px; margin-bottom: 10px;"/></label>
        </td>
        <td style="margin-top: 10px; margin-left: 50px; float: left;">
            <label for="mynumber">Number: <input type="text" id="mynumber" size=7></label>
        </td>
    </tr>
    <tr>
        <td>
            <label for="numbers">Not:
        </td>
        <td class="lefty">
            <input type="text" id="numbers" size="90">
            </label>
        </td>
    </tr>
    <tr>
        <td>
            <label for="hp">HP:
        </td>
        <td class="lefty">
            <input type="number" id="hp" size=4>
            </label>
            <input type="button" id="hp_minusnum"value="${number_life}">
            <input type="button" id="hp_minusrule"value="${rule_life}">
        </td>
    </tr>
</table>
<input type="submit" id="createpost" value="Create Post">&nbsp;
<input type="button" id="save" value="Save Values">&nbsp;
<input type="button" id="clear" value="Clear Values">
</form>
</div>`;

(function() {
    'use strict';
    $('head').append('<style>.lefty { text-align: left; float: left;}</style>');
    $('a:contains("[Quote]")').after(function() {return ' <a id="'+this.id.replace('quote','rule')+'" data-postid="'+this.id.match(/[\d]+/)+'" class="rules" href="#0" style="font-size: .8em;">[Rule]</a>'}); // onclick="'+$('#'+this.id).attr('onclick').replace('Quote','Rule')+'"
    $('a:contains("[Rule]")').after(function() {return ' <a id="'+this.id.replace('rule','number')+'" data-postid="'+this.id.match(/[\d]+/)+'" class="numbers" href="#0" style="font-size: .8em;">[Number]</a>'}); // onclick="'+$('#'+this.id).attr('onclick').replace('Rule','NotNumber')+'"
    $('a:contains("[Number]")').after(function() {return ' <a id="'+this.id.replace('number','hp')+'" data-postid="'+this.id.match(/[\d]+/)+'" class="hp" href="#0" style="font-size: .8em;">[Hp]</a>'}); //onclick="'+$('#'+this.id).attr('onclick').replace('NotNumber','Hp')+'"
    $('#reply_box').before(`${hostingtoolshtml}`);
    if (display_toggle) {
        $('#display_host').click(function() {
            if ($('#display_host').text().startsWith("[+]")) {
                $('#createpost').css('display','block');
                $('#display_host').text("[-]");
            } else {
                $('#createpost').css('display','none');
                $('#display_host').text("[+]");
            }
        });
    } else {
        $('#display_host').css('display', 'none');
        $('#createpost').css('display','block');
    }
    $('#rules').val(GM_getValue('ggnnumber_rules',""));
    $('#rules').focusout(function() {GM_setValue('ggnnumber_rules', $('#rules').val());});
    $('#numbers').val(GM_getValue('ggnnumber_numbers',""));
    $('#numbers').focusout(function() {GM_setValue('ggnnumber_numbers', $('#numbers').val());});
    $('#hp').val(GM_getValue('ggnnumber_hp',""));
    $('#hp').focusout(function() {GM_setValue('ggnnumber_hp', $('#hp').val());});
    $('#mynumber').val(GM_getValue('ggnnumber_mynumber',""));
    $('#mynumber').focusout(function() {GM_setValue('ggnnumber_mynumber', $('#mynumber').val());});
    $('#hp_minusnum').click(function() {
        let hp = parseInt($('#hp').val()) + number_life;
        if (isNaN(hp) || hp<0) {
            hp = 0;
        }
        console.log("Decrease HP by "+number_life+" now have "+hp+" hp");
        $('#hp').val(hp);
    });
    $('#hp_minusrule').click(function() {
        let hp = parseInt($('#hp').val()) + rule_life;
        if (isNaN(hp) || hp<0) {
            hp = 0;
        }
        console.log("Decrease HP by "+rule_life+" now have "+hp+" hp");
        $('#hp').val(hp);
    });
    $('#createpost').submit(function(event) {
        if (save_data_on_create_post) {
            $('#save').click();
        }
        let text = $('#rules').val();
        if ($('#numbers').val()) {
            text+="\n\n"+"not " + $('#numbers').val();
        }
        text+="\n\n"+ $('#hp').val()+ " hp"
        $('#quickpost').val(text);
        event.preventDefault();
    });
    $('#save').click(function() {
        GM_setValue('ggnnumber_rules', $('#rules').val());
        GM_setValue('ggnnumber_numbers', $('#numbers').val());
        GM_setValue('ggnnumber_hp', $('#hp').val());
        GM_setValue('ggnnumber_mynumber', $('#mynumber').val());
        console.log("Saved Values!");
    });
    $('#clear').click(function() {
        $('#rules').val('');
        $('#numbers').val('');
        $('#hp').val('');
        $('#mynumber').val('');
        GM_deleteValue('ggnnumber_rules');
        GM_deleteValue('ggnnumber_numbers');
        GM_deleteValue('ggnnumber_hp');
        GM_deleteValue('ggnnumber_mynumber');
        console.log("Cleared all values!");
    });
    $('.rules').click(function (event){
        let postid = $(this).data("postid");
        let mypost = ($("#nav_userinfo.welcome a.username:first").text().normalize() === $("#post"+postid+" a.username:first").text().replace('∇','').normalize());
        console.log(mypost);
        if ($("#display_host").text().startsWith("[+]")) {
            $("#display_host").click();
        }
        let post;
        let selection=false;
        if (getSelection().toString() && inPost(getSelection().anchorNode, postid) && inPost(getSelection().focusNode, postid)) {
            selection=true;
            post=getSelection().toString();
        } else {
            post = htmlToBBCode($("#content"+postid).html().trim());
        }
        $("#rules").val(function (i,text){
            console.log("Rule Copied: "+ post);
            if (!mypost && $("#hp").val().length>0) {
                $("#hp_minusrule").click();
            }
            post=post.replaceAll("?","");
            if(processRules) {
                let processor=processRule(post,$("#mynumber").val());
                if (processor!=null) {
                    console.log("Processed Rule from: "+post+"\nTo: "+processor);
                    post=processor;
                }
            }
            //$("#content"+postid).append("<br><br><span style=color:green>* Copied Rule *</span>");
            if (text.length===0) {
                return post;
            }
            return text+", "+post
        });
        $("#rule_"+postid).css("color", "red");
        $("#rules").focusout();
        event.preventDefault();
    });
    $('.numbers').click(function (event){
        let postid = $(this).data("postid");
        let numbers = $("#numbers").val().split(", ").map(x => parseInt(x.replace(/[,\.]/, ""), 10));
        let mypost = ($("#nav_userinfo.welcome a.username:first").text().normalize() === $("#post"+postid+" a.username:first").text().replace('∇','').normalize());
        let notpost=false;
        if (numbers[0]===0 || isNaN(numbers[0])){
            numbers.shift();
        }
        if ($("#display_host").text().startsWith("[+]")) {
            $("#display_host").click();
        }
        let post;
        if (getSelection().toString() && inPost(getSelection().anchorNode, postid) && inPost(getSelection().focusNode, postid)) {
            post=getSelection().toString();
        } else {
            post = htmlToBBCode($("#content"+postid).html());
        }
        let notline;
        if(notline=post.match(/^not[:\s=](.*)|[≠∉][:\s]?(.*)/im)) {
            post=notline[0];
            notpost=true;
        }
        let ns=post.split(/[\s]/);
        for(let i=0;i<ns.length;i++) {
            let n=ns[i].trim().replaceAll(',',"");
            if(n==="" || isNaN(parseInt(n))) {
                continue;
            }
            n=parseInt(n);
            if (n===parseInt($("#mynumber").val())) {
                console.log("Winning number found!");
                alert("Winning Number!");
                return;
            }
            if (!(numbers.includes(n))) {
                console.log("Not Number: "+n);
                if ((!mypost || !notpost) && $("#hp").val().length>0){
                    $("#hp_minusnum").click();
                }
                numbers.push(n);
            }
        }
        //$("#content"+postid).append("<br><br><span style=color:green>* Copied Number *<\span>");
        $("#number_"+postid).css("color", "red");
        numbers.sort();
        $("#numbers").val(numbers.join(", "));
        $("#numbers").focusout();
        event.preventDefault();
    });
    $('.hp').click(function (event) {
        let postid = $(this).data("postid");
        if ($("#display_host").text().startsWith("[+]")){
            $("#display_host").click();
        }
        let post;
        if (getSelection().toString() && inPost(getSelection().anchorNode, postid) && inPost(getSelection().focusNode, postid)) {
            post=getSelection().toString().trim();
        } else {
            post = htmlToBBCode($("#content"+postid).html());
        }
        let m;
        if(post.length<4 && parseInt(post)) {
            console.log("Hp Copied[0]: "+ post);
            $("#hp").val(parseInt(post));
            $("#hp_"+postid).css("color", "red");
            $("#hp").focusout();
        } else if (m = post.match(/hp[:=-]?\s?([0-9]+)/im)) {
            console.log("Hp Copied[1]: "+ m[1]);
            $("#hp").val(m[1]);
            $("#hp_"+postid).css("color", "purple");
            $("#hp").focusout();
        } else if (m = post.match(/([0-9]+)\s?hp/im)) {
            console.log("Hp Copied[2]: "+ m[1]);
            $("#hp").val(m[1]);
            $("#hp_"+postid).css("color", "red");
            $("#hp").focusout();
        } else {
            console.log("HP not parsed in "+post);
            alert("Unable to parse hp in post!");
        }
        event.preventDefault();
    });
})();

function inPost(elt, id) {
    return $.contains($("#post" + id)[0],elt);
}