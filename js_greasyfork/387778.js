// ==UserScript==
// @name        Shopeasy
// @namespace   shopeasy.apphub.ga
// @author      Rizuwan
// @description Tools untuk memudahkan listing barang dari Shopee ke Carousell
// @match       https://shopee.com.my/*
// @match       https://my.carousell.com/*
// @version     2.0
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require     https://greasyfork.org/scripts/380553/code/helper.js
// @grant       GM_download
// @grant       GM.getValue
// @grant       GM.setValue
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/387778/Shopeasy.user.js
// @updateURL https://update.greasyfork.org/scripts/387778/Shopeasy.meta.js
// ==/UserScript==

'use strict';
var shopeasy = {
  item: {}
};

function xhr2(url, data, callback) {
  let oldXHROpen = window.XMLHttpRequest.prototype.open;
  window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    this.addEventListener('load', function() {
      if(this.responseText.indexOf(data) != -1) {
        callback(this.responseText);
      }
    });

    return oldXHROpen.apply(this, arguments);
  }
}

var renderItem = function(response) {
  shopeasy.item = response.item;
  shopeasy.link = location.href;
  setTimeout(() => {
    $('button:contains(buy now)').after('<button id="shopeasy" type="button" style="display: none; background-color: #ffeb3b;" class="btn btn--l YtgjXY">Shopeasy</button>');
    $("#shopeasy").fadeIn().click(function(){
      localStorage.shopeasy = shopeasy;
      GM.setValue('shopeasy', JSON.stringify(shopeasy));

      var imgName = prompt('Naming Product Image');
      if(imgName != null) {
        shopeasy.item.images.forEach((element,i) => {
          GM_download('https://cf.shopee.com.my/file/' + element, imgName + '[' + (i+1) + ']');
        });

        window.open('https://my.carousell.com/sell/', '_shopeasy');
      }
    });
  }, 2000);
};

var afterListCarousell = function(response) {
  bookmark(response, 'carousell')
};

var bookmark = function(response, listed_at) {  
  GM.getValue('shopeasy').then(function(x) {
    var shopeasy = JSON.parse(x);

    try {
      if('shopee_verified' in shopeasy.item) ref_listed_at = 'shopee';
    } catch (error) {}

    var obj = {
      itemid:             response.data.id,
      itemname:           response.data.title,
      itemfrom:           shopeasy.item.shop_location,
      ref_sellerid:       response.data.seller.id,
      ref_sellerusername: response.data.seller.username,
      ref_itemid:         shopeasy.item.itemid,
      ref_shopid:         shopeasy.item.shopid,
      ref_itemprice:      shopeasy.item.price_max / 100000,
      ref_link:           shopeasy.link,
      ref_listed_at:      ref_listed_at,
      listed_at:          listed_at
    };

    $.post('https://api.apphub.ga/shopeasy', obj);
  });

};

if(location.href.indexOf('https://shopee.com.my/') != -1) {
  fetching('https://shopee.com.my/api/v2/item/get?itemid', renderItem);
}


$(document).ready(function() {
  if(location.href.indexOf('https://my.carousell.com') != -1) {
    $("button:contains(Sell)").after(
      $("button:contains(Sell)").clone().css("background-color","#d2232a").text("Random like").click(function(){

        $("button:contains(View more)").click();
        var count = 0;
        var max = 5;
        intViewmore = setInterval(() => {
          if(count <= max) {
            $("button:contains(View more)").click();
          }
          else {
            clearInterval(intViewmore);
            total = $("img[src*='liked-inactive-grey']").length;

            var c = 0;
            var m = 25;
            intLike = setInterval(() => {  
              if(c < m) {
                $("img[src*='liked-inactive-grey']:eq("+(Math.floor(Math.random() * ($("img[src*='liked-inactive-grey']").length)))+")").click(); 
              }
              else {
                clearInterval(intLike);
                alert("abis like dahh !!")
              }
              console.log(c);
              c++;
            }, 1000);
          }

          count++;
        }, 2000);
      }));





  }

  if(location.href.indexOf('https://my.carousell.com/sell') != -1) {    
    GM.getValue('shopeasy').then(function(x) {
      var shopeasy = JSON.parse(x);

      
      var observer2 = new MutationObserver(function(mutations) {
        title = $("#root > div > div > div:eq(1) > div nav > div > div > div:eq(0)").text()
        // Step 1
        // if(title == "Choose photos") {
        //     $("button:contains(category)").click(function() {
        //       if(typeof test == 'undefined') {
        //         setTimeout(() => {                
        //           var categories = '';
        //           shopeasy.item.categories.forEach((x,i) => categories += x.display_name + ' > ')
        //           $("input[placeholder^='Search']").attr('placeholder', categories.replace(/ > \s*$/, ""));
        //         }, 500);
        //       }
        //     })
        // }
        $("p:contains(Select a category)").parent().click(function(){
          // if($("input[placeholder^='Search for a category']").length) {      
                setTimeout(() => {                
                  var categories = '';
                  shopeasy.item.categories.forEach((x,i) => categories += x.display_name + ' > ')
                  $("input[placeholder^='Search']").attr('placeholder', categories.replace(/ > \s*$/, ""));
                }, 100);
          // }
        });
        
        // Step 2
        if($("span:contains(Listing Title)").length) {
            console.log(shopeasy.item.name);
            $("span:contains(New)").prev().click();
            $("p:contains(Mailing & Delivery)").parent().prev().click();

            $("span:contains(Listing Title)").next().focus(function() {
              $(this).val(shopeasy.item.name);         
            }).val(shopeasy.item.name); 
            
            $("span:contains(Brand)").next().focus(function() {
              $(this).val(shopeasy.item.brand ? shopeasy.item.brand : shopeasy.item.attributes.filter(x => x.name == "Brand")[0].value);         
            }); 

            price = shopeasy.item.price_max / 100000;
            markupPrice = parseFloat(localStorage.markupPrice) || 0;
            $("span:contains(Price)").next().attr("id","price").focus(function() {
              $(this).val(parseInt(markupPrice ? (100 + markupPrice) / 100 * price : price).toFixed(2));

            });
            
            if(!$("#priceMarkup").length) {
              $("span:contains(Price)").next().closest('div').parent().append('<input id="priceMarkup" placeholder="% markup" value="'+markupPrice+'"  style="border: none;font-size: 12px;width: 55px; text-align: right;" type="text">%');         
            }

            $("#priceMarkup").keyup(function() {
              markupPrice = parseFloat($(this).val());
              $("#price").val(parseInt((100 + markupPrice) / 100 * price).toFixed(2));
              localStorage.markupPrice = $(this).val();
            });
            
            $("h3:contains(description)").next().find('textarea').focus(function() {
                $(this).val(shopeasy.item.description).css('height', '400px');       
            }); 
            
            // $("input[placeholder^='Brand']").focus(function() {
            //   $(this).val(shopeasy.item.brand ? shopeasy.item.brand : shopeasy.item.attributes.filter(x => x.name == "Brand")[0].value);         
            // }); 

            // price = shopeasy.item.price_max / 100000;
            // markupPrice = parseFloat(localStorage.markupPrice) || 0;
            // $("label:contains(Price)").prev().children().attr('placeholder', price).attr("id","price").focus(function() {
            //   $(this).val(parseInt(markupPrice ? (100 + markupPrice) / 100 * price : price).toFixed(2));
            // }).closest('div').parent().prepend('<input id="priceMarkup" placeholder="% markup" value="'+markupPrice+'"  style="border: none;font-size: 12px;width: 55px; text-align: right;" type="text">%'); 
            // $("#priceMarkup").keyup(function() {
            //   markupPrice = parseFloat($(this).val());
            //   $("#price").val(parseInt((100 + markupPrice) / 100 * price).toFixed(2));
            //   localStorage.markupPrice = $(this).val();
            // });

            // $("textarea[placeholder^='Describe']").focus(function() {
            //   $(this).val(shopeasy.item.description)
            //   .css('height', '400px');
            // }); 
            shippingkey = shopeasy.item.shop_location.indexOf('Overseas') != -1 ? 'oversea' : 'local';
            $("textarea[placeholder^='Are there']").attr('placeholder', 'Shipping from ' + shopeasy.item.shop_location).css('height', '200px').click(function(){              
              var shipnote = JSON.parse(localStorage.shipnote || '{}');
              $(this).val(shipnote[shippingkey] || '');
            })
            .change(function(){
              var shipnote = JSON.parse(localStorage.shipnote || '{}');
              shipnote[shippingkey] = $(this).val() || '';
              localStorage.shipnote = JSON.stringify(shipnote); 
            });
            
            observer2.disconnect();
            fetching('https://my.carousell.com/api-service/create-listing/3.1/listings/', afterListCarousell);
          
        }
      });
      var observerTarget2 = $("#root > div > div > div:eq(1) > div")[1];
      var observerConfig2 = { attributes:true, childList: false, characterData: false, subtree: true };
      observer2.observe(observerTarget2, observerConfig2);

    });
  }

  if($("#editButton").length) {
    setTimeout(() => {
      var itemid = parseInt($("#editButton").attr('href').replace ( /[^\d.]/g, '' ));
      $("#editButton").after('<button id="shopeeButton" class="'+$("#editButton").attr("class")+'"><span>Reference</span></button>');
      $("#shopeeButton").click(function() {
        window.open('https://apphub.ga/p/' + itemid, '_shopeelink');
      });
    }, 1500);
  }
});

// https://my.carousell.com/ui/iso?_csrf=BVuiXnAI-xvWDmIqi0ggiWGyJjdFaVMc_2p4
// https://jsonblob.com/2844bed9-4961-11e9-9547-9f98b8679cea