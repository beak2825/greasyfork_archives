// ==UserScript==
// @name        Filter for step 3
// @namespace   tequila_j-script
// @description Filter by type in step 3
// @include     http://bgg.activityclub.org/olwlg/viewlist.cgi?*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/38585/Filter%20for%20step%203.user.js
// @updateURL https://update.greasyfork.org/scripts/38585/Filter%20for%20step%203.meta.js
// ==/UserScript==
//hide lines that are associated with dummy itens

console.log("start");
(function() {

    var cssList = "want";
    var allRows = $('table#geeklist > tbody > tr');
  
    allRows.each(function(){
      var $gameName = $(this).find('td:nth-child(2) > a:first');
      var cssClasses = $gameName.attr("class");
      $(this).addClass(cssClasses);
    });
  
    //add checkboxes to select items
    var $filters = $("#pleasewait").nextUntil("img").filter("span");
    var $divFilters = $("<div/>");
    $divFilters.append($("<span class='col1'>Uncategorized</span>"));
    $divFilters.append($filters);
    $("#pleasewait").after($divFilters);

  //add no category:
   $filters = $divFilters.find("span");

   $filters.wrap("<div/>");
  
    $filters.each(function() {
      var $this = $(this);
      var $checkBox = $("<input type='checkbox' checked='true'/>");
      $(this).after($checkBox);
      $checkBox.on("click",function() {
        if ($checkBox.is(':checked'))
          show($this.attr('class'));
        else 
          hide($this.attr('class'));
      })
    });
    
    function show(cssClass) {
        console.log("Showing:" + cssClass)
        if (cssClass == "all") {
          allRows.show();
          return;
        }
        
        allRows.each(function() {
          if ($(this).hasClass(cssClass)) $(this).show();
        });
    }
                     
    function hide(cssClass) {
        console.log("Hiding:" + cssClass)
        if (cssClass == "all") {
          allRows.hide();
          return;
        }
          
        allRows.each(function() {
          if ($(this).hasClass(cssClass)) $(this).hide();
        });
    }
                     
})();
console.log("end");

    