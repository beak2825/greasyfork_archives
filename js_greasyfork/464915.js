// ==UserScript==
// @name         bgmFeelingLucky
// @version      1.2
// @description  I'm feeling lucky for bangumi
// @author       徒手开根号二
// @include     /^https?://(bgm\.tv|chii\.in|bangumi\.tv)/*/
// @namespace   sqrtwo
// @downloadURL https://update.greasyfork.org/scripts/464915/bgmFeelingLucky.user.js
// @updateURL https://update.greasyfork.org/scripts/464915/bgmFeelingLucky.meta.js
// ==/UserScript==

// set DAILY_POPUP to false if you dont want a daily popup
const DAILY_POPUP = true;
//

const DAILY_KEY = 'BGM_LUCKY_DAILY';
const API_URL = 'aHR0cHM6Ly9lYXN0YXNpYS5henVyZS5kYXRhLm1vbmdvZGItYXBpLmNvbS9hcHAvbHVja3ljb21tZW50LXZscW9mL2VuZHBvaW50L2x1Y2t5';
const PAYLOAD = 'eyJhcGkta2V5IiA6ICJuZWRGZ0RpeHlodUQ0WGFwOEZOT0RHcWVNTTBqTW9FY3ppSnh0ZkgxdFA1RnVzdzh5c1poUTl1SlphdURFWm9jIn0=';

function fetchLuck(card){
    let url = atob(API_URL)
    $.ajax({
        timeout: 8000,
        crossDomain: true,
        dataType: 'json',
        contentType: 'application/json',
        type: 'POST',
        url: url,
        data : atob(PAYLOAD),
        success: function(resp) {
            //console.log(resp[0]);
            drawNewCard(resp[0], card);
        },
        error: function(resp) {
            console.warn("[bgm_luck] api fails");
            card.html("<h2>服务器正在ICU抢救中...</h2>")
        }
    });
}

function drawNewCard(resp, card) {
    const subject = resp.sid;
    const user = resp.uid;
    const date = resp.date;
    const stars = resp.star;
    const cmt = resp.comment;

    const uName = user;
    const uURL = "/user/" + user;
    const uAvatar = '//lain.bgm.tv/pic/user/l/icon.jpg';
    const sName = subject;
    const sURL = '/subject/' + subject;
    const sAvatar = '//lain.bgm.tv/pic/club/icon/g/no_icon.jpg';

    fillUserInfo(user, card);
    fillSubjectInfo(subject, card);
    function genStars(nStar) {
        if (nStar=="0") return '';
        return '<span class="starstop-s"><span class="starlight stars' + stars + '"></span></span>';
    }
    const subjectContent = '<div id="subject_poster" style="width: 100%;height: 45%; position: relative;">' +
          genPoster(subject, '', '', sURL) + '</div>';

    const userContent = '<div class="item clearit" style="margin:15px 20px 20px 20px;" title="developed by 徒手开根号二, copyright reserved by author.">' +
          '<div class="text_main_even"><div class="text" style="margin-bottom:2px;width:170px;white-space:nowrap;overflow:hidden;">' +
          'by <a id="user_name" href="' + uURL + '"  style="font-size:1.2em; ">' + uName + '</a>' +
          '<br/>' +
          '<small class="grey" style="font-size:1em;">' + date + '</small> ' + genStars(stars) +
          '</div></div>' +
          '<p style="font-size:1.1em; line-height: 1.4; text-align: justify;" >' + cmt + '</p>' +
          '</div>';

    const button_style = `
    position:absolute;
    cursor:pointer;
    right:0;
    margin-right:20px;
    z-index:12;`;
    const refresh_style = button_style +`
    opacity:0.6;
    bottom:48%;
    font-size:3em;
    font-weight:400;`;
    const number_style = refresh_style +`
    opacity:0.6;
    cursor:auto;
    bottom:47.3%;
    font-size:1.4em;
    font-weight:500;
    text-align: left;
    border:1px;
    margin-right:108px;`;
    const fold_style = button_style +`
    color: white;
    top:0;
    margin-top:24px;
    font-size:3em;
    font-weight:500;`;
    const like_style = button_style +`
    display:inline-block;
    opacity:0.6;
    bottom:45.9%;
    margin-right:78px;`;
    const bookmark_style = button_style +`
    opacity:0.6;
    bottom:45.8%;
    margin-right:50px;`;
    const refresh = `<p id="refresh_btn" style="${refresh_style}" title="refresh">&#8635;<\p>`;
    const fold = `<p id="fold_btn" style="${fold_style}" title="fold the card">×<\p>`;
    const like_number = `<p id="like_number" style="${number_style}" hidden>0<\p>`;
    const like_hollow = `<svg xmlns="http://www.w3.org/2000/svg" height="1.9em" viewBox="-20 -20 550 550">
    <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>`;
    const bookmark_icon = `<svg xmlns="http://www.w3.org/2000/svg" height="1.9em" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm64 192c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V256c0-17.7 14.3-32 32-32zm64-64c0-17.7 14.3-32 32-32s32 14.3 32 32V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V160zM320 288c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V320c0-17.7 14.3-32 32-32z"/></svg>`;
    const like_wrapper = `<div id="like_btn" class="night_shift_icon" style="${like_style}" title="like">${like_hollow}</div>`;
    const bookmark = `<a href="https://neutrinoliu.github.io/bgm_reviews/" target="_blank"><div id="bookmark" class="night_shift_icon" style="${bookmark_style}" title="statistics">${bookmark_icon}</div></a>`;
    card.html(subjectContent + userContent + refresh + fold + like_wrapper + bookmark + like_number);
    bindBtn(card);
    bindLike(card, resp);
}
function bindLike(card, resp) {
    const likebtn = card.find('#like_btn');
    const likenumber = card.find('#like_number');
    const url_api = `aHR0cHM6Ly9lYXN0YXNpYS5henVyZS5kYXRhLm1vbmdvZGItYXBpLmNvbS9hcHAvbHVja3ljb21tZW50LXZscW9mL2VuZHBvaW50L2xpa2VfbHVja3k=`;
    const url = atob(url_api) + `?id=${resp._id}&token=${resp.token}`;
    const payload = `eyJhcGkta2V5IjoiMVpiVW95dXk3NGtSN1NNNU9JNG1UbXVaSXFXYXJxR25IWkgxUGI1d29xZ1FxZWo4enZvb3NEMlRWS2JZQm4ydiJ9`;
    const like_beating =`<svg xmlns="http://www.w3.org/2000/svg" id=like_beating height="1.9em" viewBox="-20 -20 550 550">
    <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>`;
    const like_filled = `<svg xmlns="http://www.w3.org/2000/svg" height="1.9em" viewBox="-20 -20 550 550">
    <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>`;
    const like_hollow = `<svg xmlns="http://www.w3.org/2000/svg" height="1.9em" viewBox="-20 -20 550 550">
    <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/></svg>`;

    const clickevent = function(){
        likebtn.html(like_beating);
        likebtn.unbind();
        $.ajax({
            timeout: 8000,
            crossDomain: true,
            dataType: 'json',
            contentType: 'application/json',
            type: 'POST',
            url: url,
            data : atob(payload),
            success: function(resp) {
                console.log("[bgm_lucky] voted")
                likebtn.html(like_filled);
                const counter = resp['likes'];
                let phrase;
                if (counter==1) {
                    phrase = "沧海遗珠";
                } else if (counter<=10) {
                    phrase = "伯乐相马";
                } else {
                    phrase = "脍炙人口";
                }
                likenumber.html(counter);
                likebtn.attr('title', phrase);
                likebtn.on( "click", function(){
                    if (likenumber.is(":hidden")) {
                        likenumber.fadeIn(300);
                    } else {
                        likenumber.fadeOut(300);
                    }
                });
            },
            error: function(resp) {
                console.warn("[bgm_lucky] like api fails");
                likebtn.html(like_hollow);
                likebtn.on('click', clickevent);
            }
        });
    }
    likebtn.on('click', clickevent);
};
function bindBtn(card){
    const foldbtn = card.find('#fold_btn');
    const refreshbtn = card.find('#refresh_btn');
    const infobtn = card.find('#info_btn');
    foldbtn.on('click', function(){
        card.slideUp();
    });
    refreshbtn.on('click', function(){
        fillLoading();
        let new_card = $('#lucky_card');
        fetchLuck(new_card);
    });
}

function genPoster(name, name_cn, img_url, s_url) {
    const img_style = 'background-image: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)),' +
          'url(\'' + img_url + '\');' +
          `
  width: 100%;
  height: 100%;
  background-color: #cccccc;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position:absolute;
`;
    const title_style = `
    color: white;
    line-height: 1.3;
    font-weight: 900;
    text-align: left;
    width: 78%;
    position:absolute;
    z-index: 10;
    top: 0;
    margin: 20px 0px 20px 20px;
    cursor: pointer;
    `;
    const subname = '<div onClick="location.href=\'' + s_url +'\';" style="' + title_style + '"><p style="font-size:2em;">' + name + '</p><p style="font-size:1.2em;">' + name_cn + '</p></div>';
    return '<div style="' + img_style + '"></div>' + subname;
}

function fillUserInfo(user, card) {
    const URL = "https://api.bgm.tv/v0/users/" + user;
    $.ajax({
        timeout: 2000,
        contentType: 'application/json',
        type: 'GET',
        url: URL,
        success: function(resp) {
            card.find("#user_name").html(resp.nickname);
        },
        error: function(resp) {
            console.warn("[bgm_luck] bangumi api fails");
        }
    });
}

function fillSubjectInfo(subject, card) {
    const URL = "https://api.bgm.tv/v0/subjects/" + subject;
    $.ajax({
        timeout: 2000,
        contentType: 'application/json',
        type: 'GET',
        url: URL,
        success: function(resp) {
            //const url = JSON.stringify(resp.images.common);
            card.find("#subject_poster").html(genPoster(resp.name, resp.name_cn, resp.images.common, '/subject/' + subject));
        },
        error: function(resp) {
            console.warn("[bgm_luck] bangumi api fails");
        }
    });
}

// just copy bgm styles for our own element
// also cubic loading animation Made by Tashfeen Ahmad
(function(){
    const style = document.createElement('style');
    style.innerHTML = `

#like_beating {
  animation: heartbeat 1s linear;
}

@keyframes heartbeat
{
  0%
  {
    transform: scale( 1. );
  }
  50%
  {
    transform: scale( 1.2 );
  }
  100%
  {
    transform: scale( 1. );
  }
}

.lucky_card_class {
    overflow:hidden;
    height: 510px;
    width: 300px;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-box-shadow: inset 0 1px 1px hsla(0, 0%, 100%, 0.3), inset 0 -1px 0 hsla(0, 0%, 100%, 0.1), 0 2px 4px hsla(0, 0%, 0%, 0.2);
    -webkit-box-shadow: inset 0 1px 1px hsla(0, 0%, 100%, 0.3), inset 0 -1px 0 hsla(0, 0%, 100%, 0.1), 0 2px 4px hsla(0, 0%, 0%, 0.2);
    box-shadow: inset 0 1px 1px hsla(0, 0%, 100%, 0.3), inset 0 -1px 0 hsla(0, 0%, 100%, 0.1), 0 2px 4px hsla(0, 0%, 0%, 0.2);
    backdrop-filter: blur(20px) contrast(95%);
    -webkit-backdrop-filter: blur(20px) contrast(95%);
    border: 1px solid #EEE;
    background: rgba(254,254,254,0.3);
    position:relative;
}
html[data-theme='dark'] .lucky_card_class {
    border: 1px solid #444;
    background: rgba(50,50,50,0.8);
}
html[data-theme='dark'] .night_shift_icon svg path{
  fill: white;
}

.lucky_wrapper_class {
    position: fixed;
    bottom: 50px;
    right: 42px;
    z-index: 100;
}

.cubeloader {
  display: inline-block;
  width: 30px;
  height: 30px;
  position: relative;
  border: 4px solid #808080;
  top: 47%;
  left: 43%;
  animation: loader 2s infinite ease;
}
html[data-theme='dark'] .cubeloader {
  border: 4px solid #EEE;
}
.loader-inner {
  vertical-align: top;
  display: inline-block;
  width: 100%;
  background-color: #808080;
  animation: loader-inner 2s infinite ease-in;
}
html[data-theme='dark'] .loader-inner {
  background-color: #EEE;
}
@keyframes loader {
  0% { transform: rotate(0deg);}
  25% { transform: rotate(180deg);}
  50% { transform: rotate(180deg);}
  75% { transform: rotate(360deg);}
  100% { transform: rotate(360deg);}
}
@keyframes loader-inner {
  0% { height: 0%;}
  25% { height: 0%;}
  50% { height: 100%;}
  75% { height: 100%;}
  100% { height: 0%;}
}

.floating {
    animation-name: floating;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
}
@keyframes floating {
    0% { transform: translate(0,  0px); }
    50%  { transform: translate(0, -6px); }
    100%   { transform: translate(0, 0px); }
}

`;
    document.head.appendChild(style);
//    $('head').append(x);
})();

function fillLoading() {
    const init_inner = `<span id="loading_cube" class="cubeloader"><span class="loader-inner" ></span></span>`;
    const luckyWrapper_hidden = '<div id="lucky_wrapper" class="lucky_wrapper_class"><div id="lucky_card" class="lucky_card_class" hidden>' + init_inner + '</div></div>';
    const luckyWrapper = '<div id="lucky_wrapper" class="lucky_wrapper_class"><div id="lucky_card" class="lucky_card_class">' + init_inner + '</div></div>';

    if ($('body.bangumi').find('#lucky_wrapper').length == 0) {
        $('body.bangumi').append(luckyWrapper_hidden);
    } else {
        $('body.bangumi').find('#lucky_wrapper').replaceWith(luckyWrapper);
    }
}

// add button on to the dock
(function(){
    $('#dock').find('ul.clearit').append('<li class="last" id="lucky_btn" style="cursor: pointer; margin-left:0px;">|<b>&nbsp;&nbsp;I\'m Feeling Lucky</b></li>')
    fillLoading();
    const btn = $('#dock').find('#lucky_btn');
    const reaction = function(){
        console.log("[bgm_lucky] lucky click");
        const dailyBtn = $('body.bangumi').find('#lucky_daily');
        if (dailyBtn.html()) {
            localStorage.setItem(DAILY_KEY, getDate());
            dailyBtn.hide();
        }
        let card = $('#lucky_card');
        if (card.is(':hidden')) {
            if (card.find('#loading_cube').html()) {
                fetchLuck(card);
            }
            card.slideDown();
        } else {
            card.slideUp();
        }
    };
    btn.on('click', reaction);
})();

function getDate() {
    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    return d.getFullYear() + '-' + month + '-' + day;
}

// drow daily
function drowDaily(){
    if ($('body.bangumi').find('#lucky_daily').html()) {
        return;
    }
    const dailyInner = `<h2 style="text-align:center; font-size:2em; margin-top:35%;">🎏</h2>`;
    const dailyWrapper = `<div class="lucky_wrapper_class floating">
                           <div id="lucky_daily" class="lucky_card_class"
                             style="height:50px; width:50px; cursor:pointer;">
                               ${dailyInner}
                           </div></div>`;
    $('body.bangumi').append(dailyWrapper);
    const dailyBtn = $('#lucky_daily');
    dailyBtn.on('click', function (){
        localStorage.setItem(DAILY_KEY, getDate());
        dailyBtn.hide();
        let card = $('#lucky_card');
        if (card.is(':hidden')) {
            if (card.find('#loading_cube').html()) {
                fetchLuck(card);
            }
            card.slideDown();
        }
    });
}

if (DAILY_POPUP) {
    const last_date = localStorage.getItem(DAILY_KEY);
    if (!last_date) {
        drowDaily();
    } else {
        const today = getDate();
        if (today != last_date) {
            drowDaily();
        }
    }
}