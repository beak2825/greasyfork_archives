// ==UserScript==
// @name         Typeracer: Awards Organizer
// @namespace    http://tampermonkey.net/
// @version      1.4.2
// @description  Data.TypeRacer profiles: regroup Awards
// @author       poem
// @match        https://data.typeracer.com/pit/profile*
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @run-at document-finish
// @downloadURL https://update.greasyfork.org/scripts/403943/Typeracer%3A%20Awards%20Organizer.user.js
// @updateURL https://update.greasyfork.org/scripts/403943/Typeracer%3A%20Awards%20Organizer.meta.js
// ==/UserScript==

/*Changelog:
==========================================================================================
1.3   (03-08-20):   initial release
1.4.1 (04-08-20):   added awards sub-totals for daily/weekly/monthly/yearly categories
1.4.2 (04-08-20):   added margins to the menus
                    fixed opening multiple menus at once
                    changed script name to "Typeracer Awards Organizer"
==========================================================================================*/


'use strict';

function kRows(k)
{
    let ans='';
    for(var l=0;l<k;l++)
    {
        ans+='1fr ';
    }
    return ans.slice(0,-1);
}

/*function logMenuData(menu)
{
    console.log("_expanded:"+menu._expanded+"\n_animate:"+menu._animate+"\n_duration:"+menu._duration+"\n_frameTime:"+menu._frameTime+"\n_nFrames:"+menu._nFrames+"\n_collapsed.x:"+menu._collapsed.x+"\n_collapsed.y:"+menu._collapsed.y);
}*/

const BACKGROUND=``;
GM_addStyle (
//     Medal icons container
    `.section {
position: relative;
padding: 0px 0px 32px 0px;
}`+
//     Medal menu classes
    `.menu {
width: max-content;
position: absolute;
contain: content;
transform-origin: top left;
border-radius: 5px;
background: none;
will-change: transform;
animation-duration: 200ms;
animation-timing-function: step-end;
}
.menu__contents {
transform-origin: top left;
will-change: transform;
contain: content;
animation-duration: 200ms;
animation-timing-function: step-end;
}
.menu__toggle {
text-align: left;
padding: 0;
margin: 0;
border: none;
background: none;
cursor: pointer;
width: 100%;
}
.menu__toggle:focus {
outline: none;
}
.menu__title {
position: relative;
padding: 3px;
margin: 0;
display: inline-block;
}
.menu__title .badge {
background: #C80000;
color: white;
position: absolute;
top: 2px;
right: 2px;
padding: 2px 4px;
border-radius: 50%;
font-size: 8pt;
font-weight: bold;
}
.menu__title:hover .badge {
filter: brightness(75%);
}
.menu__items {
position: relative;
list-style: none;
padding: 0;
margin: 0;
background: none;
z-index: 1;
}
.menu__items .medal__grid {
display: grid;
grid-template-columns: none;
grid-gap: 5px;
}
.menu__items .span__title {
font-size: 12pt;
color: #60AFFE;
margin: 5px;
}
.menu--active {
opacity: 1;
pointer-events: auto;
}
.menu--expanded{
z-index: 1;
animation-name: menuExpandAnimation;
}
.menu__contents--expanded {
animation-name: menuExpandContentsAnimation;
}
.menu--collapsed {
border: none;
animation-name: menuCollapseAnimation;
}
.menu__contents--collapsed {
animation-name: menuCollapseContentsAnimation;
}`);


const material = ["gold", "silver", "bronze"];
var medal_count = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
var expanded_medal_html = [['','','',''],['','','',''],['','','','']];
var badge=[{},{},{}];
var draw_icon=[true,true,true];
var icon_x=[0,0,0];
var timespans=['Yearly awards','Monthly awards','Weekly awards','Daily awards'];

function spanToIndex(timespan)
{
    switch(timespan)
    {
        case 'daily':
            return 3;
            break;
        case 'weekly':
            return 2;
            break;
        case 'monthly':
            return 1;
            break;
        case 'yearly':
            return 0;
            break;
    }
}

//Check for the existence of an "Awards" section
var last_section_title = (($('.personalInfoTable > tbody > tr:last-child > td') || [])[0] || {}).innerText || '';
if(last_section_title!="Awards")
    return;

//Select said section; count medals; split medals list


var awards_section = $('.personalInfoTable > tbody > tr:last-child > td:nth-child(2)')[0];
var medals = awards_section.children;
for(let i=0;i<medals.length;i++){
    var index=/(.).*in our (.*) competition.*/.exec(medals[i].children[0].title);
    var award_rank=index[1]-1;
    var award_type=spanToIndex(index[2]);
    medal_count[award_rank][0]++;
    medal_count[award_rank][award_type+1]++;
    expanded_medal_html[award_rank][award_type]+=medals[i].outerHTML;
}
$('.personalInfoTable > tbody > tr:last-child > td')[0].innerText='Awards ('+(medal_count[0][0]+medal_count[1][0]+medal_count[2][0])+')';

//Determine which of the 3 medal types exist, and the lateral position of their icons
var shift=0;
for(let i=0;i<3;i++)
{
    icon_x[i]=shift;
    if(medal_count[i][0]==0)
        draw_icon[i]=false;
    else
        shift+=48;
}

//Building the medal menus in HTML
var medalMenusHTML='';
for(let n=0;n<3;n++)
{
    if(!draw_icon[n])
        continue;
    let medal_grids_html='';
    for(let m=0;m<4;m++)
    {
        let n_m_count=medal_count[n][m+1]
        if(n_m_count>0)
        {
            medal_grids_html+=`<h1 class="span__title">`+timespans[m]+` (`+n_m_count+`)</h1>
<span class="medal__grid" id="medal_grid_`+n+`_`+m+`">`+expanded_medal_html[n][m]+`</span>`
        }
    }
    medalMenusHTML+=`<span class="menu js-menu_`+n+`">
 <div class="menu__contents js-menu-contents_`+n+`">
  <button class="menu__toggle js-menu-toggle_`+n+`">
   <span class="menu__title js-menu-title_`+n+`">
    <img border="0" src="/public/images/medals/32px/`+(n+1)+`.cache.png" title="`+medal_count[n][0]+` total `+material[n]+` medals">
    <span class="badge" id="badge_`+n+`">`+medal_count[n][0]+`</span>
   </span>
  </button>
  <span class="menu__items">`+medal_grids_html+`</span>
 </div>
</span>`
}
awards_section.classList.add("section");
awards_section.innerHTML=medalMenusHTML;

//Animated menu class; credits: https://developers.google.com/web/updates/2017/03/performant-expand-and-collapse
class Menu {
  constructor (n_) {
    this._menu = document.querySelector('.js-menu_'+n_);
    this._menuContents = this._menu.querySelector('.js-menu-contents_'+n_);
    this._menuToggleButton = this._menu.querySelector('.js-menu-toggle_'+n_);
    this._menuTitle = this._menu.querySelector('.js-menu-title_'+n_);
    this._n=n_;
    this._menu.style.left=icon_x[n_].toString()+"px";

    this._expanded = true;
    this._animate = false;
    this._duration = 200;
    this._frameTime = 1000/60;
    this._nFrames = Math.round(this._duration / this._frameTime);
    this._collapsed;

    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
    this.toggle = this.toggle.bind(this);

    this._calculateScales();
    this._createEaseAnimations();
    this._addEventListeners();

    this.collapse();
    this.activate();
  }

  activate () {
    this._menu.classList.add('menu--active');
    this._animate = true;
  }

  collapse () {
    if (!this._expanded) {
      return;
    }
    this._expanded = false;

    const {x, y} = this._collapsed;
    const invX = 1 / x;
    const invY = 1 / y;

    this._menu.style.transform = `scale(${x}, ${y})`;
    this._menuContents.style.transform = `scale(${invX}, ${invY})`;

    if (!this._animate) {
      return;
    }
    badge[this._n].innerHTML=medal_count[this._n][0].toString()
    this._applyAnimation({expand: false});
    setTimeout(function(menu){menu.style.background = `none`;},200,this._menu);
  }

  expand () {
    closeOpenMenus();
    if (this._expanded) {
      return;
    }
    this._expanded = true;

    this._menu.style.transform = `scale(1, 1)`;
    this._menuContents.style.transform = `scale(1, 1)`;

    if (!this._animate) {
      return;
    }

    this._menu.style.background = `rgba(0, 0, 0, 0.85)`;
    badge[this._n].innerHTML="X";
    this._applyAnimation({expand: true});
  }

  toggle () {
    if (this._expanded) {
      this.collapse();
      return;
    }

    this.expand();
  }

  _addEventListeners () {
    this._menuToggleButton.addEventListener('click', this.toggle);
  }

  _applyAnimation ({expand}=opts) {
    this._menu.classList.remove('menu--expanded');
    this._menu.classList.remove('menu--collapsed');
    this._menuContents.classList.remove('menu__contents--expanded');
    this._menuContents.classList.remove('menu__contents--collapsed');

    // Force a recalc styles here so the classes take hold.
    window.getComputedStyle(this._menu).transform;

    if (expand) {
      this._menu.classList.add('menu--expanded');
      this._menuContents.classList.add('menu__contents--expanded');
      return;
    }

    this._menu.classList.add('menu--collapsed');
    this._menuContents.classList.add('menu__contents--collapsed');
  }

  _calculateScales () {
    const collapsed = this._menuTitle.getBoundingClientRect();
    const expanded = this._menu.getBoundingClientRect();

    this._collapsed = {
      x: collapsed.width / expanded.width,
      y: collapsed.height / expanded.height
    }
  }

  _createEaseAnimations () {
    let menuEase = document.querySelector('#menu-ease_'+this._enn);
    if (menuEase) {
      return menuEase;
    }

    menuEase = document.createElement('style');
    menuEase.id="menu-ease_"+this._enn;

    const menuExpandAnimation = [];
    const menuExpandContentsAnimation = [];
    const menuCollapseAnimation = [];
    const menuCollapseContentsAnimation = [];

    const percentIncrement = 100 / this._nFrames;

    for (let i = 0; i <= this._nFrames; i++) {
      const step = this._ease(i / this._nFrames).toFixed(5);
      const percentage = (i * percentIncrement).toFixed(5);
      const startX = this._collapsed.x;
      const startY = this._collapsed.y;
      const endX = 1;
      const endY = 1;

      // Expand animation.
      this._append({
        percentage,
        step,
        startX,
        startY,
        endX,
        endY,
        outerAnimation: menuExpandAnimation,
        innerAnimation: menuExpandContentsAnimation
      });

      // Collapse animation.
      this._append({
        percentage,
        step,
        startX: 1,
        startY: 1,
        endX: this._collapsed.x,
        endY: this._collapsed.y,
        outerAnimation: menuCollapseAnimation,
        innerAnimation: menuCollapseContentsAnimation
      });
    }

    menuEase.textContent = `
    @keyframes menuExpandAnimation {
      ${menuExpandAnimation.join('')}
    }
    @keyframes menuExpandContentsAnimation {
      ${menuExpandContentsAnimation.join('')}
    }
    @keyframes menuCollapseAnimation {
      ${menuCollapseAnimation.join('')}
    }
    @keyframes menuCollapseContentsAnimation {
      ${menuCollapseContentsAnimation.join('')}
    }`;

    document.head.appendChild(menuEase);
    return menuEase;
  }

  _append ({
        percentage,
        step,
        startX,
        startY,
        endX,
        endY,
        outerAnimation,
        innerAnimation}=opts) {

    const xScale = (startX + (endX - startX) * step).toFixed(5);
    const yScale = (startY + (endY - startY) * step).toFixed(5);

    const invScaleX = (1 / xScale).toFixed(5);
    const invScaleY = (1 / yScale).toFixed(5);

    outerAnimation.push(`
      ${percentage}% {
        transform: scale(${xScale}, ${yScale});
      }`);

    innerAnimation.push(`
      ${percentage}% {
        transform: scale(${invScaleX}, ${invScaleY});
      }`);
  }

  _clamp (value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  _ease (v, pow=4) {
    v = this._clamp(v, 0, 1);

    return 1 - Math.pow(1 - v, pow);
  }
}

//Shape the medal grids
for(let n=0;n<3;n++)
{
    if(!draw_icon[n])
        continue;
    let k=Math.min(20,Math.ceil(1.4*Math.sqrt(medal_count[n][0])));
    let medal_grids_list=$('[id^="medal_grid_'+n+'"]');;
    for(let m=0;m<medal_grids_list.length;m++)
    {
        medal_grids_list[m].style.gridTemplateColumns=kRows(k);
    }
}

var menus=[];
//Associate HTML and Js. Delayed to give time to create the new HTML elements
setTimeout(function(){
    for(let n=0;n<3;n++)
    {
        if(!draw_icon[n])
            continue;
        badge[n]=document.getElementById('badge_'+n);
        menus.push(new Menu(n));
    }
},10);

function closeOpenMenus()
{
    for(let n=0;n<menus.length;n++)
    {
        if(menus[n]!={})
        {
            if(menus[n]._expanded)
                menus[n].collapse();
        }
    }
}