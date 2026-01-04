// ==UserScript==
// @name            Dark Theme for RSLOAD.NET
// @name:en         Dark Theme for RSLOAD.NET
// @name:ru         Тёмная тема для RSLOAD.NET
// @namespace     RSLOAD
// @match         *://rsload.net/*
// @grant         GM_getValue
// @grant         GM_setValue
// @version         0.1
// @author          Pr0m
// @license MIT
// @description  Changes the style of the site to dark, makes navigation as convenient as possible.
// @description:en  Changes the style of the site to dark, makes navigation as convenient as possible.
// @description:ru  Изменяет стиль сайта на темный, делает навигацию максимально удобной.
// @downloadURL https://update.greasyfork.org/scripts/451005/Dark%20Theme%20for%20RSLOADNET.user.js
// @updateURL https://update.greasyfork.org/scripts/451005/Dark%20Theme%20for%20RSLOADNET.meta.js
// ==/UserScript==

if( !GM_getValue('Theme'))  GM_setValue("Theme", "White");

(() => {
 
var black = (`

#text {
    display: inline-block;
    position: relative;
    color:gray;
    filter: invert(0.4);
}
#text:before {
    width: 24px;
    height: 24px;
    position: absolute;
    top: -5px;
    left: 80%;
    background: var(--crown-img);
    background-size: 100%;
    content: "";
    transform: rotate(25deg);
}
.lc-popup {
    background-color: hsl(0deg 0% 0% / 60%);
    backdrop-filter: blur(8px);
    border-radius: 5px;
}
.lb-user {
    background-color: hsl(0deg 0% 0% / 22%);
    border-radius: 5px;
}
.lb-menu {
    margin-top: 20px;
}
.lb-menu a {
    display: block;
    line-height: 30px;
    padding: 0 10px;
    background-color: transparent;
    color: aliceblue;
    border-bottom: 0px solid #6283a2;
}
.lb-menu > a {
    border-radius: 8px;
}
.lb-menu a:hover,
.lb-menu a:hover .fa {
    background-color: hsl(0deg 0% 0% / 82%);
    color: #9a9a9a;
}
.lb-menu a .fa {
    color: #000;
}
.full-text a {
    color: #aaa;
}
.bb-pane {
    background: transparent;
}
.bb-pane>b {
    color: white;
    background: transparent;
}
textarea {
    background: transparent;
    color: white;
}
.bb-btn:hover {
    background: #c9a8a861;
    color: white;
}
.wrap > header + div {
    color: white;
    background: #09161c;
}
.search-inner > input {
    background: #222d33;
    color: white;
}
.search-inner > button > span {
    color: white;
}
.footer {
    background: #222d33;
    box-shadow: inset 0 20px 20px -20px rgb(255 255 255 / 80%);
    border-bottom: 2px solid #09161c;
}
.header {
    background: #09161c;
}
.wrap {
    background: #09161c;
}
.speedbar span > a > span {
    color: white;
    background-color: #09161CCC;
    /*display: flex;*/
}
.full-text {
    background-color: #061014;
}
.short-bottom {
    line-height: 40px;
    padding: 10px 20px;
    border-top: 1px solid #5c5b5b;
    background: #061014!important;
}
.icon-l span.fa {
    margin-right: 10px;
    color: gray;
}
.icon-l span.fa > a {
    margin-right: 10px;
    color: gray;
}
.decor,
.side-box,
.short,
.pm-page,
.search-page,
.static-page,
.tags-page,
.form-wrap {
    background: transparent;
}
.short-top {
    background: linear-gradient(to bottom, #152d44 0%, #0e0b2e 100%);
}
.pagi-nav {
    background: #09161c;
}
.full-text {
    background: rgb(12, 23, 34);
}
.short-bottom {
    line-height: 40px;
    padding: 10px 20px;
    border-top: 1px solid #363636;
    background: rgb(12, 23, 34);
}
.side-bc {
    background-color: hsl(0deg 0% 0% / 22%);
}
.header:before,
.side-bt,
.short-top,
.comm-one {
    background-color: #000;
    background: linear-gradient(to bottom, #222d33 20%, #000 90%);
    color: #FFF;
    border-radius: 4px;
}

.header-line.clearfix {
    background: #09161c;
    padding: 10px;
}
.berrors {
    background: #44444444;
    color: #fff;
    margin: 0 0 20px 0;
    padding: 10px 20px;
}
.sres-wrap {
    background-color: #44444444;
    display: block;
    padding: 15px 15px 15px 230px;
    border: 1px solid #e3e3e3;
    position: relative;
}
.sres-text {
    float: right;
    width: 100%;
    color: white;
}
.user-prof {
    border: 1px solid #ddd;
    background-color: #fff;
    margin-bottom: 20px;
    color: black;
}
tr {
    background: wheat;
}
.pm tr td,
.userstop tr td {
    color: gray;
}
.pm tr:nth-child(1) {
    background-color: transparent;
    color: #FFF;
}
.side-bc > ul > li a {
    color: white;
}
.lc-body {
    color: white;
}
.title_quote {
    background: transparent;
}
.lc-text a {
    color: white;
}
.side-top a:hover,
.lforum a:hover,
.speedbar a:hover {
    background-color: #4e5e6e4e;
}
.lcomm:hover {
    background-color: #4e5e6e4e;
}
.comm-three ul li a,
a {
    color: darkgray;
    text-decoration: none;
}
.lc-text a {
    color: black;
}
.comments-tree-list > .comments-tree-item > .comments-tree-list {
    background-color: #66778859;
}
.quote {
    color: white;
    background-color: transparent;
}
.comm-two{
background-color: transparent;
}
.comm-left div:nth-child(2) span{
    backdrop-filter: saturate(0.5);
    box-shadow: inset 20px 20px 20px -5px #dddddd7d;
    border-collapse: collapse;
    border-radius: 3px;
    padding: 2px;
}

form .flex-row{
    padding-bottom: 10px;
}
.scriptcode, .title_spoiler, .text_spoiler{
background: transparent;
}

`);

addStyle(`
:root {
    --sun-img: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAYdJREFUSEvN1j1PFFEUxvHfNhCoqPgC1EQTXjoSKKgwoJUtxoYOGigJkNhIo59AWwoIGAsTC02wQkk01HwBKyqMNpJj7iSzu3N3Zg1LuM3szJ57/vc5955npqW/cZbCZ5tOazUNTHF/07XxvMaBtwVYxQqe4apCXa8SjeENTvC2mNup4DgBvmMhA6mqaiT/hIcJ8DgHiMDPeIDX2Gi4R6+wjh+YLy+sag8CEhJ3EEpibOIpJtP9BQ6wn+5j5REfJW4rbd0mT6REUxkl5wl8mVNaB/iGSB6J9vAxJVrEdum/6f8BRFlepuRz+NWRZASnCbJVKldbWC8Fxerj2L7LrHA5nZpQWKkiAHG2Z1KCryhs4DeGMFqx+oIXKq7xB8PpYVu+OwHk9ufWSpQDDHyTAzzQYxqAgTRa4Yq7fVjFEp5jDT/LNe/sg7Ir9mN2R3iCOOaPypCcXXe5Yo2rjuN96qcviM7/NzoB4Ybh5V2uWGqi+Fn1Tg7IIT7gRQ5QZ//3/51cp6Dvz5YbBnJjrUwOzUMAAAAASUVORK5CYII=) no-repeat transparent top center;
    --month-img: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAZpJREFUSEu1leExBUEQhL8XASJABIgAESADIiADRIAIyAARIAJkQASIgPrUzNVad1d71Ns/d+/V7nRPd+/cjDmv2Zzr0wKwBewAPleAVeC9ldgYwDpwBywWxT4C5N8A+8BlFH4OkGXgFDhpZe++vg7OgcMokgU/gcns+wCU5TGK7wE38S7AQ/gwpYFfHdwDm5UUevAG3AK7k6pXEqXur4CdlEb6LogJmrRKDzTveMBIpTKq24BdNq8SIOXpK5LdPQXIn2Lq4bWQ4aWHYhLwaQCGQLyMru8aZQceWBgB8KAk3ONhQfydyzAY76P4Y6kGSJ3LeNaNCHIVSUuW2a2jJJeX06D86GDM5BpIT4ysRe3I5UVUBW/8RXZSSuRmZ4+MNiYMNJmmVOljF5R6VKSRHYPmPEKOGDvpBmQNUBp5EHq3YCjXdWy0+878vmFnCs5is6wceEORzOTkhP1Fauh7IIiHMpImR1amw6WReqbZmfteWcc+OHUkh6RyykqovBPd3tZPpmxNi0/lMmkGwqI50nsJtAC0mDy4Z+4AX8YAXBnllTnWAAAAAElFTkSuQmCC) no-repeat transparent;
    --crown-img: url(data:image/png;base64,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) no-repeat transparent;
}
div.header-in.center {
    position: static;
}
.hidden-menu {
    background-color: hsl(0deg 0% 0% / 60%);
    border-radius: 0 0 10px 10px;
    backdrop-filter: blur(8px);
}
.clearfix > li:hover > ul {
    display: block;
}
.side-bc {
    padding: 20px 20px 0px 20px;
    border-radius: 0px 0px 5px 5px;
}
.css-kx {
    display: block;
    position: absolute;
    margin-top: -5px;
    margin-left: 190px;
}
.themex {
    cursor: pointer;
    width: 24px;
    height: 24px;
    color: transparent;
    filter: invert(100%);
}
.icox {
    background: var(--sun-img);
  /*  background-size: 92%;*/
}
.icox:hover {    
    filter: drop-shadow(0 0 15px rgba(25,25,25,0.99)) invert(1);
}
article div > img {
    border-radius: 8px;
}
#dle-content .short div > img {
    border-radius: 8px;
}
header:before {
    background: linear-gradient(to bottom, #2a5885 0%, #ffffff 107px);
}
.header-line {
    background: transparent;
    padding: 10px;
}
.header-menu.icon-l.clearfix {
    background: #222d33;
    padding: 0px;
    border-radius: 5px;
    box-shadow: inset 10px 20px 20px -15px rgb(255 255 255 / 20%);
}
.header:before,
.side-bt,
.short-top,
.comm-one {
    border-radius: 4px;
}


`);
  
    theme = GM_getValue('Theme');

  
 $('.header-in ul li ul').each(function () {
  $(this).parent().attr('class', 'submenu')
});
  
 $("div.short-bottom-right > div:nth-child(4) > a").each((a, b) => {
    $(b).attr('id', 'text');
});

$('header').removeAttr('class');

$('.login-box > div').append($('.login-box > ul'));
$('.ac-av.img-box').append($('.lb-ava.img-box').clone()); //avatar copy - comment
$('aside > div:nth-child(1) > div:nth-child(1)').prepend(`
<div class="css-kx">
<input class="themex icox"> 
</div>
`);

 
if (theme == "White") {
    $('.icox').attr({'style': 'background: var(--month-img);', 'title': 'Тёмный режим | Dark mode'});
    $('header').attr('style', 'background: linear-gradient(to bottom, #2a5885 0%,#ffffff 107px);');
    addStyle(black);
    $('style').last().remove();
  
} else if (theme == "Black") {

    $('.icox').attr({'style': 'background: var(--sun-img);', 'title': 'Светлый режим | White mode'});
    addStyle(black);
    $('html').removeAttr('style');
}


$('.icox').click(() => {
theme = GM_getValue('Theme');
    if (theme == "Black") {

        $('.icox').attr({'style': 'background: var(--month-img);', 'title': 'Тёмный режим | Dark mode'});
        $('header').attr('style', 'background: linear-gradient(to bottom, #2a5885 0%,#ffffff 107px);');

        $('style').last().remove();
        GM_setValue('Theme', 'White');
      
    } else if (theme == "White") {

        addStyle(black);
        $('.icox').attr({'style': 'background: var(--sun-img);', 'title': 'Светлый режим | White mode'});
        $('header').removeAttr('style');
        
        GM_setValue('Theme', 'Black');
    }
});


 msgCheck = setInterval(() => { //blink if have message
    var inf = `#login-box > div  li:nth-child(2) > a`;
    if (!$(inf).text().match('\(0\)'))
        $(inf).css('color', $(inf).css('color') == 'rgb(255, 255, 255)' ? 'chocolate' : 'white');
    else clearInterval(msgCheck);
    $(inf).on('mouseover', () => clearInterval(msgCheck));
}, 1e3);
  
  function addStyle (a) {
  const b = document.createElement('style'); 
  b.type = 'text/css'; 
  b.textContent = a;
  document.documentElement.appendChild(b);  
  return b;
  }
  
})();
