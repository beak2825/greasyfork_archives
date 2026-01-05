// ==UserScript==
// @name        Steam profile bg on all profile pages
// @namespace   avi-steam-community-background
// @description Get background from profile
// @include     http://steamcommunity.com*
// @version     2
// @grant       none
// @description:en  Add the viewed users background to steamcommunity pages.
// @downloadURL https://update.greasyfork.org/scripts/20371/Steam%20profile%20bg%20on%20all%20profile%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/20371/Steam%20profile%20bg%20on%20all%20profile%20pages.meta.js
// ==/UserScript==


//***** SETTINGS *****
//This will adjust the opacity of elements which allow the background image to show through.
//Change to your liking, ex: 0 = 0%, 0.3 = 30%, 1 = 100%. 
//0 is fully transparent, 1 is fully opaque.
const gameListRowOpacity = 0.2; //Games page. Default is 0.2
const wishlistRowOpacity = 0.6; //Wishlist page. Default is 0.2
const review_boxOpacity = 0; //Reviews page. Default is 0
const view_inventory_pageOpacity = 0.4; //Workshop items, Merchandise, Collections, Guides without content (I think). Default is 0.4
const workshopItemCollectionOpacity = 0.2; //Workshop items, Merchandise, Collections, Guides with content (I think). Default is 0.2
const WishlistCollectionGradient = 'rgba(0, 0, 0, 0.8) linear-gradient(135deg, rgba(97, 100, 101, 0.3) 0%, rgba(226, 244, 255, 0.3) 100%) repeat scroll 0 0';
                                  //Set this to an empty string if no change is wanted on the WishlistCollection box. Change the first rgba's last number to adjust the opacity. Default value is 0.2.
//***** SETTINGS END *****

var $div = jQuery('<div>');

var href='';
if(jQuery('.profile_small_header_name a').length>0){
  href=jQuery('.profile_small_header_name a').attr('href');
}else if(jQuery('#HeaderUserInfoName a').length>0){
  href=jQuery('#HeaderUserInfoName a').attr('href');
}else if(jQuery('a.friendBlockLinkOverlay').length>0){
  href=jQuery('a.friendBlockLinkOverlay').attr('href');
}

if (href!=""){
    $div.load(href +' div.no_header.profile_page.has_profile_background ', function(){
      jQuery('.pagecontent.no_header, .responsive_page_template_content').css('background-image',$div.find('.has_profile_background').css('background-image'));
      jQuery('.pagecontent.no_header, .responsive_page_template_content').css('background-repeat','no-repeat');
      jQuery('.pagecontent.no_header, .responsive_page_template_content').css('background-color','#000000');
      jQuery('.pagecontent.no_header, .responsive_page_template_content').css('background-position','center top');

      try{
          jQuery('.gameListRow').css('background-color','rgba'+jQuery('.gameListRow').css('background-color').slice(4).split(',')[0].trim()+','+jQuery('.gameListRow').css('background-color').slice(4).split(',')[1].trim()+','+jQuery('.gameListRow').css('background-color').slice(4).split(',')[2].trim()+','+gameListRowOpacity+')');
      }catch(err){}
      try{
          jQuery('.wishlistRow').css('background-color','rgba'+jQuery('.wishlistRow').css('background-color').slice(4).split(',')[0].trim()+','+jQuery('.wishlistRow').css('background-color').slice(4).split(',')[1].trim()+','+jQuery('.wishlistRow').css('background-color').slice(4).split(',')[2].trim()+','+wishlistRowOpacity+')');
      }catch(err){}
      try{
          jQuery('.review_box').css('background-color','rgba'+jQuery('.review_box').css('background-color').slice(4).split(',')[0].trim()+','+jQuery('.review_box').css('background-color').slice(4).split(',')[1].trim()+','+jQuery('.review_box').css('background-color').slice(4).split(',')[2].trim()+','+review_boxOpacity+')');
      }catch(err){}
      try{
          jQuery('.view_inventory_page').css('background-color','rgba'+jQuery('.view_inventory_page').css('background-color').slice(4).split(',')[0].trim()+','+jQuery('.view_inventory_page').css('background-color').slice(4).split(',')[1].trim()+','+jQuery('.view_inventory_page').css('background-color').slice(4).split(',')[2].trim()+','+view_inventory_pageOpacity+')');
      }catch(err){}
      try{
          jQuery('.workshopItemCollection').css('background-color','rgba'+jQuery('.workshopItemCollection').css('background-color').slice(4).split(',')[0].trim()+','+jQuery('.workshopItemCollection').css('background-color').slice(4).split(',')[1].trim()+','+jQuery('.workshopItemCollection').css('background-color').slice(4).split(',')[2].trim()+','+workshopItemCollectionOpacity+')');
      }catch(err){}
      try{
          jQuery('.apphub_HomeHeaderContent, .breadcrumbs, #profileBlock').css('background-color','rgba(0,0,0,0.5)');
      }catch(err){}
      try{
          if(WishlistCollectionGradient!=''){
            jQuery('.game_area_purchase_game, .game_area_offsite_purchase').css('background',WishlistCollectionGradient);
          }
      }catch(err){}
    });
}