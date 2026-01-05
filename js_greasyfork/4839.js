// ==UserScript==
// @name        GOG legacy fixes
// @namespace   ChrisSD_gog
// @description Fixes bugs on the older parts of the GOG.com website
// @include     https://www.gog.com/*
// @include     http://www.gog.com/*
// @version     1.20
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4839/GOG%20legacy%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/4839/GOG%20legacy%20fixes.meta.js
// ==/UserScript==

// Match current pathname against a list of paths
function isPath() {
  var path = window.location.pathname;
  for (var i = 0; i < arguments.length; i++) {
    if (arguments[i] == path) { return true; }
  }
  return false;
}

/** Section: Remove avatar placeholders **/
if (/^\/forum\/[^/]*\//.test(window.location.pathname)) {
  (function() {
    var avatars = $('.b_p_avatar_h > img');
    function removePlaceholders() {
      avatars.each(function() {
        if (this.complete) {
          this.parentNode.style.backgroundImage = 'none';
        }
      });
    }
    removePlaceholders(); // Remove placeholders for cached images
    $(window).load(removePlaceholders()); // Once all images have loaded, run again.
  }());
}


/** Section: Forum Font Size Adjust **/
if (isPath('/forum') || window.location.pathname.lastIndexOf('/forum/', 0) === 0) {
  (function(){
    var localStorage = window.localStorage;
    var csd_css_id = 'csd_style_forum_font';
    var forumFontKey = 'csd_forumfontsize';
    var defaultFontSize = 12;
    var fontSize = localStorage[forumFontKey];

    if (typeof(fontSize) === 'undefined') {
      fontSize = defaultFontSize;
    } else {
      fontSize = parseInt(fontSize);
    }

    function addFontSetting() {
      var settings = document.querySelector('.settings > .s_right_part_h > .settings_h');
      var container = document.createElement('div');
      container.className = 'for_set_row';

      var label = document.createElement('div');
      label.className = 'for_label_2';
      label.appendChild(document.createTextNode('Forum font size'));
      container.appendChild(label);

      var select = document.createElement('select');
      for (i = 11; i < 15; i++) {
        var option = document.createElement('option');
        option.value = i;
        option.appendChild(document.createTextNode(i));
        if (i === fontSize) {
          option.selected = true;
        }
        select.appendChild(option);
      }
      select.addEventListener('change', updateFontSize, false);

      var div = document.createElement('div');
      div.className = 'for_set_sel';
      div.appendChild(select);
      container.appendChild(div);
      settings.appendChild(container);
    }

    if (window.location.pathname === '/forum/mysettings') {
      addFontSetting();
    }

    function updateFontSize(event) {
      var css = document.getElementById(csd_css_id);
      if (css) { css.parentNode.removeChild(css); }

      if (event) {
        fontSize = parseInt(this.selectedOptions[0].value);

        if (fontSize !== defaultFontSize) {
          localStorage[forumFontKey] = fontSize;
        } else {
          localStorage.removeItem(forumFontKey);
        }
      }

      if (fontSize !== defaultFontSize) {
        css = document.createElement('style');
        css.id = csd_css_id;
        var styles = '#templateStaContainer,.quot_text,div.n_b_b_main{font-size:' + (fontSize-1) + 'px}';
        styles += 'div.post_text_c,.nav_bar_top a{font-size:' + fontSize + 'px}';
        css.appendChild(document.createTextNode(styles));

        document.getElementsByTagName('head')[0].appendChild(css);
      }
    }
    updateFontSize();
      }());
}

if (isPath('/account', '/account/games', '/account/games/shelf', 
           '/account/games/list')) {
  (function(){
    window.shelfLinkHideClick = function() {
    var b = $(this).parents('.shelf_details').attr('data-gameid');
    var a = $(this).children('.dark_un').html();
    $(this).toggleClass('hide unhide');
    if (a == 'hide game') {
      $(this).children('.dark_un').html('unhide game');
      $('.shelf_game[data-gameid="' + b + '"]').addClass('hidden_game');
      $.get(__ajax, {
        a: 'gameHide',
        h: 1,
        g: b
      })
    } else {
      $(this).children('.dark_un').html('hide game');
      $('.shelf_game[data-gameid="' + b + '"]').removeClass('hidden_game');
      $.get(__ajax, {
        a: 'gameHide',
        h: 0,
        g: b
      })
    }
  }
  window.listLinkHideClick = function() {
    var b = $(this).attr('id').replace('hide_game_', '');
    var a = $(this).children('.dark_un').html();
    $(this).toggleClass('hide unhide');
    if (a == 'hide game') {
      $(this).children('.dark_un').html('unhide game');
      $('#game_li_' + b).addClass('hidden_game');
      $.get(__ajax, {
        a: 'gameHide',
        h: 1,
        g: b
      })
    } else {
      $(this).children('.dark_un').html('hide game');
      $('#game_li_' + b).removeClass('hidden_game');
      $.get(__ajax, {
        a: 'gameHide',
        h: 0,
        g: b
      })
    }
  }

  function fixShelfView() {
    var timer = null;
    $('.shelf_main').on('click', '.shelf_game',  null, function(event) {
      clearTimeout(timer);

      if (window.visibleDetails !== -1
          && event.target.parentNode.getAttribute('data-gameid') !== window.selectedGame[0].getAttribute('data-gameid')
          && event.target.parentNode.offsetTop != window.selectedGame[0].offsetTop) {

        window.detAnimDur = 100;
        window.shelfDetailsClose();
        window.detAnimDur = 300;
        timer = setTimeout(function() {
          $(event.target).trigger('click');
        }, 500);
      }
      else {
        window.shelfGameClick.call(this, event);
      }
    });
  }
  fixShelfView();
  }());
}

/** Section: search **/
var universe = document.querySelector('body > div.universe');
if (!universe) {
  (function(){
    var logout = document.querySelector('a[ng-click="logout()"]');
    if (logout) {
      logout.href = 'https://' + window.location.hostname + '/logout';
    }
  }());
  (function(){
    function clearResults() {
      // remove the previous search results.
      while (holder.firstChild) {
        holder.removeChild(holder.firstChild);
      }
      removeCategoryItems();
    }

    function createCategoryItem(text, url) {
      var element;
      if (typeof(url) === 'undefined') {
        element = document.createElement('div');
      }
      else {
        element = document.createElement('a');
        element.href = url;
        element.className = 'product-row '; // for hover effect
      }
      element.className += 'top-nav-res__category top-nav-res__item top-nav-res__item--none';
      element.appendChild(document.createTextNode(text));
      categoryItems.push(element);
      return element;
    }
    function removeCategoryItems() {
      while (categoryItems.length > 0) {
        var element = categoryItems.pop();
        element.parentNode.removeChild(element);
      }
    }


    function searchCallback(term, result) {
      var products = result.products;
      clearResults();

      for (var i = 0; i < products.length; i++) {
        var searchItem = search_item_template.cloneNode(true);
        holder.appendChild(searchItem);
        searchItem.querySelector('a.product-row__link').href = products[i].url;
        searchItem.querySelector('div.product-title').appendChild(document.createTextNode(products[i].title));
        searchItem.querySelector('span.price-btn__text > span').appendChild(document.createTextNode(products[i].price.amount));
        searchItem.querySelector('span.curr-symbol').appendChild(document.createTextNode(products[i].price.symbol));
        if (products[i].price.isDiscounted === true) {
          var discountDiv = searchItem.querySelector('.product-row__discount');
          discountDiv.classList.remove('ng-hide');
          discountDiv.firstChild.appendChild(document.createTextNode(products[i].price.discountPercentage + '%'));
        }
      }

      if (products.length === 0) {
        var noResults = createCategoryItem('No results found');
        search.appendChild(noResults);

        var gamesLink = createCategoryItem('BROWSE ALL GAMES', '/games');
        search.appendChild(gamesLink);

        var moviesLink = createCategoryItem('BROWSE ALL MOVIES', '/movies');
        search.appendChild(moviesLink);

      } else if (result.totalPages > 1) {
        if (result.totalGamesFound > 0) {
          var gamesLink = createCategoryItem('ALL GAMES (' + result.totalGamesFound + ')', 
                                             '/games##search=' + term);
          search.appendChild(gamesLink);
        }
        if (result.totalMoviesFound > 0) {
          var moviesLink = createCategoryItem('ALL MOVIES (' + result.totalMoviesFound + ')', 
                                             '/movies##search=' + term);
          search.appendChild(moviesLink);
        }
      }
    }

    function doSearch() {
      var term = search_input.value;
      if (term.length < 2) { 
        clearResults();
        return; 
      }
      var key = '£' + term;
      if (savedSearches.hasOwnProperty(key)) {
        searchCallback(term, savedSearches[key]);
      } else {
        var request = new XMLHttpRequest();
        request.open('GET', search_url + term, true);
        request.addEventListener('load', function() {
          var result = JSON.parse(request.responseText);
          savedSearches[key] = result;
          searchCallback(term, result);
        }, false);
        request.send();
      }
    }

    function isChildOf(child, parent) {
      if (child === document.body) { return false; }
      var elem = child.parentNode;
      while (elem !== parent && elem !== document.body) {
        elem = elem.parentNode;
      }
      return elem !== document.body;
    }

    var categoryItems = [];
    var savedSearches = {};
    var search_url = '/games/ajax/filtered?limit=4&search=';

    var tempDiv = document.createElement('div'); // for parsing html strings
    tempDiv.innerHTML = '<div class="product-row top-nav-res__item js-is-focusable product-row--micro"><div class="product-row__price product-row__alignment"><div class="price-btn price-btn--active"><span class="price-btn__text"><span class="ng-binding"><span class="curr-symbol"></span></span></span></div></div><a class="product-row__link"><div class="product-row__discount product-row__alignment ng-hide"><span class="price-text--discount"></span></div><div class="product-row__text"><div class="product-row__content"><div class="product-row__content-in"><div class="product-row__title"><div class="product-title ng-binding ng-scope"></div></div></div></div></div></a></div>';
    var search_item_template = tempDiv.firstChild;

    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = '<div class="_dropdown top-nav__results"><div class="top-nav-search-holder"><div class="top-nav-search _search"><input class="top-nav-search__input _search__input js-nav-serach-input" type="search"><i class="ic icon-search _search__icon top-nav-search__icon"></i><i class="ic icon-clear _search__clear no-hl top-nav-search__clear"></i><i class="spinner _search__spinner show-on-off-canvas"></i><i class="spinner _search__spinner hide-on-off-canvas"></i></div></div><div class="top-nav-res__category-holder"></div></div>';
    search = tempDiv.firstChild;
    search.style.display = 'none';
    search.addEventListener('mouseup', function(event) {
      event.stopPropagation();
    }, false);

    var holder = search.querySelector('.top-nav-res__category-holder');

    var elem = document.querySelector('div.top-nav__container > .top-nav__items');
    elem.parentNode.insertBefore(search, elem);

    var search_input = search.querySelector('input[type="search"]');
    var timer;
    search_input.addEventListener('keyup', function(event) {
      clearTimeout(timer);
      timer = setTimeout(doSearch, 250);
    }, false);

    var searchButton = document.querySelector('nav .top-nav-extras-search-holder');
    searchButton.addEventListener('mouseup', function(event) { event.stopPropagation()}, false);
    searchButton.addEventListener('click', function(event) {
      event.preventDefault();
      if (search.style.display === 'none') {
        search.style.display = 'block';
        search_input.focus();
      } else {
        search.style.display = 'none';
      }
    }, false);

    document.addEventListener('mouseup', function(event) {
      if (!(event.which === 3 && isChildOf(event.target, search))) {
        if (search.style.display !== 'none') {
         search.style.display = 'none';
       }
      }
    }, false);
  }());
}

/** Section: wishlist **/
if (window.location.pathname.lastIndexOf('/promo/', 0) === 0 && $(document.body).hasClass('page_promo')) {
  (function(){
    var priceClass = 'csd_price-set';
    function getPrices(product_ids, callback) {
      var payload = {
        'data': {
          'product_ids': product_ids,
          'series_ids': false
        }
      }

      var request = new XMLHttpRequest();
      request.open('POST', '/userData.json', true);
      request.onload = function() {
        callback(JSON.parse(this.responseText)['personalizedProductPrices']);
      };
      request.send(JSON.stringify(payload));
    }
    function fix_promo_prices() {
      var symbol = '$';
      var price_elements = $('#mainTemplateHolder .gog-price');
      var ids = price_elements.map(function() {
        return $(this).data('gameid'); 
      }).get();

      getPrices(ids, function(prices) {
        // Get price symbol
        for (var key in prices) {
          symbol = prices[key].symbol;
          break;
        }
        price_elements.each(function() {
          var is_owned = $(this).parent().parent().hasClass('own');
          var price = prices[$(this).data('gameid')];
          var game_index = $(this).data('gameindex');

          var game_prices = window.pricesSchema[game_index];
          for (var key in game_prices) {
            game_prices[key] = price.finalAmount.replace('.', '');
          }
          window.gamesOriginalPrices[game_index] = price.baseAmount.replace('.', '');

          var discount = $('<span class="price-text--discount"/>');
          discount.css({'float': 'right', 'margin-top': '12px' });
          discount.text(price.discountPercentage + "%");
          if (!is_owned) {
            discount.css('margin-right', '-24px');
            $(this).before(discount);
            $(this).css({'width': '', 'margin-left': '1em'});
          } else {
            discount.css('margin-right', '-39px');
            $(this).after(discount);
            $(this).css({'width': '', 'margin-left': '1em'});
            $(this).children('span.game-owned-in').hover(function() {
              $(this).text(symbol + price.finalAmount);
            }, function() {
              $(this).text("OWNED");
            });
          }


          window.recalculate();
        });
      });

      window.simplePrice = function(price) {
        price = price / 100;
        price = price.toFixed(2);
        price = symbol + price;
        return price;
      }
    }


    // main
    if ($(document.body).hasClass('page_promo')) {
      fix_promo_prices();
    }
  }());
}
