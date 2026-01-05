// ==UserScript==
// @name         MAM reskin test
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  reskin
// @author       xShirase
// @match        https://www.myanonamouse.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26090/MAM%20reskin%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/26090/MAM%20reskin%20test.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var overRideCSS =`

.blockFoot{
    display:none;
}
.mainRight .blockBody{
    border-width: 1px 1px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}
.bHi{
    display:none;
}
h1.torFormButton,.torSearchNav{
    border:none;
    background:none;font-size: 14px;
}
.mainRight > .blockCon > .blockHead {
    display: none;
}
.mainRight > .blockCon > .blockBody {
    border:none;
}

.mainRight > div.blockCon {
   margin-top:0px;
   margin-left: 0px;
   margin-right: 0px;
}

#mainBody > div.blockCon{
    margin-left: 0px;
    margin-right: 0px;
}

.toggleBody{
    cursor:pointer;
}
.bHis{display:none;}

div.blockHeadCon a{display:inline;}

#mainLeft .blockFoot{display:none;}

#mainLeft div.blockHead {
    background-image:none;
    border-width: 0;
    background-color:inherit;
}

#mainLeft .lbc{margin:0px 10px;}

#mainLeft{padding-top: 20px;}

#mainLeft .blockBody{
    border:none;
    margin-bottom:20px;
}

#statsBlock a.cen{display:none;}

#statsBlock{padding-left: 10px;}

.topMess {
    background-color: inherit;
    color: red !important;
    padding: 10px;
    font-weight: bold;
    margin: 5px;
    display: block;
}
#mainBody > div.blockCon > div {
    border: none;
    margin-left: 0px;
    margin-right: 5px;
}

div#searchWidget{
    border-bottom-left-radius: 5px;
    border: 1px solid;
    border-bottom-right-radius: 5px;
    position: absolute;
    width: 950px;
    display: block;
    z-index: 1000;
    max-height:600px;
    overflow-y:auto;
    background: inherit;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
}

span.widgetCol1 {
    width: 300px;
    display: inline-block;
    height: 1em;
    /* overflow-x: hidden; */
    overflow: hidden;
    text-align: right;
}
span.widgetCol2 {
    width: 300px;
    display: inline-block;
    height: 1em;
    /* overflow-x: hidden; */
    overflow: hidden;
    text-align: left;
}
span.widgetCol3 {
    width: 300px;
    display: inline-block;
    height: 1em;
    /* overflow-x: hidden; */
    overflow: hidden;
    text-align: left;
}
span.widgetCol3 a::after {
    content: " file(s) ";
}
span.widgetCol3 a {
    margin-right: 5px;
}
span#widgetToggle{
    cursor:pointer;
}
#widgetQuery{
    padding: 5px 0;
    text-align: center;
}
#popSearchSub{
    margin-left: 5px;
    border: 1px solid #d0d0d0;
    background-color: white;
    padding: 0 4px;
    cursor: pointer;
}
`;

const overridesShoutBox = `
#mainBody > div.blockCon div{
    border:none;
}
#mainBody div.blockCon{
    margin-top: 20px;
}
`;
const overridesHomepage = `
#mainBody > div.blockCon > div {
    border: none;
    margin-left: 0px;
    margin-right: 5px;
}
`;
const overridesBrowse = `
.catNavBox .torCatSelected, .catNavBox .searchInSel {
    background-image: none;
}
.catNavBox .searchIn, .catNavBox .torCatSel, .catNavBox .torMainCatSel {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    background-image: none;
    background-repeat: no-repeat;
    background-position: right top;
}
.torCatSel {
    height: 20px;
    display: inline-block;
    margin: 0px 3px;
}
.torMainCatSel{
    float: none;
}

.searchFormToggle {

}
h1#catNav{
    display: block;
}

#mainBody .blockCon:last-child{
    margin-top:0px;
}

#searchResults h1{
    display:none;
}

#mainBody > div.blockCon {
    display:block;
    margin-left:0px;
    margin-top:0px;
    margin-right:0px;
}

#mainBody > div.blockCon > div {
    border: none;
    margin-left:0px;
    margin-right:5px;
}
.mainRight > div.blockCon > div.blockBody > div.blockCon{
    margin-left:0px;
    margin-top:0px;
    margin-right:0px;
}
.mainRight > div.blockCon > div.blockBody > div.blockCon > div {
    border: none;
}
#filtersTable{
    display:none;
}
#filterSpan{
    cursor:pointer;
}
#filterSpan:hover{
    text-decoration:underline;
}
.torSearchNavBox {
    display: inline-block;
}
h1.customBtn {
    display: block;
    margin: 0 0;
    padding: 0px;
    text-align: left;
    font-size: 12px;
    font-family: Verdana,Helvetica,sans-serif;
    font-weight: normal;
    line-height: 100%;
}
h1.customBtn:active{
    border-style:none;
}
h1.customBtn:hover{
    text-decoration:underline;
}
.customDivs{
    display:block;
}
div#newbar h1 {
    font-weight:bold;
    margin: 0 0;
    padding: 0px;
    text-align: left;
    font-size: 12px;
    font-family: Verdana,Helvetica,sans-serif;
    font-weight: normal;
    line-height: 100%;
}
`;

const overridesRules =`
.mainRight div.blockCon{
    margin-top: 20px;
}
`;

const overridesForumsMain =`
.mainRight .blockHead {
    display: none;
}
td.colhead {
    line-height: 1.5em;
}
.mainRight .blockBodyCon{
    padding-left:0px !important;
}
#mainBody div.blockCon{
    margin-top: 0px;
}
.mainRight .blockBody{
    border:none;
}
`;
    function addStyleTest(tag,str){
        $(tag).text($(tag).text()+str);
    }
    $('head').append('<style id="customStyleTest"></style>');
    $('head').append('<style id="customStylePageSpecific"></style>');
    addStyleTest('#customStyleTest',overRideCSS);

    let blocks = $('#mainLeft .lbc');
    let headers = blocks.map((i,e)=>$($(e).find('.blockHeadCon')[0]).text());
    function topClickHandler(e){
        let dId = $(e.target).data('id');
        $($(blocks[parseInt(dId,10)]).find('.blockBody')[0]).toggle();
    }

    function makeSearchResults(res){
        console.log(res.length);
        res.each((i,e)=>{
            const title = $(e).find('a.title')[0] || '';
            const author = $(e).find('a.author')[0] || '';
            const size = $(e).find('td')[4].outerHTML || '';
            console.log(title);
            $('#searchWidgetResults').append(`<div><span class="widgetCol1">${title.outerHTML}</span> - <span class="widgetCol2">${author!==''?author.outerHTML:''}</span><span class="widgetCol3">${size.replace('<br>','')}</span>`);
        });
        //console.log(links);
    }

    function searchWidgetHandler(e){
        $('#searchWidgetResults').html('');
        $.ajax({
            type: 'post',
            url: "/tor/js/loadSearch2.php",
            data: `tor%5Btext%5D=${$('#popSearch').val()}&tor%5BstartNumber%5D=0`,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: function(c) {
                var results =$(c).find('tr[id]');
                makeSearchResults(results);
            },
            timeout: 60000,
            error: function(d, b, c) {
                $('#searchWidgetResults').append("Error", "Error occured: " + c);
            },
            dataType: "html"
        });
    }
    blocks.each((i,e)=>{
        $($(e).find('.blockHeadCon')[0]).prepend(`<span class="toggleBody" data-id=${i}>  [+]</span>`);
        if(i>0){
            $($(e).find('.blockBody')[0]).hide();
        }
    });
    $('body').on('click','.toggleBody',topClickHandler);

    var pms = $('.topMess').detach();
    $('#mainLeft').append(pms);
    $('#pmMess').html('<span id="hiddenPMcount"></span> new PM');
    $('#topicWatch').html('<span id="hiddenTopicCount"></span> forum messages');
    $('#hrlinks span').prepend('<a href="/shoutbox/">Shoutbox | </a>');

    // search miniwidget
    $('#hrlinks').append('| <span id="widgetToggle"> [+]</span>');
    $('<div id="searchWidget"><div id="widgetQuery"><input id="popSearch"></input><span id="popSearchSub"> Search</span></div><div id="searchWidgetResults"></div></div>').insertAfter('#hrlinks');
    $('#searchWidget').hide();
    $('body').on('click','#widgetToggle',e=>$('#searchWidget').toggle());
    $('body').on('click','#popSearchSub',searchWidgetHandler);

    //page-specific overrides
    if(window.location.pathname==='/index.php'){
        addStyleTest('#customStylePageSpecific',overridesHomepage);
    }
    if(window.location.pathname.includes('shoutbox')){
        console.log('shoutbox');
        addStyleTest('#customStylePageSpecific',overridesShoutBox);
    }
    if(window.location.pathname.includes('browse.php')){
        console.log(window.location);
        addStyleTest('#customStylePageSpecific',overridesBrowse);
        $('#mainBody > h3').remove();
        $('#mainBody > a').remove();
        if(!window.location.search.includes('browseStart')){
            console.log('search');
            $('.catNavBox:not(.hideMe)').remove();
            $('.advNavBox:not(.hideMe)').remove();
            const btns = $('#mainBody > .blockCon > .blockBody > h1:not(#catNav)').detach();
            $('#mainBody').append('<div id="newbar"></div>');
            $('#newbar').append(btns);
            const tbl = $('.searchFormToggle > table').detach();
            $('form.searchFormToggle').append('<div id="searchFilters"><span id="filterSpan">[+] Search Filters</span><div id="filtersTable"></div></div>');
            $('#filtersTable').append(tbl);
            $('form.searchFormToggle').append('<div class="customDivs" id="categories"><div id="catBtn"></div></div><div class="customDivs" id="advanced"><div id="advBtn"></div></div><div class="customDivs" id="subsets"><span>Subsets:&nbsp;</span></div>');
            const selects = $('#mainBody > .blockCon > .blockBody > select').detach();
            $('#subsets').append(selects[0]).append('<span>&nbsp;in&nbsp;</span>').append(selects[1]);
            $('#mainBody > .blockCon > .blockBody > br').remove();
            $('#mainBody > .blockCon > .blockBody > label').remove();
            $('#mainBody > .blockCon > .blockBody').contents().filter((i,e)=>e.nodeType === 3).remove();
            $('#catNav').text('[+] Categories').addClass('customBtn');
            const catBtn = $('#catNav').detach();
            const catDiv = $('.catNavBox').detach();
            $('#catBtn').append(catBtn);
            $('#categories').append(catDiv);
            $('#advNav').text('[+] Advanced').addClass('customBtn');
            const advBtn = $('#advNav').detach();
            const advDiv = $('.advNavBox').detach();
            $('#advBtn').append(advBtn);
            $('#advanced').append(advDiv);
            setTimeout(()=>window.scrollTo(0,0),1000);
        }
    }
    if(window.location.pathname.includes('rules.php')){
        console.log('rules');
        addStyleTest('#customStylePageSpecific',overridesRules);
    }
    if(window.location.pathname.includes('forums.php')){
        console.log('forums');
        if(!window.location.search.includes('editpost')){
            addStyleTest('#customStylePageSpecific',overridesForumsMain);
            $('.mainRight .blockBodyCon > br').remove();
        }
    }
    $('body').on('click','#filterSpan',e=>$('#filtersTable').toggle());
    $('#deluminate_fullscreen_workaround').css('height',$(window).height());
})();

