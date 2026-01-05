// ==UserScript==
// @name         	AmazonReviewTrader Power Tools
// @namespace    	ARTPT
// @version      	0.8
// @description  	Makes AMZReviewTrader better.
// @author       	Me
// @match 	 		https://*.amzreviewtrader.com/product-list.php
// @match 			http://*.amzreviewtrader.com/product-list.php
// @match 	 		https://*.amzonereviews.com/review-product-list.php
// @match 	 		http://*.amzonereviews.com/review-product-list.php
// @grant        	none
// @downloadURL https://update.greasyfork.org/scripts/19917/AmazonReviewTrader%20Power%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/19917/AmazonReviewTrader%20Power%20Tools.meta.js
// ==/UserScript==

/* 	ART Power Tools 
*	A simple filter to remove items that cost more than what you're looking to spend, groups, and search phrases
	Future Updates:
		- More efficient
		- Cleaner code
		*/

var artpt_maxprice = -1;
var artpt_price_box = null;
var artpt_group_box = null;
var artpt_title_box = null;

$(document).ajaxComplete(function(event, xhrobj, settings) {

    if(settings.url != "product_grid.php")
    {
        return;
    }

    //insert ARTJS textboxes and stuff
    //have to do this every time a request is sent because ART replaces entire page
    $("<div id='artpt_labelBox'> \
<label for='artpt_price_box' id='artpt_price_label' class='form-control artpt_form_control'> Maximum Price: </label> \
<input type='text' name='artpt_price_box' id='artpt_price_box' class='form-control artpt_form_control' placeholder='Enter maximum price as a decimal number' /> \
</div><div id='artpt_labelBox'> \
<label for='artpt_percentage_box' id='artpt_percentage_label' class='form-control artpt_form_control'> Minimum Percentage Off: </label> \
<input type='text' name='artpt_percentage_box' id='artpt_percentage_box' class='form-control artpt_form_control' placeholder='Enter minimum percentage off as a decimal number' /> \
</div> \
<div id='artpt_labelBox'> \
<label for='artpt_group_box' id='artpt_group_label' class='form-control artpt_form_control'> Product Group Filter: </label> \
<input type='text' name='artpt_group_box' id='artpt_group_box' class='form-control artpt_form_control' placeholder='Products with a group containing your search string will be omitted' /> \
</div> \
<div id='artpt_labelBox'> \
<label for='artpt_title_box' id='artpt_title_label' class='form-control artpt_form_control'> Title Filter: </label> \
<input type='text' name='artpt_title_box' id='artpt_title_box' class='form-control artpt_form_control' placeholder='Products containing your search string will be omitted' /> \
</div> \
<div id='artpt_spacer'></div> \
").insertAfter($("#filters input:first"));


    debugger;
    //reset the maxprice box if necessary
    artpt_price_box = $("#artpt_price_box");
    artpt_percentage_box = $("#artpt_percentage_box");
    artpt_group_box = $("#artpt_group_box");
    artpt_title_box = $("#artpt_title_box");

    if(artpt_maxprice == -1){
        artpt_price_box.val(""); 
    }
    else{
        artpt_price_box.val(artpt_maxprice);
    }

    if(artpt_minPercentage == -1){
        artpt_percentage_box.val(""); 
    }
    else{
        artpt_percentage_box.val(artpt_minPercentage);
    }

    if(artpt_groupFilter == ""){
        artpt_group_box.val(""); 
    }
    else{
        artpt_group_box.val(artpt_groupFilter);
    }

    if(artpt_titleFilter == ""){
        artpt_title_box.val(""); 
    }
    else{
        artpt_title_box.val(artpt_titleFilter);
    }


    // Gets the price (decimal) from a box element
    function GetPrice(theBox){
        var curPrice = 0;
        var $price = null;
        $price = theBox.find(".price");

        if($price.text().trim() == "FREE")
        { 
            curPrice = 0; 
        }
        else {
            curPrice = parseFloat($price.text().trim().substring(1));
        }

        return curPrice;
    }

    // Gets the title group from a box element
    function GetProductGroup(theBox){
        var $group = null;
        $group = theBox.find(".title-container .product-group");
        var group = $group.text().trim();       

        return group;
    }

        // Gets the title from a box element
    function GetTitle(theBox){
        var $title = null;
        $title = theBox.find(".title-container .title");
        var title = $title.text().trim();       

        return title;
    }

    // Gets the discount as a percentage off (57% off => 57) from a box element
    function GetDiscount(theBox){
        var curPrice = GetPrice(theBox);
        var curDiscount = 0;

        if (curPrice === 0){
            return 100;
        }

        var $discount = null;
        $discount = theBox.find(".discount");

        var discountString = $discount.text().trim();

        // Is the discount listed as a $ off?            
       if(discountString.indexOf("$") > -1 || discountString.indexOf("£") > -1)
        { 
            var dollarStripped = discountString.substring(2);
            var spaceIndex = dollarStripped.indexOf(" ");
            var dollarsOff = parseFloat(dollarStripped.substring(0, spaceIndex));
            curDiscount = (dollarsOff / (curPrice + dollarsOff)) * 100; 
        }
        // or as a % off?
        else {
            var curDiscount = parseFloat(discountString.substring(1, 3));            
        }

        return curDiscount;
    }

    // Hide a box if the price is too high
    function HideByPrice (theBox) {
        debugger;
        var curPrice = GetPrice(theBox);

        if(curPrice > artpt_maxprice){ 
            theBox.hide().removeClass("box");        
            refresh_layout();
        }
    }

    // Hide a box if the price is too high
    function HideByGroup (theBox) {
        debugger;
        var curGroup = GetProductGroup(theBox);

        if(curGroup.indexOf(artpt_groupFilter) > -1){ 
            theBox.hide().removeClass("box");        
            refresh_layout();
        }
    }

    // Hide a box if the string is found
    function HideByTitle (theBox) {
        debugger;
        var curTitle = GetTitle(theBox);

        if(curTitle.indexOf(artpt_titleFilter) > -1){ 
            theBox.hide().removeClass("box");        
            refresh_layout();
        }
    }

    // Hide a box if the discount is too low
    function HideByDiscount (theBox) {        
        debugger;
        var curDiscount = GetDiscount(theBox);

        if(curDiscount < artpt_minPercentage){ 
            theBox.hide().removeClass("box");        
            refresh_layout();
        }
    }

    // loop through boxes
    $("#box-container-inner .box").each(function(i){

        $this = $(this);
        if(artpt_maxprice > -1){
            HideByPrice($this);
        }
        if(artpt_minPercentage > -1){
            HideByDiscount($this);
        }
        if(artpt_groupFilter != ""){
            HideByGroup($this);
        }
        if(artpt_titleFilter != ""){
            HideByTitle($this);
        }
     });

    });

    //update maxprice when textbox input changes
    $(document).on("input propertychange", "#artpt_price_box", function(){
        if($(this).val() == ""){
            artpt_maxprice = -1;
        }
        else{
            artpt_maxprice = parseFloat($(this).val().trim()).toFixed(2);
        }
    });

    //update minPerentage when textbox input changes
    $(document).on("input propertychange", "#artpt_percentage_box", function(){
        if($(this).val() == ""){
            artpt_minPercentage = -1;
        }
        else{
            artpt_minPercentage = parseFloat($(this).val().trim()).toFixed(2);
        }
    });

    //update minPerentage when textbox input changes
    $(document).on("input propertychange", "#artpt_group_box", function(){
        if($(this).val() == ""){
            artpt_groupFilter = "";
        }
        else{
            artpt_groupFilter = $(this).val().trim();
        }
    });

debugger;
    //update title when textbox input changes
    $(document).on("input propertychange", "#artpt_title_box", function(){
        if($(this).val() == ""){
            artpt_titleFilter = "";
        }
        else{
            artpt_titleFilter = $(this).val().trim();
        }
    });

    //add artpt styles and stuff
    //TODO: get rid of this eventually

    var stylesheetTxt = " \
.artpt_form_control{ \
margin-bottom: 10px; \
} \
\
#artpt_price_label{ \
text-align: right; \
width: 350px; \
display: inline-block; \
border-width: 0px; \
background-color: inherit; \
} \
\
#artpt_percentage_label{ \
text-align: right; \
width: 350px; \
display: inline-block; \
border-width: 0px; \
background-color: inherit; \
} \
\
#artpt_group_label{ \
text-align: right; \
width: 350px; \
display: inline-block; \
border-width: 0px; \
background-color: inherit; \
} \
#artpt_title_label{ \
text-align: right; \
width: 350px; \
display: inline-block; \
border-width: 0px; \
background-color: inherit; \
} \
#artpt_percentage_box{ \
text-align: left; \
width: 400px;  \
display: inline-block; \
} \
#artpt_group_box{ \
text-align: left; \
width: 400px;  \
display: inline-block; \
} \
#artpt_title_box{ \
text-align: left; \
width: 400px;  \
display: inline-block; \
} \
#artpt_price_box{ \
text-align: left; \
width: 400px;  \
display: inline-block; \
} \
#artpt_labelBox{ \
width: 900px; \
display: inline-block; \
} \
";

    var stylesheet = document.createElement('style');
    stylesheet.setAttribute("type", "text/css");
    stylesheet.textContent = stylesheetTxt;
    document.body.appendChild(stylesheet);
