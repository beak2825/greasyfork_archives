// ==UserScript==
// @name         Case Assignment Automator
// @namespace    http://tampermonkey.net/
// @version      1.19
// @description  Case Assignment Remember Configuration & Automated
// @author       Shawn Q
// @match        https://caseassignment.channelservices.microsoft.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.bootcss.com/canvg/1.4/rgbcolor.min.js
// @downloadURL https://update.greasyfork.org/scripts/380950/Case%20Assignment%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/380950/Case%20Assignment%20Automator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    // Variables
    var mine = [];
    var auto_mine = false;
    var dark_mode = false;
    var auto_execute = false;
    var auto_refresh = false;
    var auto_refresh_interval = 1000 * 60 * 6; // In Min
    // End of Variables

    var EXEMPT_MANDARIN = true;
    var TOTAL_NUMBER;

    var bc = [], prem = [], midElms = [], cBox, executeBtn, btnDiv, spans, auto_refresh_func;
    WaitAndCheck();
    var _COUNTER = 0;
    function WaitAndCheck(){
        cBox = document.getElementsByTagName('input');
        TOTAL_NUMBER = cBox.length - 1;
        executeBtn = document.getElementById('prioritize_work_items');
        btnDiv = document.getElementById('prioritize_button');
        PrefImplement();
        midElms.push(btnDiv);
        if(auto_mine){
            CheckMine();
            if(!auto_execute) ExecuteCall();
        }
        Categorize();
        midElms.push(spans[0]);
        Middlize(midElms);
        AddBtns();
    }
    function AutoRefresh(){
        auto_refresh_func = setTimeout(ExecuteCall, auto_refresh_interval);
    }
    function StopAutoRef(){
        clearTimeout(auto_refresh_func);
    }
    function CheckBC(){
        UncheckAll();
        bc.forEach(function(num) {
            cBox[num].click();
        });
        if(auto_execute) ExecuteCall();
    }
    function CheckPrem(){
        UncheckAll();
        prem.forEach(function(num) {
            cBox[num].click();
        });
        if(auto_execute) ExecuteCall();
    }
    function CheckMine(){
        UncheckAll();
        mine.forEach(function(num) {
            cBox[num].click();
        });
        if(auto_execute) ExecuteCall();
    }
    function SaveMine(){
        mine.length = 0;
        for(var i = 0; i < TOTAL_NUMBER; i++)
        {
            if(cBox[i].checked) mine.push(i);
        }
        SetCookie('mine', JSON.stringify(mine));
    }
    function ExecuteCall(){
        executeBtn.click();
    }
    function isEmptyOrSpaces(str){
        return str === null || str.match(/^ *$/) !== null;
    }
    function UncheckAll(){
        for(var i = 0; i < TOTAL_NUMBER; i++)
        {
            if(cBox[i].checked) cBox[i].click();
        }
    }
    function PrefImplement(){
        AddPrefElm();
        if(GetCookie('auto_refresh')) {
            auto_refresh = true;
            document.getElementById('auto_refresh').click();
        }
        if(GetCookie('auto_mine')) {
            auto_mine = true;
            document.getElementById('auto_mine').click();
        }
        if(GetCookie('auto_execute')) {
            auto_execute = true;
            document.getElementById('auto_execute').click();
        }
        if(GetCookie('dark_mode')) {
            dark_mode = true;
            document.getElementById('dark_mode').click();
        }
        try {
            mine = JSON.parse(GetCookie('mine'));
        } catch(e) {
            mine.length = 0;
        }
    }
    function AddDarkSB() {
        var rule = "<style id='darksb_css' type='text/css'>body {background-color: rgb(21, 21, 21) !important;} ::-webkit-scrollbar, ::-webkit-scrollbar-corner, ::-webkit-scrollbar-track-piece { background: #101010 !important; } ::-webkit-scrollbar { width: 17px !important; height: 17px !important; } ::-webkit-scrollbar-thumb { background: #333333; border: 3px solid #101010 !important; border-radius: 8px !important; } ::-webkit-scrollbar-thumb:hover { background: #444444; }</style>";
        $('html').append(rule);
    }
    function RmDarkSB() {
        document.getElementById('darksb_css').remove();
        document.getElementById("__genieContainer").removeAttribute("style");
    }
    function AddPrefElm(){
        var auto_refresh_text = 'Auto Refresh';
        var auto_mine_text = 'Auto Mine';
        var auto_execute_text = 'Auto Execute';
        var dark_mode_text = 'Dark Mode';
        executeBtn.style.background = 'green';
        executeBtn.style.transitionDuration = "0.3s";
        executeBtn.style.transitionTimingFunction = "ease-out";

        var node = document.createElement('DIV');
        node.style.marginRight = '10px';
        node.style.marginLeft = '-176px';
        node.style.textAlign = 'right';
        node.innerHTML =
            '<input type="checkbox" id="dark_mode" name="dark_mode"><label for="dark_mode">'+ dark_mode_text +'</label>'+
            '<input type="checkbox" id="auto_refresh" name="auto_refresh"><label for="auto_refresh">'+ auto_refresh_text +'</label><br />'+
            '<input type="checkbox" id="auto_mine" name="auto_mine"><label for="auto_mine">'+ auto_mine_text +'</label>'+
            '<input type="checkbox" id="auto_execute" name="auto_execute"><label for="auto_execute">'+ auto_execute_text +'</label>';
        executeBtn.parentNode.insertBefore(node, executeBtn);
        $('label').css({"color": "#555"});
        $('span b').css({"color": "#555"});
        $('#current_time').css({"color": "#555"});
        document.getElementById('dark_mode').nextSibling.style.marginRight = '10px';
        document.getElementById('auto_mine').nextSibling.style.marginRight = '10px';
        document.getElementById('dark_mode').onclick = function() {
            dark_mode = this.checked;
            SetCookie('dark_mode', this.checked);
            if(!dark_mode) RmDarkSB();
            var colorProperties = ['color', 'background-color'];
            $('*').each(function() {
                var color = null;
                for (var prop in colorProperties) {
                    prop = colorProperties[prop];
                    if (!$(this).css(prop) || $(this).is('button') || $(this).is(executeBtn)) continue;
                    color = new RGBColor($(this).css(prop));
                    if (color.ok) {
                        $(this).css(prop, 'rgb(' + (255 - color.r) + ', ' + (255 - color.g) + ', ' + (255 - color.b) + ')');
                    }
                    color = null; //some cleanup
                }
            });
            if(dark_mode) AddDarkSB();
        };
        document.getElementById('auto_refresh').onclick = function() {
            auto_refresh = this.checked;
            SetCookie('auto_refresh', this.checked);
            StopAutoRef();
            if(this.checked) AutoRefresh();
        };
        document.getElementById('auto_mine').onclick = function() {
            auto_mine = this.checked;
            SetCookie('auto_mine', this.checked);
        };
        document.getElementById('auto_execute').onclick = function() {
            auto_execute = this.checked;
            SetCookie('auto_execute', this.checked);
        };
    }
    function AddBtn(btn, id, text, func){
        btn = document.createElement("BUTTON");
        btn.classList.add('button');
        btn.id = id;
        btn.innerHTML = text;
        btn.addEventListener("click", func);
        btn.style.marginLeft = "3px";
        btnDiv.appendChild(btn);
        if(id == 'save') btn.style.background = '#232323';
        else if(id == 'clear') btn.style.background = 'rgb(185, 10, 10)';
    }
    function SetCookie(cname, cvalue) {
        var d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    function GetCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                var res = c.substring(name.length, c.length);
                if(res.toLowerCase() == 'true') return true;
                else if (res.toLowerCase() == 'false') return false;
                return res;
            }
        }
        return "";
    }
    function CheckCookie(cname) {
        if (GetCookie(cname) !== "") return true;
        else return false;
    }
    function Middlize(elms){
        elms.forEach(function(elm) {
            elm.style.display = "flex";
            elm.style.justifyContent = "center";
            elm.style.marginLeft = "0px";
        });
        executeBtn.style.marginLeft = "0px";
        btnDiv.style.marginTop = "2px";

        var table = document.getElementById('select_queues');
        table.style.position = "relative";
        table.style.left = "50%";
        table.style.transform = "translate(-50%)";
        table.style.marginLeft = "0px";
    }
    function AddBtns(){
        var btn;

        AddBtn(btn, 'mine', 'Mine', CheckMine);
        AddBtn(btn, 'bc', 'BC', CheckBC);
        AddBtn(btn, 'prem', 'Prem', CheckPrem);
        AddBtn(btn, 'save', 'Save', SaveMine);
        AddBtn(btn, 'clear', 'Clear', UncheckAll);
    }
    function Categorize(){
        spans = document.getElementsByTagName("span");
        spans[0].parentNode.style.marginLeft = "0px";
        var needSearch = ['bc', 'prem'];

        for (var i = 1; i <= TOTAL_NUMBER; i++) {
            var spanTxt = spans[i].innerText.toLowerCase();
            if (spanTxt.includes(needSearch[0]) || spanTxt.includes(needSearch[1])) {
                if(spanTxt.includes(needSearch[0])){
                    bc.push(i-1);
                } else if (EXEMPT_MANDARIN && spanTxt.includes('mandarin')) {}
                else prem.push(i-1);
            }
        }
    }
})();