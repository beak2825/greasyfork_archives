// ==UserScript==
// @name         Jigen's Other WaniKani Stuff
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @icon         https://i.pinimg.com/236x/5f/68/68/5f6868d18acbc1221de49387a3c07833--batman-poster-batman-batman.jpg
// @include      /^https://preview.wanikani.com/(dashboard)?$/
// @require      https://greasyfork.org/scripts/369353-jigen-s-other-stuff/code/Jigen's%20other%20stuff.js?version=604095
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    debugger;
    if($('.lessonAndReviewButtons').length == 0){
        $($('.sitemap')).before(
            `<ul class="lessonAndReviewButtons">
<li class="lessons" data-count="13">
<a href="/lesson">
<span>` + $('.lessons-and-reviews__lessons-button span').text() + `</span> Lessons
</a>          </li>
<li class="reviews" data-count="0">
<a href="/review">
<span>` + $('.lessons-and-reviews__reviews-button span').text() + `</span> Reviews
</a>          </li>
</ul>`);
        $('.lessons-and-reviews').remove();
        $('.dashboard-progress').css('grid-row','1 / 3');
        jigen.addStyle(`
.lessonAndReviewButtons {
display: flex;
    flex: 0 1 auto;
    list-style: none;
    margin: 0;
    padding: 0;
    width: auto;
}
.lessonAndReviewButtons .lessons, .lessonAndReviewButtons .reviews {
    flex: 0 1 auto;
    margin-left: 8px;
    width: auto;
}
.lessonAndReviewButtons .lessons{
margin-left: 0;
}
.lessonAndReviewButtons li {
    display: block;
    margin-left: 20px;
    width: calc(50% - 10px);
line-height: 20px;
}
.lessonAndReviewButtons li a {
align-items: center;
    background: transparent;
    border-radius: 4px;
    border: 2px solid rgba(0,0,0,0.1);
    box-sizing: border-box;
    color: #333;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    font-size: 0.875rem;
    font-weight: 300;
    justify-content: flex-start;
    line-height: 28px;
    margin: 0;
    padding: 0 14px 0 0;
    text-decoration: none;
    text-shadow: 0 1px 0 #fff;
    transition: border-color 0.2s, background 0.2s;
    font-weight: normal;
}
.lessonAndReviewButtons li a span{
background: #a0f;
    border-radius: 4px 0 0 4px;
    color: #fff;
    display: block;
    float: left;
    font-size: 0.75rem;
    font-weight: bold;
    line-height: 32px;
    margin: -2px 12px -2px -2px;
    min-width: 16px;
    padding: 0 8px;
    text-align: center;
    text-shadow: 0 -1px 0 rgba(0,0,0,0.3);
    vertical-align: middle;
    font-size: 0.75rem;
}
.lessonAndReviewButtons li[data-count="0"] span {
    background: #aaa;
}
@media (min-width: 768px){
.dashboard .progress-and-forecast .forecast {
grid-row: 1 / 3;
}}
`);
    }
})();