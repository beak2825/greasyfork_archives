// ==UserScript==
// @name         SHLoL
// @namespace    https://www.landsoflords.com
// @version      0.6.4
// @description  Spreadsheet Helper for LoL
// @author       fikapron
// @match        https://www.landsoflords.com/mgmt/*/unit:*
// @match        https://www.landsoflords.com/mgmt/*/units
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29815/SHLoL.user.js
// @updateURL https://update.greasyfork.org/scripts/29815/SHLoL.meta.js
// ==/UserScript==

$(document).ready(function(){
  
  SHLoLdatasave = [];
  SHLoLdomain = lol.Mgmt.org.slug;
  SHLoLsortby = "";
  SHLoLfiltered = true;
  
  if(localStorage.getItem(SHLoLdomain) !== null){
    SHLoLdatasave = JSON.parse(localStorage.getItem(SHLoLdomain));
  }
  
  if(typeof lol.Unit !== "undefined") {
    var newdata = {};
    var flt = /[^0-9]/gi;

    newdata.id = window.location.href.replace(flt, '');
    newdata.prof = $("h1").next().contents().filter(function() {return !!$.trim(this.innerHTML||this.data);}).first().text();
    if(newdata.id && !newdata.prof.includes(" of ")) {
      newdata.domain = SHLoLdomain;
      newdata.name = $("h1").text();
      newdata.st = $("div.block div.col span.nowrap:nth-child(2)").text().replace(flt, '');
      newdata.ag = $("div.block div.col span.nowrap:nth-child(3)").text().replace(flt, '');
      newdata.co = $("div.block div.col span.nowrap:nth-child(4)").text().replace(flt, '');
      newdata.in = $("div.block div.col span.nowrap:nth-child(5)").text().replace(flt, '');
      newdata.wi = $("div.block div.col span.nowrap:nth-child(6)").text().replace(flt, '');
      newdata.ch = $("div.block div.col span.nowrap:nth-child(7)").text().replace(flt, '');

      var olddatasave = SHLoLdatasave.find(function(ppl){
        if(ppl.id == newdata.id){
          return true;
        }
      });

      if(typeof olddatasave === 'undefined'){
        SHLoLdatasave.push(newdata);
      } else {
          SHLoLdatasave = SHLoLdatasave.filter(function(ppl){ if(ppl.id !== olddatasave.id) return ppl; });
          SHLoLdatasave.push(newdata);
      }
      localStorage.setItem(SHLoLdomain, [JSON.stringify(SHLoLdatasave)]);
    }
  }
  
  var Style = function(rule){
    this.styleElement = document.createElement('style');
    this.rule = rule;
    this.styles = [];
    document.head.appendChild(this.styleElement);
  };
 
  Style.prototype.add = function(style){
    this.styles.push(style);
    this.apply();
  };
 
  Style.prototype.apply = function(){
    var style = this.rule + '{';
    style = style + this.styles.join(';') + ';';
    style = style + '}';
    this.styleElement.textContent = style;
  };
  
  sorter = function(SHLoLsortby) {
    
    filteredPeople = SHLoLdatasave.filter(function(ppl){
      if(ppl.prof == "Settlers"){
        return ppl;
      } else if(ppl.prof != "Settlers" && !SHLoLfiltered) { return ppl; }
    }, SHLoLfiltered);

    sortedPeople = filteredPeople.sort(function(a, b){
      switch(SHLoLsortby) {
        case "str":
          return (b.st - a.st);
        case "agi":
          return (b.ag - a.ag);
        case "con":
          return (b.co - a.co);
        case "int":
          return (b.in - a.in);
        case "wis":
          return (b.wi - a.wi);
        case "cha":
          return (b.ch - a.ch);
        default:
          return (a.id - b.id);
      }
      return (b.ch - a.ch);
    }, SHLoLsortby);
    
    $(".SHLoL-table tbody").empty();
    
    for(i = 0; i < sortedPeople.length; i++){
       tr = tbody.insertRow();
       
       td = tr.insertCell();
       td.appendChild(document.createTextNode(i+1+'.'));

       td = tr.insertCell();
       var domainLink = document.createElement('a');
       domainLink.setAttribute('href', 'https://www.landsoflords.com/mgmt/'+sortedPeople[i].domain+'/unit:'+sortedPeople[i].id);
       domainLink.innerText = sortedPeople[i].name;
       td.appendChild(domainLink);

       td = tr.insertCell();
       td.appendChild(document.createTextNode(sortedPeople[i].st));

       td = tr.insertCell();
       td.appendChild(document.createTextNode(sortedPeople[i].ag));

       td = tr.insertCell();
       td.appendChild(document.createTextNode(sortedPeople[i].co));

       td = tr.insertCell();
       td.appendChild(document.createTextNode(sortedPeople[i].in));

       td = tr.insertCell();
       td.appendChild(document.createTextNode(sortedPeople[i].wi));

       td = tr.insertCell();
       td.appendChild(document.createTextNode(sortedPeople[i].ch));

       td = tr.insertCell();
       td.appendChild(document.createTextNode(sortedPeople[i].prof));
    }
  }
  
  SHLoLDiv = function(){
 
    this.node = document.createElement('div');
    this.node.classList.add('SHLoL-div');
 
    var style = new Style('.SHLoL-div');
    style.add('position: fixed');
    style.add('z-index: 99999');
    style.add('top: 70px');
    style.add('bottom: 70px');
    style.add('padding: 5px 3px');
    style.add('overflow: auto');
    style.add('width: 450px');
    style.add('border: 1px solid #000');
    style.add('background: #ffffff');
    style.add('font-size: 14px')
    style.add('right: -448px');
    style.add('transition: right 0.5s')

    var styleHover = new Style('.SHLoL-div:hover');
    styleHover.add('right: 0px');
    styleHover.add('transition: right 0.75s')
 
    document.body.appendChild(this.node);
  }
  
  SHLoLTable = function(SHLoLsortby, SHLoLfiltered) {
    this.node = document.createElement('table');
    this.node.classList.add('SHLoL-table');

    var i = 0;

    var styleTable = new Style('.SHLoL-table');
    styleTable.add('width: 100%');
    styleTable.add('table-layout: initial');

    var styleHeadCell = new Style('.SHLoL-table thead td');
    styleHeadCell.add('font-weight: bold');

    var styleCell = new Style('.SHLoL-table td');
    styleCell.add('padding: 3px 5px');
    styleCell.add('text-align: right');
    styleCell.add('border-right: 1px solid #dddddd');

    var styleRowOdd = new Style('.SHLoL-table tbody tr:nth-child(odd)');
    styleRowOdd.add('background: #f0f0f0');

    thead = this.node.createTHead();
    tbody = this.node.createTBody();
    var tr = thead.insertRow();
    var td = tr.insertCell();
    
    td.appendChild(document.createTextNode('No.'));

    td = tr.insertCell();
    td.appendChild(document.createTextNode('Name ('+SHLoLdatasave.length+')'));
    
    td = tr.insertCell();
    var sortSt = document.createElement('a');
    sortSt.setAttribute('onclick', 'sorter("str")');
    sortSt.innerText = 'St';
    td.appendChild(sortSt);

    td = tr.insertCell();
    var sortAg = document.createElement('a');
    sortAg.setAttribute('onclick', 'sorter("agi")');
    sortAg.innerText = 'Ag';
    td.appendChild(sortAg);

    td = tr.insertCell();
    var sortCo = document.createElement('a');
    sortCo.setAttribute('onclick', 'sorter("con")');
    sortCo.innerText = 'Co';
    td.appendChild(sortCo);

    td = tr.insertCell();
    var sortIn = document.createElement('a');
    sortIn.setAttribute('onclick', 'sorter("int")');
    sortIn.innerText = 'In';
    td.appendChild(sortIn);

    td = tr.insertCell();
    var sortWi = document.createElement('a');
    sortWi.setAttribute('onclick', 'sorter("wis")');
    sortWi.innerText = 'Wi';
    td.appendChild(sortWi);

    td = tr.insertCell();
    var sortCh = document.createElement('a');
    sortCh.setAttribute('onclick', 'sorter("cha")');
    sortCh.innerText = 'Ch';
    td.appendChild(sortCh);

    td = tr.insertCell();
    td.appendChild(document.createTextNode('Profession'));
    
    sorter(SHLoLsortby);

    $("div.SHLoL-div").append(this.node);
  }
  
  new SHLoLDiv();
  new SHLoLTable();
  
});