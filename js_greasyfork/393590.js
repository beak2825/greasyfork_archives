// ==UserScript==
// @name         PlayerFilter
// @namespace    Heasleys.PlayerFilter
// @version      2.0
// @description  Filter players from advanced user search
// @author       Heasleys4hemp [1468764]
// @include     *.torn.com/userlist.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/393590/PlayerFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/393590/PlayerFilter.meta.js
// ==/UserScript==

GM_addStyle(`
.wb_container {
  display: flex;
  flex-direction: column;
}
.wb_title {
  border: 1px solid rgba(0, 0, 0, .5);
  border-bottom: none;
  border-radius: 5px 5px 0px 0px;
  color: #ffffff;
  font-size: 13px;
  letter-spacing: 1px;
  text-shadow: rgba(0, 0, 0, 0.65) 1px 1px 2px;
  font-weight: 400;
  padding-left: 10px;
  margin-top: 10px;
  background-color: rgb(202, 185, 0);
  background-image: linear-gradient(90deg, transparent 50%, rgba(0, 0, 0, 0.07) 0px);
  background-size: 4px;
  height: 30px;
  line-height: 30px;
}
.wb_content {
  background-color: #F2F2F2;
  border: 1px solid rgba(0, 0, 0, .5);
  border-top: none;
}
.wb_row {
  display: flex;
  margin: 0.75em;
}
.wb_col {
  margin-left: 20px;
}
.wb_col > p {
  font-weight: bold;
  font-size: 16px;
  border-bottom: 1px solid #363636;
  margin-bottom: 3px;
}
.wb_col input {
  vertical-align: middle;
}
.checkboxes span {
  vertical-align: middle;
}
.wb_col ul>li {
  display: block;
  padding-right: 10px;
  padding-left: 22px;
  text-indent: -22px;
  padding-bottom: 3px;
}
`);

$(window).load(function () {


    document.querySelector('.content-wrapper').insertAdjacentHTML('afterbegin', `
    <div class="wb_container">
      <div class="wb_title">Filter Toggles</div>
       <div class="wb_content">
        <div class="wb_row">
          <div class="wb_col">
            <p>Hide</p>
            <ul class="filter">
                <li>
                    <input type="checkbox" value="#icon9" /><span> In a Faction</span></li>
                <li>
                    <input type="checkbox" value="#icon74" /><span> Faction Leader</span></li>
                <li>
                    <input type="checkbox" value="#icon70" checked/><span> Federal Jail</span></li>
                <li>
                    <input type="checkbox" value="#icon72" /><span> New Leaf</span></li>
                <li>
                    <input type="checkbox" value="#icon27" /><span> In a Company</span></li>
                <li>
                    <input type="checkbox" value="#icon73" /><span> Company Director</span></li>
            </ul>
          </div>
          <div class="wb_col">
          <p>Has</p>
            <ul class="have">
                <li>
                    <input type="checkbox" value="li#icon3" checked/><span>Donator</span></li>
                <li>
                    <input type="checkbox" value="li#icon4" checked/><span>Subscriber</span></li>
                <li>
                    <input type="checkbox" value="li#icon70"/><span>Federal Jail</span></li>
                <li>
                    <input type="checkbox" value="li#icon77"/><span>Resting in Peace</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <hr class="delimiter-999 m-top10">
    `);


//icon3 = donator
//icon4 = subscriber
//icon6 = male
//icon7 = female
//icon8 = married
//icon9 = faction
//icon15 = hospital
//icon16 = jail
//icon27 = company
//icon70 = federal
//icon71 = traveling
//icon72 = new leaf
//icon73 =company director
//icon74 = faction leader



function filter() {

    var arrList = [];
    $('ul.filter > li > input[type=checkbox]').each(function () {
        if($(this).is(":checked")){
                var checkval = $(this).val();
                arrList.push(checkval);
            }
    });

    var haveList = [];
    $('ul.have > li > input[type=checkbox]').each(function () {
        if($(this).is(":checked")){
                var checkval = $(this).val();
                haveList.push(checkval);
            }
    });

    var haveListvar = "";
    if (haveList.length < 1) {
        haveListvar = "li";
    } else {
    haveList.forEach(element => haveListvar += element + ",");
    }


    //select all icons under icons-wrap > ul#iconTray
    const all = $("span.icons-wrap > ul#iconTray > li");

    //hide all user lists
    all.parent().parent().parent().parent().parent().hide();
    all.css({"border": "none"}); //remove all borders

    if (haveListvar != "li") {
      $("span.icons-wrap.icons").find(haveListvar).css({"border": "2px solid red"}); //this is for putting a red border around icons
    }
    //find and then select all icons in have list and unhide/show the user list (since they were hidden)
    $("span.icons-wrap.icons").find(haveListvar).parent().parent().parent().parent().parent().show();

    var i=0;
    for (; i<arrList.length; i++) {

    const hider = $("ul#iconTray > li"+arrList[i]+""); //select all li child elements of ul#iconTray if they contain Id

    //hide the parent>parent>parent>parent>parent element, which is the whole user info element
    hider.parent().parent().parent().parent().parent().hide();



    } //end of for loop
};//filter

const observer = new MutationObserver(() => {
    filter();
});

//set observer to monitor changes in .userlist-wrapper div on page
const wrapper = document.querySelector('.userlist-wrapper'); //select the element called .userlist-wrapper
observer.observe(wrapper, { subtree: true, childList: true }); //observe changes in .userlist-wrapper

$('input[type=checkbox]').change(function(){
          filter();
});

filter();






});//window.load