// ==UserScript==
// @name         NTSU Unioncloud fixer
// @include    https://www.trentstudents.org/*
// @locale      en
// @version      1.70
// @description  NTUuserscript is a small JavaScript file which locally modifies trentstudents.org for a more admin friendly environment.
// @author       Danny J Kendall
// @grant        none
// @namespace https://greasyfork.org/users/169145

// @downloadURL https://update.greasyfork.org/scripts/38087/NTSU%20Unioncloud%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/38087/NTSU%20Unioncloud%20fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';
  
    //staff sign in
    if (location.pathname=="/" && $('.user-name').length<= 0) { document.body.innerHTML += '<a style="position:absolute;top:0px;color:#222;text-decoration:none;font-weight:1000;background:#eee;" class="uc-staff-link" href="/users/sign_in?click=hyper">Staff Sign In</a>';}
  
  if (/administrator/.test(window.location.href)) {
    
   //Combox box functionality
    
    $( function() {
    var eventTypeTags = [
      "Brackenhurst",
      "City campus",
      "Clifton campus",
      "Advice",
      "Black History Month",
      "Club nights",
      "Comedy",
      "Debate",
      "Festivals & Fairs",
      "Freshers",
      "Fundraising",
      "Live Music",
      "Give It A Go",
      "Just for fun",
      "Games",
      "Performing Arts",
      "Communities",
      "Society",
      "Special Events",
      "Sport",
      "Student Voice",
	  "Trips & Tours",
	  "Varsity",
	  "Volunteering",
      "Skills Training & Workshops",
	  "Club of the Week",
      "Wellbeing",
      "Small and friendly"
    ];
    $( "#grid_f_union_event_types_alias" ).autocomplete({
      source: eventTypeTags
    });
  } );
    
  $( function() {
    var groupTypeTags = [
     "Societies",
      "Volunteering Projects",
      "Communities"
    ];
    $( "#grid_f_union_group_types_alias" ).autocomplete({
      source: groupTypeTags
    });
  } );
    
   $( function() {
    var groupStateTags = [
     "Approved",
      "Pending",
      "New"
    ];
    $( "#grid_f_workflow_state" ).autocomplete({
      source: groupStateTags
    });
  } );
    
    //buttons
     //add all custom user groups button
    if ($('#union_list_usergroup_left_navigation').length > 0) {
    var ugCustomAll = document.getElementById('union_list_usergroup_left_navigation');
    ugCustomAll.insertAdjacentHTML('afterend','<li class="level-two" id="union_list_usergroup_left_navigation"><a href="https://www.trentstudents.org/administrator/user_groups/custom_index?grid%5Border%5D=name&grid%5Border_direction%5D=asc&grid%5Bpp%5D=494"><span>Custom User Groups (All)</span></a></li>');
    }
    
         //add all groups button
    if ($('#union_list_usergroup_left_navigation').length > 0) {
    var ugCustomAll = document.getElementById('union_list_usergroup_left_navigation');
    ugCustomAll.insertAdjacentHTML('afterend','<li class="level-two" id="union_list_usergroup_left_navigation"><a href="https://www.trentstudents.org/administrator/user_groups/groups?grid%5Border%5D=groups.name&grid%5Border_direction%5D=asc&grid%5Bpp%5D=1569"><span>Groups (All)</span></a></li>');
    }
    
         //add all events button
    if ($('#union_list_usergroup_left_navigation').length > 0) {
    var ugCustomAll = document.getElementById('union_list_usergroup_left_navigation');
    ugCustomAll.insertAdjacentHTML('afterend','<li class="level-two" id="union_list_usergroup_left_navigation"><a href="https://www.trentstudents.org/administrator/user_groups/events?grid%5Border%5D=events.name&grid%5Border_direction%5D=asc&grid%5Bpp%5D=16643"><span>Events (All)</span></a></li>');
    }
    
         //add all programmes button
    if ($('#union_list_usergroup_left_navigation').length > 0) {
    var ugCustomAll = document.getElementById('union_list_usergroup_left_navigation');
    ugCustomAll.insertAdjacentHTML('afterend','<li class="level-two" id="union_list_usergroup_left_navigation"><a href="https://www.trentstudents.org/administrator/programs?grid%5Border%5D=name&grid%5Border_direction%5D=asc&grid%5Bpp%5D=5406"><span>Programmes (All)</span></a></li>');
    }
    
         //add all questionnaire button
    if ($('#union_list_usergroup_left_navigation').length > 0) {
    var ugCustomAll = document.getElementById('union_list_usergroup_left_navigation');
    ugCustomAll.insertAdjacentHTML('afterend','<li class="level-two" id="union_list_usergroup_left_navigation"><a href="https://www.trentstudents.org/administrator/user_groups/questions?grid%5Border_direction%5D=&grid%5Bpp%5D=67"><span>Questionnaire (All)</span></a></li>');
    }
    
    
    //add all events button
    if ($('#union_events_left_navigation').length > 0) {
    var eventAll = document.getElementById('union_events_left_navigation');
    eventAll.insertAdjacentHTML('afterend','<li class="level-two" id="new_event_left_navigation"><a href="https://www.trentstudents.org/administrator/events?grid%5Border%5D=start_date&grid%5Border_direction%5D=asc&grid%5Bpp%5D=189"><span>Events (All)</span></a></li>');
    }
    //add all products button
    if ($('#manage_product_left_navigation').length > 0) {
    var productsAll = document.getElementById('manage_product_left_navigation');
    productsAll.insertAdjacentHTML('afterend','<li class="level-two" id="manage_product_left_navigation"><a href="https://www.trentstudents.org/administrator/products?grid%5Border%5D=name&grid%5Border_direction%5D=asc&grid%5Bpp%5D=101"><span>Products (All)</span></a></li>');
    }
    //add all resources button
    if ($('#documents_library_cms_left_navigation').length > 0) {
    var resourcesAll = document.getElementById('documents_library_cms_left_navigation');
    resourcesAll.insertAdjacentHTML('afterend','<li class="level-two" id="documents_library_cms_left_navigation"><a href="https://www.trentstudents.org/administrator/sites/3493/resources?grid%5Border%5D=start_date&grid%5Border_direction%5D=desc&grid%5Bpp%5D=458"><span>Resources (All)</span></a></li>');
    }
    //add new event button
    if ($('#new_event_left_navigation').length > 0) {
    var newEventButton = document.getElementById('new_event_left_navigation');
    newEventButton.insertAdjacentHTML('afterend','<li class="level-two" id="new_event_left_navigation"><a href="https://www.trentstudents.org/administrator/events/new"><span>New Event</span></a></li>');
    }
    //add all event Promotions button
    if ($('#administrator_event_promotions_left_navigation').length > 0) {
	var eventPromoAll = document.getElementById('administrator_event_promotions_left_navigation');
    eventAll.insertAdjacentHTML('afterend','<li class="level-two" id="administrator_event_promotions_left_navigation"><a href="https://www.trentstudents.org/administrator/event_promotions?grid%5Border%5D=start_date&grid%5Border_direction%5D=asc&grid%5Bpp%5D=375"><span>Event Promotions (All)</span></a></li>');
    }
	//add all groups button
    if ($('#union_events_left_navigation').length > 0) {
    var allGroupsButton = document.getElementById('manage_groups_left_navigation');
    allGroupsButton.insertAdjacentHTML('afterend','<li class="level-two" id="manage_promotions_left_navigation"><a href="https://www.trentstudents.org/administrator/groups?grid%5Border_direction%5D=&grid%5Bpp%5D=180"><span>Groups (All)</span></a></li>');
    }
  //add all articles button
  if ($('#article_manager_cms_left_navigation').length > 0) {
  var allArticlesButton = document.getElementById('article_manager_cms_left_navigation');
    allArticlesButton.insertAdjacentHTML('afterend','<li class="level-two" id="manage_promotions_left_navigation"><a href="https://www.trentstudents.org/administrator/sites/3493/articles?grid%5Border%5D=start_date&grid%5Border_direction%5D=desc&grid%5Bpp%5D=264"><span>Articles (All)</span></a></li>');
  }
  //add all categories eVoting button
  if ($('#manage_categories_left_navigation').length > 0) {
  var allCategoriesButton = document.getElementById('manage_categories_left_navigation');
    allCategoriesButton.insertAdjacentHTML('afterend','<li class="level-three selected simple-navigation-active-leaf" id="manage_categories_left_navigation"><a href="https://www.trentstudents.org/administrator/evoting/evoting_categories?grid%5Border_direction%5D=&grid%5Bpp%5D=263"><span>Categories (All)</span></a></li>');
     }
   //add all positions eVoting button
  if ($('#manage_positions_left_navigation').length > 0) {
  var allPositionsButton = document.getElementById('manage_positions_left_navigation');
    allPositionsButton.insertAdjacentHTML('afterend','<li class="level-three" id="manage_positions_left_navigation"><a href="https://www.trentstudents.org/administrator/evoting/evoting_positions?grid%5Border_direction%5D=&grid%5Bpp%5D=2875"><span>Positions (All)</span></a></li>');
  }
    
  }
  
  //add direct save to products

if(location.pathname.match(/^\/administrator\/products\/\d\d\d\d\/edit/)){  
  var x = window.location.href.match(/(.*)(\/\d*)/)[1]+/product_variants/;
       document.body.innerHTML += '<div style="display:block;position:absolute;top:47%;left:91%;z-index:997;"><iframe id="saver" src="" frameborder="0" allowtransparency="yes" scrolling="no" style="border: 0px none; margin-left: -36px; height: 912px; margin-top: -480px; width: 650px;position:relative; left:-20px;top:30px;" ></iframe></div>';
         var saverFrame = document.getElementById("saver");
         saverFrame.src=x;
   }
  
 
  //hide old stock deleted in shop

   if(location.pathname=="/administrator/products"){
  $("tr td:contains('OLD Clothing Stock')").parent().hide();
  $("tr td:contains('Delete')").parent().hide();
  $("tr td:contains('yTrent Army Stainless Steel Travel Mug')").parent().hide();
  $("tr td:contains('yTrent Army Bottle Opener Key Chain')").parent().hide();}
  
  
  //add next ticket button
  if (/event_ticket_types/.test(window.location.href)) {
 $(".button-holder").attr("id","nextTicketButton");
 var nextTicketButton = document.getElementById('nextTicketButton');
 nextTicketButton.insertAdjacentHTML('afterend','<button id="nxtTicketBtn" style="transform:translate(300%,-165%);border:0" class="btn btn-default">Next Ticket Hover</button>');    
  var nextTicketFinal = document.getElementById('nxtTicketBtn');
  nextTicketFinal.addEventListener("mouseover",function(){ 
    var e, s;
    var IB = 1;

    function isDigit(c) {
        return ("0"<= c && c<= "9");
    }
    var L = location.href;
    var LL = L.length;
    for (e = LL - 1; e >= 0; --e)
        if (isDigit(L.charAt(e))) {
            for (s = e - 1; s >= 0; --s)
                if (!isDigit(L.charAt(s))) break;
            break;
        }++s;
    if (e< 0) return;
    var oldNum = L.substring(s, e + 1);
    var newNum = "" + (parseInt(oldNum, 10) + IB);
    while (newNum.length< oldNum.length) newNum = "0" + newNum;
    location.href = L.substring(0, s) + newNum + L.slice(e + 1);
});

  }
  
$('img[src$="https://d2wcds7obmglv2.cloudfront.net/assets/admin_default/group-default-icon.png"]').attr("src","https://s3-eu-west-1.amazonaws.com/nusdigital/image/images/156356/original/NTSU_web_avatar.png");
$('.users-list>li img').attr("width","60%");
$('img[src$="https://d2wcds7obmglv2.cloudfront.net/assets/default/groupsicon.png"]').attr("src","https://s3-eu-west-1.amazonaws.com/nusdigital/image/images/156356/original/NTSU_web_avatar.png");    
$('img[src$="https://d2wcds7obmglv2.cloudfront.net/assets/default/new-articles-320x220.png"]').attr("src","https://s3-eu-west-1.amazonaws.com/nusdigital/image/images/156356/original/NTSU_web_avatar.png");
$('img[src$="/assets/default/events_icons.png"]').attr("src","https://s3-eu-west-1.amazonaws.com/nusdigital/image/images/156356/original/NTSU_web_avatar.png");
$('img[src$="https://d2wcds7obmglv2.cloudfront.net/assets/bootstrap/usergroup-icon-cf4bb1a71a694b57e3d254336cfa2006b1e16cef14698ab9d2af28e04300e050.png"]').attr("src","https://s3-eu-west-1.amazonaws.com/nusdigital/image/images/156356/original/NTSU_web_avatar.png");
  
  
//Export full idea as CSV
  if (window.location.toString().includes("administrator/student_voices") && window.location.toString().includes("?type=index") ) {
    $(".button-holder").attr("id","exportToCSVButton");
 var exportToCSVButton = document.getElementById('exportToCSVButton');
 exportToCSVButton.insertAdjacentHTML('afterend','<button id="xportCSV" style="transform:translate(300%,-165%);border:0" class="btn btn-default">Export as CSV</button>');    
  var exportToCSVButtonFinal = document.getElementById('xportCSV');
  xportCSV.addEventListener("mouseover",function(){ 

  var capture = [$('.form-group label').eq(0).text(),$('.form-group .form-field').eq(0).text(),$('.form-group label').eq(1).text(), $('.form-group .form-field').eq(1).text(), $('.form-group label').eq(2).text(),$('.form-group .form-field').eq(2).text(),$('.form-group label').eq(3).text(), $('.form-group .form-field').eq(3).text(), $('.form-group label').eq(4).text(), $('.form-group .form-field').eq(4).text(),  $('.form-group label').eq(5).text(), $('.form-group .form-field').eq(5).text(),  $('.form-group label').eq(6).text(), $('.form-group .form-field').eq(6).text()];

var objectToCSVRow = function(dataObject) {
    var dataArray = [];
    for (var o in dataObject) {
        var innerValue = dataObject[o]===null?'':dataObject[o].toString();
        dataArray.push(innerValue);
    }
    return dataArray.join('') + '\r\n';
};

var exportToCSV = function(arrayOfObjects) {
    if (!arrayOfObjects.length) {
        return;
    }
    var csvContent = "data:text/csv;charset=utf-8,";
    csvContent += objectToCSVRow(Object.keys(arrayOfObjects[0]));
    arrayOfObjects.forEach(function(item){
        csvContent += objectToCSVRow(item);
    }); 
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "export-of-big-idea.csv");
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link); 
};

  exportToCSV(capture);
    
});

  }
                   

})();