// ==UserScript==
// @name        Leboncoin enhanced design
// @namespace   leboncoin
// @include     http://www.leboncoin.fr/*
// @version     1.01
// @grant       none
// @description Ce script permet d'améliorer l'aspect graphique du site Leboncoin
// @downloadURL https://update.greasyfork.org/scripts/17574/Leboncoin%20enhanced%20design.user.js
// @updateURL https://update.greasyfork.org/scripts/17574/Leboncoin%20enhanced%20design.meta.js
// ==/UserScript==

var defaultCssValue = {
  darkBackgroundShadow: '#606a6b',
  darkBackground: '#7f8c8d',
  mediumBackground: '#bdc3c7',
  lightBackground: '#ecf0f1',
  background: '#ecf0f1',
  darkFontColor: '#34495e',
  defaultFontColor: '#2c3e50',
  urgentFontColor: '#e67e22',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
  boxShadowHover: '0 3px 4px rgba(0, 0, 0, 0.3)'
};

function LED() {
  console.log("Leboncoin est maintenant en version Enhanced :)");
  return {

    designElements : [
      {
        elements : ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', '.label_new'],
        styles: {
          fontFamily: 'arial, verdana, sans-sherif',
          color: defaultCssValue.defaultFontColor
        }
      },
      {
        elements : ['body', '.page_width', '.content-color'],
        styles: {
          backgroundColor : defaultCssValue.lightBackground
        }
      },
      {
        elements : ['.search_box', '#account_login_f', '.navlist.type li', '.content-border', '.gallery-zone .background'],
        styles: {
          backgroundColor : defaultCssValue.mediumBackground,
          color: defaultCssValue.defaultFontColor,
          borderRadius: 0
        }
      },
      {
        elements : ['.navlist.type li.selected',
                    '.gallery-zone .background > .title',
                    '#screen_form input[type="submit"]',
                    '#pass_lost_f input[type="submit"]',
                    '.gallery-zone a.en-savoir-plus',
                    '#searchbutton'],
        styles: {
          backgroundColor: defaultCssValue.darkBackground,
          color: defaultCssValue.lightBackground
        }
      },
      {
        elements : ['a', '.navmain li a'],
        styles: {
          color: defaultCssValue.darkFontColor
        }
      },
      {
        elements : ['.list .gallery-zone .title-triangle.left'],
        styles: {
          borderColor: defaultCssValue.darkBackgroundShadow + ' ' + defaultCssValue.darkBackgroundShadow + ' transparent transparent'
        }
      },
      {
        elements : ['.list .gallery-zone .title-triangle.right'],
        styles: {
          borderColor: defaultCssValue.darkBackgroundShadow + ' transparent transparent ' + defaultCssValue.darkBackgroundShadow
        }
      },
      {
        elements : ['.gallery-zone .gallery-block'],
        styles: {
          borderRadius: 2,
          boxShadow: defaultCssValue.boxShadow
        }
      },
      {
        elements : ['.urgent'],
        styles: {
          color: defaultCssValue.urgentFontColor
        }
      },
      {
        elements : ['.between .type'],
        styles: {
          backgroundColor: defaultCssValue.lightBackground
        }
      },
      {
        elements : ['.list-lbc a'],
        styles: {
          display: 'block',
          margin: '10px'
        }
      },
      {
        elements : ['.navmain li'],
        styles: {
          lineHeight: '26px'
        }
      }, {
        elements : ['header', 'nav:first'],
        styles: {
          marginBottom: '25px'
        }
      }, {
        elements : ['header'],
        styles: {
          padding: '10px'
        }
      }, {
        elements : ['.led-header'],
        styles: {
          backgroundColor: defaultCssValue.mediumBackground
        }
      }, {
        elements : ['.lbc'],
        styles: {
          backgroundColor: '#FFF',
          borderRadius: 2,
          boxShadow: defaultCssValue.boxShadow,
          padding: '0 20px',
          border: 'none'
        },
        hover: {
          backgroundColor: '#FAFAFA',
          boxShadow: defaultCssValue.boxShadowHover
        }
      }
    ],

    offers : [],

    init : function() {
      this.offers = $('.list-lbc .lbc');
      this.redesignOffers();
      this.redesignHeader();
      
      for(var i=0; i<this.designElements.length; i++) {
        var element = this.designElements[i];
        $(element.elements.join(', ')).css(element.styles);
        
        if(element.hover !== undefined) {
          $(element.elements.join(', ')).on('mouseenter', function() {
            $(this).css(element.hover);
          }).on('mouseleave', function(){
            $(this).css(element.styles);
          });
        }
      }
    },

    redesignOffers : function() {
      this.offers.each(function(index, elt) {
        var current = $(elt);
        
        current.css({
          borderRadius: 2,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          padding: '0 20px',
          border: 'none'
        });
        
        var date = current.find('.date');
        var image = current.find('.image');
        var detail = current.find('.detail');
        var clear = current.find('.clear');
        
        date.css({
          width: 'auto',
          float: 'right'
        }).find('div').css({
          display: 'inline-block'
        });
        
        image.css({
          marginRight: 20
        }).find('.image-and-nb').css({
          backgroundColor: '#ecf0f1',
          width: 200,
          padding: '15px 0',
          textAlign: 'center'
        });
        
        current.html('');
        current.append(image).append(date).append(detail).append(clear);
      });
    },
    
    redesignHeader : function() {
      var header = $('#headermain');
      var nav = $('nav:first');
      
      header.remove();
      nav.remove();
      
      var newHeader = $('<div />');
      newHeader.addClass('led-header');
      newHeader.append(header).append(nav);
      
      $('#ContainerMain').css('padding-top', 0).prepend(newHeader);
    }
  };
};

var leboncoin = new LED();
leboncoin.init();