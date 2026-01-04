// ==UserScript==
// @name            DOI-Unlock
// @namespace       https://greasyfork.org/en/users/738719-szmegma
// @version         1.0.6
// @description     DOI-Unlock with CTRL+left click on any DOI on any page will turn to 3 buttons, which are linked to Sci-Hub, Lib-Gen and Z-Lib
// @author          szmegma
// @match           http://*/*
// @match           https://*/*
// @require         https://code.jquery.com/jquery-latest.min.js
// @license         MIT
// @grant           GM_addStyle
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAACAVBMVEUAAADYiwvZpxGjo6OkpKSkpKTZnxCjo6OioqLZoxDZmw/Zlg7ZlA7Zjgyjo6OkpKSlpaWjo6PZkQ2kpKSkpKTZmg7YkQ2kpKSjo6Ojo6Ojo6Ojo6Ojo6OoqKixsbHapxLZnQ/YpxGjo6PZjAykpKTZpxDZjQzViwmjo6PZpRHZpRHLpTjYjgzZjgykpKTVphujo6PZphHWphGjo6OlpaX///8AAAC9vb3/pAD/vgb/uwb/uQXjkgn/oQDqsQ3/tgS7u7v/rwO8vLylpaX/tAT/pQGtra3/qwKqqqr/5a//68Kurq7/rAO2trb3twj3oAL//fqzs7Onp6f3rQXuqgMDAQD/+/P/7MH/uSX2sAb/qAT3pAT/sAOfbwL/9N7/7sn/35v/vTv3swepdAP0pgKfaQAoGwAJBgD/89j/137Or1P/y1H/uxX3qASfcwP4ogJaQgKyeQHYjABtSAAbEwD/8M24uLisrKz/6Kr/1nf/0HT/1XD/ymn/xFn/wlHGp0z/x0KfgD//xi+fdBv/uBDnsA7/qw7vtAvrlwb/swTmnQSIXQTNjgLKhwHmlQClawD//PX/9uH/79H/6rj/56//5Kf/1or/2oT/1G7/xE//v0T/vEP7uiD/tCDbnATBjQTzqgOfcQKNZAJ0UgFbQAHwnACTXwB7UQBCKwA0JQAYEADQdliYAAAANXRSTlMAcZ3+jxn1bzn19fX19IpiFvf1kgn19fLguJtyQA8E/PWSeWZUPTwb69nY1MzKwaelWVlLKPS7cy4AAAKKSURBVEjH3dLnW9pAHMBxW9TWAUirdYJbu3dSq21RSMCKgAyRaYuIA2hBcO9aZ+vo3nu3f2V/B3l44LnkOt+03xeBJPdJ7u5Jxl+psEK6h0taIf8JkFVWrG5PppadPPsjIS1u16vOJVPpJ2TlZFEuMgFIS6+WkMQZkT7+bK6EHldLCQsvMcGQVp1ZzWXWtcIF00G58ELMKjSR0rq9XHWl6nF4qVl4OaU6uJ8+9Uz0FNNxQVKsh9slitRLCjRXvUwhIOQimLmuLP1imQ5WJyoQIAVxsj/9YqYGkax/jRTKJjQacw2B4FVIJJKaQn5C7D8g9dW7+TqyEAgEFk5U1+PidOXKJUIrlacwcnjtPLG1QxjJMZCJIYeHNBMjEkckEnmdNnxpcnKJh2T3tXBZaZq+3pJS8xBF3TVk/woJUdALPqLkihNlaj0UNdbHQxwMw7zyvPNZEXkLJ8rFJzPBZQYKTQ2HHDipcjDWD90wevA9HDwME+ylINtjJcM8tNnuO6owkmt585VO5tmYobh6ljcewNGSy0NiNDQwkCCLFNQ71gXHq+7L/KTo1iBNj2663ZujiFyhqDtBt9sOv112IeKDkSNt0Aj8uQlPH0YndnjPFJAOSxFG8m7TdHc/GtUPm3ADiLcNNQQzQ+RangDphJKkE0Ug+WhiPi2UnBg6QRObFiJo+d+2tNottHw/LNv2VKt9mVg+EFc+TlyfUzbZ/yy+yffim+wUIAdc4S90Mr9zmuLqWE2QfTgJs8ZY/IOJIcKy84kP5pGTZREJ8xAjy7LbO592tpui0ehHOHF6Z2fnV1nIOzf33IgTsbGJ2O8QMUaOrV8ktn4UIw3iC8TEDRlYjbW7CNU2ZvxB3wGnnimlJ4uJUAAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/422203/DOI-Unlock.user.js
// @updateURL https://update.greasyfork.org/scripts/422203/DOI-Unlock.meta.js
// ==/UserScript==

//================================================== settings

//variables
const
    regex = '(10\.[0-9]{4,}(?:\.[0-9]+)*/(?:(?![%"&\'<>#? ])\\S)+)',
    doiRegex = new RegExp('(?:' + regex + ')', 'i'),
    //doiRegex = new RegExp(regex),
    btn1 = document.createElement('input'),
    btn2 = document.createElement('input'),
    btn3 = document.createElement('input'),
    libgenURL = 'http://libgen.li/scimag/index.php?s=',
    zlibURL = 'https://booksc.org/s/?q=',
    scihubURL = 'https://sci-hub.ru/',
    style = "color:orange;font-size:1.5rem;line-height:2;padding:5px;background:black;text-shadow: 1px 1px 0 black, 1px -1px 0 black, -1px 1px 0 black, -1px -1px 0 black";

//================================================== find DOI
function findDOI(element){
    if($(element).is("[href*='org/10.']"))
        return $(element).attr("href").split('org/')[1].trim();
    if($(element).text().match(doiRegex)!==null)
        return $(element).text().match(doiRegex)[0].trim();
    return false;
}

//================================================== button click to navigate the selected site
function unlockDOI(){
    if($(this).is("[data-doi]")){
        if(this.id=='scihub')
            window.open(scihubURL+$(this).attr('data-doi')); 
        if(this.id=='zlib')
            window.open(zlibURL+$(this).attr('data-doi')); 
        if(this.id=='libgen')
            window.open(libgenURL+$(this).attr('data-doi'));
    }
}

$(document).ready(function(){

//================================================== set attributes for all buttons
    btn1.setAttribute("value", "SCI-HUB");
    btn1.setAttribute("type", "button");
    btn1.setAttribute("id", "scihub");
    btn1.setAttribute("class", "DOI-unlock-button");

    btn2.setAttribute("value", "Z-LIB");
    btn2.setAttribute("type", "button");
    btn2.setAttribute("id", "zlib");
    btn2.setAttribute("class", "DOI-unlock-button");

    btn3.setAttribute("value", "LIB-GEN");
    btn3.setAttribute("type", "button");
    btn3.setAttribute("id", "libgen");
    btn3.setAttribute("class", "DOI-unlock-button");

//================================================== append buttons to the body and acivate them
    document.getElementsByTagName('body')[0].append(btn1,btn2,btn3);
    document.getElementById("scihub").addEventListener("click", unlockDOI, false);
    document.getElementById("zlib").addEventListener("click", unlockDOI, false);
    document.getElementById("libgen").addEventListener("click", unlockDOI, false);

//================================================== remove all inspected class and DOI attribute from buttons
    //remove all button attributes
    $('input').removeAttr('data-doi');

    //remove all highlights
    [].forEach.call(document.querySelectorAll('*'), function(a){
        a.classList.remove('DOI-unlock-inspected');
    });

//================================================== if BACK or FORWARD button has been clicked
    if(window.history && window.history.pushState) {
        window.history.pushState('forward', null, '');
        $(window).on('popstate', function(){

            //remove all button attributes
            $('input').removeAttr('data-doi');

            //remove all highlights
            [].forEach.call(document.querySelectorAll('*'), function(a){
                a.classList.remove('DOI-unlock-inspected');
            });
        });
    }

//================================================== find DOI press CTRL key and hold + click on DOI
    $(document).on('click', function(e){

        //if NOT the DOI-unlock-button has been clicked
        if(!$(e.target).hasClass('DOI-unlock-button')){

            //remove all button attributes
            $('input').removeAttr('data-doi');

            //remove all highlights
            [].forEach.call(document.querySelectorAll('*'), function(a){
                a.classList.remove('DOI-unlock-inspected');
            });
        }

        //if CTRL key has pressed
        if(e.ctrlKey){

            //prevent the default function of the cliked element
            e.preventDefault();

            //clear console
            console.clear();

            //if clicked element returned valid DOI
            if(findDOI(e.target)){

                //add DOI attribute to the buttons
                $('input.DOI-unlock-button').attr('data-doi',findDOI(e.target));

                //add highlight to the clicked element
                e.target.classList.add("DOI-unlock-inspected");
            }
        }
    });

//================================================== style the buttons
    GM_addStyle(`
        #scihub{
            left:0 !important;
        }
        #zlib{
            left:100px !important;
        }
        #libgen{
            left:200px !important;
        }
        .DOI-unlock-button{
            z-index:99999999;
            width:100px !important;
            height:30px !important;
            background:black !important;
            color:white !important;
            cursor:pointer;
            display:none !important;
            position:fixed !important;
            bottom:0 !important;
            border:none !important;
            box-shadow:0 0 0 1px white inset;
            margin:0 !important;
            padding:0 !important;
            font-size:inherit !important;
            text-align:center !important;
        }
        .DOI-unlock-inspected{
            background:yellow !important;
            color:black !important;
            font-size:130% !important;
            padding:5px !important;
        }
        *[data-doi]{
            display:block !important;
        }
    `);
});