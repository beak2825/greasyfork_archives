// ==UserScript==
// @name        Steam Wishlist
// @namespace   avi-steam-wish
// @include     http://steamcommunity.com/id/*/wishlist*
// @include     http://steamcommunity.com/id/*/wishlist/*
// @include     https://steamcommunity.com/id/*/wishlist*
// @include     https://steamcommunity.com/id/*/wishlist/*
// @description:en  Steam wishlist summary and filter
// @version     2.2
// @grant       none
// @description Steam wishlist summary and filter
// @downloadURL https://update.greasyfork.org/scripts/20370/Steam%20Wishlist.user.js
// @updateURL https://update.greasyfork.org/scripts/20370/Steam%20Wishlist.meta.js
// ==/UserScript==
/*
  *** TO DO ***
  - Make search filter persist between Enhanced steam feature "Show: All Games | Games With Discounts" selection. 
    Currently doesn't work with when selecing "All games" but does work with "Games With Discount". I've disabled it for consistency reasons.
  - More testing for other currencies than Euro.
  - Make filter slider and search box work together rather than override each other.
*/

//*** Add scroll to top ***
jQuery('head').append('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">');
var lpos = jQuery('#wishlist_items').offset().left+jQuery('#wishlist_items').width()+10;
var tpos = jQuery('#wishlist_items').offset().top;
jQuery('#wishlist_items').append('<i id="toTop" title="Scroll to top" class="fa fa-arrow-up fa-3x" style="position: fixed; top: 10px; left: '+lpos+'px; display: none; cursor: pointer;"></i>');
if (jQuery(this).scrollTop() > tpos) {
    jQuery('#toTop:hidden').stop(true, true).fadeIn();
  } else {
    jQuery('#toTop').stop(true, true).fadeOut();
  }
jQuery(window).scroll(function() {
  if (jQuery(this).scrollTop() > tpos) {
    jQuery('#toTop:hidden').fadeIn();
  } else {
    jQuery('#toTop').fadeOut();
  }
});
jQuery('#toTop').click(function(){
  //jQuery(window).scrollTop(0);
  jQuery("html, body").animate({ scrollTop: "0px" });
});

//*** SETTINGS ***
//Change the values (true/false) as you see fit.
const AddSalesPriceSummary = true; //Adds price summary for games on sale.
const CreateScrollToLinks = true; //Creates links in the summary for games on sale, click scrolls to the games position in the list.
const ShowWishlistSearchFilter = true; //Displays an input field to filter the list based on the names that matches the input.
const PriceLimit1 = 5;
const PriceLimit2 = 10;
const PriceLimit3 = 15;
const PriceLimit4 = 20;
const PriceLimit5 = 30;
//SETTINGS END

const TimeoutTime = 200; //Delays the touchups to create and add the elements to the DOM.
const CurrencySign = jQuery('.wishlistRow .gameListPriceData .price, .wishlistRow .wishlistRow .gameListPriceData .price, .wishlistRow .discount_original_price').first().text().trim().replace(/\d+/g, '').replace(/\./g,'').replace(/\,/g,'');
const CurrencySignIndex = jQuery('.wishlistRow .gameListPriceData .price, .wishlistRow .discount_original_price').first().text().trim().indexOf(CurrencySign);

if(CurrencySign!=""){
  AdjustWishlistSummary();
}

function AdjustWishlistSummary(){
  var ori = 0;
  var np_count = 0;
  jQuery('.wishlistRow:visible .discount_original_price').each(function () {
    np_count++;
    ori = ori + FixPrices(jQuery(this).text());
    //jQuery('.package_contents').html(jQuery('.package_contents').html().replace(jQuery(this).parents('.wishlistRowItem').find('h4').html(), "<a href='#"+jQuery(this).parents('.wishlistRow').prop('id')+"' style='text-decoration: underline'>" + jQuery(this).parents('.wishlistRowItem').find('h4').html() + "</a>"));
  });
  var disc = 0;
  jQuery('.wishlistRow:visible .discount_final_price').each(function () {
    disc = disc + FixPrices(jQuery(this).text());
  });
  var fp = 0;
  var fp_count = 0;
  var names = '';
  jQuery('.wishlistRow:visible .gameListPriceData .price').each(function () {
    if (FixPrices(jQuery(this).text()) != '') {
      fp = fp + FixPrices(jQuery(this).text());
      fp_count++;
    }
  });
  var full_price = 0;
  
  jQuery('.wishlistRow:visible .gameListPriceData').each(function () {
    var tmp_name = jQuery(this).parents('.wishlistRowItem').find('h4').text();
    if (jQuery(this).find('.price').length > 0) {
      if (FixPrices(jQuery(this).find('.price').text()) != '') {
        full_price = full_price + FixPrices(jQuery(this).find('.price').text());
      }
    } else if (jQuery(this).find('.discount_final_price').length > 0) {
      if (FixPrices(jQuery(this).find('.discount_original_price').text()) != '') {
        full_price = full_price + FixPrices(jQuery(this).find('.discount_final_price').text());
      }
    }
    var game_id = jQuery(this).parents('.wishlistRow').prop('id');
    if (tmp_name != '') {
      if (names == '') {
        names = '<game game_id="'+game_id+'">'+tmp_name+'</game>';
      } else {
        names = names + '<game game_id="'+game_id+'">' + tmp_name + '</game> ';
      }
    }
  });
  var total_wishlist = jQuery('.wishlistRow').length;
  jQuery('head').append('<link rel="stylesheet" type="text/css" href="http://store.akamai.steamstatic.com/public/css/v6/game.css">');
  jQuery('head').append('<style>.PriceLimitInfo,.PriceLimit,.PriceLimitRangeSpan{display:none;}game{position: relative; display: inline-block;}game:not(:last-of-type):after{content:","}.FilterPercentages,.DisplayOptions,.PriceLimit,.PriceOrPercentage{cursor: pointer;}.FilterPercentages,.FilterPercentagesInfo, .FilterPercentagesRangeSpan, .DisplayOptionsInfo, .DisplayOptions, .PriceLimitInfo, .PriceLimit, .PriceOrPercentage, .PriceLimitRangeSpan, .PriceOrPercentageInfo{margin-left: 10px; font-size: 0.7em;}.FilterPercentages:not(.FilterPercentagesAll):before{content:"-";}.FilterPercentages:not(.FilterPercentagesAll):after{content:"%";}.PriceLimit:not(.PriceLimitAll):after{content:"'+CurrencySign+'";}#FilterPercentagesRange,#PriceLimitRange{vertical-align: middle;}.FilterPercentagesRangeSpan:after,.PriceLimitRangeSpan:after{content: "(" attr(data-content) ")"}.FilterPercentages.FilterPercentagesSelected, .DisplayOptions.DisplayOptionsSelected, .PriceLimit.PriceLimitSelected, .PriceOrPercentage.PriceOrPercentageSelected{text-decoration: underline;}</style>');
  
  if(CreateScrollToLinks){
    jQuery('.wishlistRow:visible .discount_original_price').each(function () {
      //alert(DiscDiv.html().trim());
      names = names.replace('<game game_id="'+jQuery(this).parents('.wishlistRow').prop('id')+'">'+jQuery(this).parents('.wishlistRowItem').find('h4').html()+'</game>', 
                            '<game game_id="'+jQuery(this).parents('.wishlistRow').prop('id')+'" class="IsSaleItem" style="white-space: nowrap;"><a href=\'#' + jQuery(this).parents('.wishlistRow').prop('id') + '\' style=\'text-decoration: underline\'>' + jQuery(this).parents('.wishlistRowItem').find('h4').html() + '</a></game>');
    });
  }
  var InputFilter = "";
  if(ShowWishlistSearchFilter){
    InputFilter = "<input type='text' id='FilterWishlistInput' style='position: absolute; right: 15px; top: 15px; padding-left: 3px;' placeholder='Search filter'>";
  }
  
  var PriceOrPercentage = '<span class="PriceOrPercentageInfo">Filter by: </span><span class="PriceOrPercentage PriceOrPercentageSelected">%</span><span class="PriceOrPercentage">'+CurrencySign+'</span>';
  var PercentageFilters = '<span class="FilterPercentagesInfo FilterPercentagesAll">Discount filter (min):</span><span class="FilterPercentages FilterPercentagesAll FilterPercentagesSelected">All</span><span class="FilterPercentages">25</span><span class="FilterPercentages">50</span><span class="FilterPercentages">75</span><span class="FilterPercentages">90</span><span class="FilterPercentagesRangeSpan" data-content="All"><input type="range" min="0" max="100" step="1" id="FilterPercentagesRange" value="0"></span>';
  var PriceLimits = '<span class="PriceLimitInfo PriceLimitAll">Price filter (max):</span><span class="PriceLimit PriceLimitAll PriceLimitSelected">All</span><span class="PriceLimit">'+PriceLimit1+'</span><span class="PriceLimit">'+PriceLimit2+'</span><span class="PriceLimit">'+PriceLimit3+'</span><span class="PriceLimit">'+PriceLimit4+'</span><span class="PriceLimit">'+PriceLimit5+'</span><span class="PriceLimitRangeSpan" data-content="All"><input type="range" min="0" max="100" step="1" id="PriceLimitRange" value="0"></span>';
  
  var DisplayOptions = '<span class="DisplayOptionsInfo">Display as: </span><span class="DisplayOptions DisplayOptionsSelected">Inline</span><span class="DisplayOptions">List</span>';
  
  var avi_steam_wish = '<div style="margin-top: 15px;" id="avi-steam-wish" class="game_area_purchase_game"><h1>Wishlist<br>'+PriceOrPercentage+'<br>'+PercentageFilters+PriceLimits+'<br>'+DisplayOptions+InputFilter+'</h1><p class="package_contents"><b>Includes ' + eval(fp_count + np_count) + ' items:</b> ' + names + '</p><div class="game_purchase_action"><div class="game_purchase_action_bg"><div class="game_purchase_price price">' + AddCurrencySign(FixNumbers(full_price)) + '</div></div></div></div>';
  
  jQuery('#tabs_basebg').prepend(avi_steam_wish);
    
  setTimeout(function () {
    if (AddSalesPriceSummary) {
      var rightpx = eval(jQuery('.game_purchase_action_bg').width()) + eval(jQuery('.game_purchase_action').css('right').replace('px', '')) + 16 + 'px';
      var NewText = jQuery('.wishlistRow:visible .discount_pct').length + ' on sale: ' + AddCurrencySign(FixNumbers(disc)) + ' (original price: ' + AddCurrencySign(FixNumbers(ori)) + ' = ' + AddCurrencySign(FixNumbers(ori - disc)) + ' discount)';
      jQuery('#avi-steam-wish').append('<div id="avi-spec-disc" style="right: ' + rightpx + '" class="game_purchase_action"><div class="game_purchase_action_bg"><div class="game_purchase_price price">' + NewText + '</div></div></div>');
    }

    //var DiscDiv = jQuery('<div />').append(jQuery('#'+jQuery(this).parents('.wishlistRow').prop('id')).find('.discount_block').clone());
    //'+DiscDiv.html().trim()+'

    jQuery('.IsSaleItem').each(function () {
      var DiscDiv = jQuery(jQuery(this).find('a').attr('href')).find('.discount_block').clone();
      DiscDiv.css('display','inline-block').css('margin-left','5px');
      jQuery(this).append(DiscDiv);
    });
  }, 1000);
}

function CalcPercentages(){
  var ori = 0;
  var np_count = 0;
  jQuery('.wishlistRow:visible .discount_original_price').each(function () {
    np_count++;
    ori = ori + FixPrices(jQuery(this).text());
  });
  var disc = 0;
  jQuery('.wishlistRow:visible .discount_final_price').each(function () {
    disc = disc + FixPrices(jQuery(this).text());
  });
  var fp = 0;
  var fp_count = 0;
  var names = '';
  jQuery('.wishlistRow:visible .gameListPriceData .price').each(function () {
    if (FixPrices(jQuery(this).text()) != '') {
      fp = fp + FixPrices(jQuery(this).text());
      fp_count++;
    }
  });
  var full_price = 0;
  jQuery('.wishlistRow:visible .gameListPriceData').each(function () {
    if (jQuery(this).find('.price').length > 0) {
      if (FixPrices(jQuery(this).find('.price').text()) != '') {
        full_price = full_price + FixPrices(jQuery(this).find('.price').text());
      }
    } else if (jQuery(this).find('.discount_final_price').length > 0) {
      if (FixPrices(jQuery(this).find('.discount_original_price').text()) != '') {
        full_price = full_price + FixPrices(jQuery(this).find('.discount_final_price').text());
      }
    }
  });
  
  jQuery('#avi-steam-wish .game_purchase_action .game_purchase_price.price').html(AddCurrencySign(FixNumbers(full_price)));
  
  var NewText = jQuery('.wishlistRow:visible .discount_pct').length + ' on sale: ' + AddCurrencySign(FixNumbers(disc)) + ' (original price: ' + AddCurrencySign(FixNumbers(ori)) + ' = ' + AddCurrencySign(FixNumbers(ori - disc)) + ' discount)';
  jQuery('#avi-spec-disc .game_purchase_price.price').html(NewText);
  
  jQuery('#avi-steam-wish .package_contents b').html('Includes ' + jQuery('game:visible').length + ' items: ');
}

function FixNumbers(num) {
  return num.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
function FixPrices(num){
  var result = eval(num.replace(CurrencySign, '').replace(',', '.').replace('--','').trim());
  if (result==undefined)result=''
  return result;
}

jQuery('#mainContents').on('click', '.es_sort a', function(event){
  /*var InputValue = jQuery('#FilterWishlistInput').val().toUpperCase();
  var AllGames = jQuery(this).parents('.es_sort').prop('id')=="es_wl_all";
  FilterWishlistByInput(InputValue, AllGames)*/
  jQuery('#FilterWishlistInput').val('');
  var AllGames = (jQuery('[name="es_wl_sort"]:checked').parent().prop('id')=="es_wl_sale") ? false : true;
  FilterWishlistByInput("", true)
});
jQuery('#mainContents').on('keyup', '#FilterWishlistInput', function () {
  var InputValue = jQuery(this).val().toUpperCase();
  var AllGames = (jQuery('[name="es_wl_sort"]:checked').parent().prop('id')=="es_wl_sale") ? false : true;
  FilterWishlistByInput(InputValue, AllGames)
});

function AddCurrencySign(cost){
  if(CurrencySignIndex==0){
    return CurrencySign + cost;
  }else{
    return cost + CurrencySign;
  }
}

jQuery('.PriceOrPercentage').on('click', function(){
  jQuery('.PriceOrPercentageSelected').removeClass('PriceOrPercentageSelected');
  jQuery(this).addClass('PriceOrPercentageSelected');
  if(jQuery(this).html()=="%"){
    jQuery('.FilterPercentagesInfo, .FilterPercentages, .FilterPercentagesRangeSpan').show();
    jQuery('.PriceLimitInfo, .PriceLimit, .PriceLimitRangeSpan').hide();
    
    if(jQuery('.FilterPercentages.FilterPercentagesSelected').length>0){
      var PercFilter = jQuery('.FilterPercentages.FilterPercentagesSelected').html();
      if(PercFilter=="All")PercFilter=0;
      CalculateFilters(PercFilter, '#wishlist_items .discount_pct', false)
    }else{
      var PercFilter = jQuery('#FilterPercentagesRange').val();
      CalculateFilters(PercFilter, '#wishlist_items .discount_pct', false)
    }
  }else{
    jQuery('.FilterPercentagesInfo, .FilterPercentages, .FilterPercentagesRangeSpan').hide();
    jQuery('.PriceLimitInfo, .PriceLimit, .PriceLimitRangeSpan').show();
    
    if(jQuery('.PriceLimit.PriceLimitSelected').length>0){
      var PercFilter = jQuery('.PriceLimit.PriceLimitSelected').html();
      if(PercFilter=="All")PercFilter=0;
      CalculateFilters(PercFilter, '#wishlist_items .discount_final_price, #wishlist_items .gameListPriceData .price', true)
    }else{
      var PercFilter = jQuery('#PriceLimitRange').val();
      CalculateFilters(PercFilter, '#wishlist_items .discount_final_price, #wishlist_items .gameListPriceData .price', true)
    }
  }
});

jQuery('.DisplayOptions').on('click', function(){
  if(jQuery(this).html()=="Inline"){
    jQuery('game').css('display','inline-block');
  }else{
    jQuery('game').css('display','block');
  }
  
  jQuery('.DisplayOptionsSelected').removeClass('DisplayOptionsSelected');
  jQuery(this).addClass('DisplayOptionsSelected');
  
  if(jQuery('.PriceOrPercentage.PriceOrPercentageSelected').html()=="%"){
    if(jQuery('.FilterPercentages.FilterPercentagesSelected').length>0){
      var PercFilter = jQuery('.FilterPercentages.FilterPercentagesSelected').html();
      if(PercFilter=="All")PercFilter=0;
      CalculateFilters(PercFilter, '#wishlist_items .discount_pct', false)
    }else{
      var PercFilter = jQuery('#FilterPercentagesRange').val();
      CalculateFilters(PercFilter, '#wishlist_items .discount_pct', false)
    }
  }else{
    if(jQuery('.PriceLimit.PriceLimitSelected').length>0){
      var PercFilter = jQuery('.PriceLimit.PriceLimitSelected').html();
      if(PercFilter=="All")PercFilter=0;
      CalculateFilters(PercFilter, '#wishlist_items .discount_final_price, #wishlist_items .gameListPriceData .price', true)
    }else{
      var PercFilter = jQuery('#PriceLimitRange').val();
      CalculateFilters(PercFilter, '#wishlist_items .discount_final_price, #wishlist_items .gameListPriceData .price', true)
    }
  }
});

function CalculateFilters(Filter, Control, LessThan){
  if(Filter!=0){
    jQuery('#wishlist_items .wishlistRow').hide();
    jQuery('game').hide();
    jQuery(Control).each(function(){
      if (LessThan){
        if(parseFloat(jQuery(this).text().replace('-','').replace('%', '').replace(CurrencySign,''))<=parseFloat(Filter)){
          jQuery(this).parents('.wishlistRow').show();
          jQuery("[game_id='"+jQuery(this).parents('.wishlistRow').prop('id')+"']").show();
        }
      }else{
        if(parseFloat(jQuery(this).text().replace('-','').replace('%', '').replace(CurrencySign,''))>=parseFloat(Filter)){
          jQuery(this).parents('.wishlistRow').show();
          jQuery("[game_id='"+jQuery(this).parents('.wishlistRow').prop('id')+"']").show();
        }
      }
    });
  }else{
    jQuery('#wishlist_items .wishlistRow').show();
    jQuery('game').show();
  }
  
  jQuery('#avi-steam-wish .package_contents b').html('Includes '+jQuery('game:visible').length+' items:');
}

jQuery('#FilterPercentagesRange').on('input change', function(){
  var PercFilter = jQuery(this).val();
  jQuery('.FilterPercentagesSelected').removeClass('FilterPercentagesSelected');
  jQuery('.FilterPercentagesRangeSpan').attr('data-content','-'+jQuery(this).val()+'%'), false;
  if(PercFilter==0){
    jQuery('.FilterPercentagesRangeSpan').attr('data-content','All');
  }
  CalculateFilters(PercFilter, '#wishlist_items .discount_pct')
});
jQuery('#PriceLimitRange').on('input change', function(){
  var PercFilter = jQuery(this).val();
  jQuery('.PriceLimitSelected').removeClass('PriceLimitSelected');
  jQuery('.PriceLimitRangeSpan').attr('data-content',AddCurrencySign(PercFilter));
  if(PercFilter==0){
    jQuery('.PriceLimitRangeSpan').attr('data-content','All');
  }
  CalculateFilters(PercFilter, '#wishlist_items .discount_final_price, #wishlist_items .gameListPriceData .price', true)
});
jQuery('.FilterPercentages').on('click', function(){
  jQuery('.FilterPercentagesSelected').removeClass('FilterPercentagesSelected');
  jQuery(this).addClass('FilterPercentagesSelected');

  var PercFilter = jQuery(this).text();
  jQuery('.FilterPercentagesRangeSpan').attr('data-content','-'+PercFilter+'%');
  if(PercFilter=="All"){
    PercFilter=0;
    jQuery('.FilterPercentagesRangeSpan').attr('data-content','All');
  }
  jQuery('#FilterPercentagesRange').val(PercFilter);
  CalculateFilters(PercFilter, '#wishlist_items .discount_pct', false)
});
jQuery('.PriceLimit').on('click', function(){
  jQuery('.PriceLimitSelected').removeClass('PriceLimitSelected');
  jQuery(this).addClass('PriceLimitSelected');

  var PercFilter = jQuery(this).text();
  jQuery('.PriceLimitRangeSpan').attr('data-content',AddCurrencySign(PercFilter));
  if(PercFilter=="All"){
    PercFilter=0;
    jQuery('.PriceLimitRangeSpan').attr('data-content','All');
  }
  jQuery('#PriceLimitRange').val(PercFilter);
  CalculateFilters(PercFilter, '#wishlist_items .discount_final_price, #wishlist_items .gameListPriceData .price', true)
});

function FilterWishlistByInput(InputValue, AllGames){
  if(AllGames){
    jQuery('.wishlistRow').each(function () {
      if (jQuery(this).find('h4').html().toUpperCase().search(InputValue) > -1) {
        jQuery(this).show();
      }
      else {
        jQuery(this).hide();
      }
    });
    jQuery('game').each(function () {
      if (jQuery(this).find('a').text().toUpperCase().search(InputValue) > -1) {
        jQuery(this).show();
      }
      else {
        jQuery(this).hide();
      }
    });
  }else{
    jQuery('.wishlistRow .discount_original_price').each(function () {
      if (jQuery(this).parents('.wishlistRow').find('h4').html().toUpperCase().search(InputValue) > -1) {
        jQuery(this).parents('.wishlistRow').show();
      }
      else {
        jQuery(this).parents('.wishlistRow').hide();
      }
    });
    jQuery('game.IsSaleItem').each(function () {
      if (jQuery(this).find('a').html().toUpperCase().search(InputValue) > -1) {
        jQuery(this).show();
      }
      else {
        jQuery(this).hide();
      }
    });
  }
  
  //CalcPercentages();
}