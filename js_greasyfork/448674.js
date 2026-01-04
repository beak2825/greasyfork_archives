// ==UserScript==
//
// @name         CG Mod Tool
// @version      3.3
// @namespace    https://greasyfork.org/en/scripts/448674-cg-mod-tool
// @description  CG site enhancements
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAA81BMVEX8ngA1NTVHNTU5OTn8xmr9sTAmJiYQDw8OCQICAgGJVgBZSCspKSkWFhYUFBT8phMNDQ0GBgYSDAH4nAAzIAD9vlM0MzP8qh78oQccEgLaiQDUhQB3SgAhFAAIBQD8ukv9szcvLy8rKyskIyMjHx8cGBgLCwsnGgX1mgDpkgDDeQC4cwCsawBjPgBKLgBFKwA7JQDquGT9wl7CnFvlrVCoh1D9uUa+kUbYoUSEaj9FMzOtfjBgTi8+Li7soyc1JydvTxudbBlaQReEWxZZQBY6KhGlbRArHgjymADijgClZwCQWgCCUgBxRwBuRQBgPABTNACPosRbAAAAz0lEQVQY003P15aCQBAE0B5wYWYWEZCczDluNOec/f+vcQ561Hrre/qhCmLDAsdx/YkY7CHKR+wzzvNIEkt1eBMkKHoN3gQJxTb1ki8hOQW3/NpTfrG2nGuBXy27ESSmjps2vja6T68RpEsND+z/DnFIMYKU06iyvy6R8xI7kxVL16lbhpmSMRFsvfq5GZL2iVK8ips8HJuaKsqiGmJtYfRkCVSlIGQFOVgPxrb1/Ychl80gtqRVSQCAZfyAiXi2RL3s7o1SwLGM8uHh0dq+Ab5OFCX6Bp+jAAAAAElFTkSuQmCC
// @license      MIT
//
// @require      https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@43fd0fe4de1166f343883511e53546e87840aeaf/gm_config.js
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
//
// @include      http*://cinemageddon.net/browse*
//
// @connect      imdb.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @grant        GM.registerMenuCommand
//
// @downloadURL https://update.greasyfork.org/scripts/448674/CG%20Mod%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/448674/CG%20Mod%20Tool.meta.js
// ==/UserScript==
/*
//==============================================================================
//                         Version History:
//==============================================================================

3.3     -    Fixed: Broken script because IMDb redesigned the reference pages.

3.2     -    Adjusted the settings position to be more compatible with mobile browsers.
             Fix: Mark New Uploads didn't work on http (non-https).
             Fix: Mark New Uploads didn't work when URl has "browse.php?page=0".
             Note1: If you set IMDb to non-English site then the titles will be non-English too.
             Note2: The titles works properly only in English and(!) when IMDb is set to English titles & any English region at www.imdb.com/preferences/general

3.1     -    Added script's icon.

3.0     -    Mark if ID is New. [not-new IDs are cashed] [binoculars]
             Revamped whole code.

2.1     -    "TV" indicator for IMDb Titler.
             Fixed Mark New Uploads bug with bumped torrents.

2.0     -    IMDb Titler. [cashed]
             Settings.

1.0     -    Mark New Uploads (works only on the first page).

*/
//==============================================================================
//    Mark New Uploads.
//==============================================================================

async function startMarkNewUploads() {
  const last_up = await GM.getValue("LastUpload", 0);
  let new_last_up = last_up;
  if($('table>tbody>tr>td>a[href^="details.php?id="]').length !== 0) {
    $('table>tbody>tr>td>a[href^="details.php?id="]').each(function() {
      const elem = $(this);
      const x = parseInt($(this).attr('href').split('id=')[1]);
      if(x > last_up){
        if (x > new_last_up){
          new_last_up = x;
        }
        markNewUpload(elem);
      }
    });
  }
  if(new_last_up > last_up){
    GM.setValue("LastUpload", new_last_up);
  }
}

function markNewUpload(elem) {
  const img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAAAyAgMAAAB62o6EAAAACVBMVEUAmTP///8CAgIFPkSkAAAAfElEQVQoz+XTOwrEMAwE0HFh2AvoPmrcy6C5zx5n2VMmkZ3g/PpAphKvkEBC+B/ywxf7fF4ujqxCVoMg2SLs4rPkJhpiHtUmAAaxVepBJFWTNssvhdRBpEtRY5cSkou6N8kl+gySeCOJEGuCSyFtFAmJtZzlAfd6upw+bgKbBVevN/vTXAAAAABJRU5ErkJggg==";
  $(elem).parent().prev().find('img').attr('src', img);
}

//==============================================================================
//    IMDb Titler.
//==============================================================================

function startIMDbTitler() {
  if($('a[href^="http://www.imdb.com/title/tt"]').length !== 0) {
    let ii = -1;
    $('a[href^="http://www.imdb.com/title/tt"]').each(async function(i) {
      const elem = $(this);
      let x = $(this).attr('href');
      if(Boolean(x.match('%20')) || Boolean(x.match(' '))) {
        return;
      }
      x = x.match(/\/tt([0-9]+)/)[1].trim('tt');
      const titler = await GM.getValue("cg_tt" +x, "none");
      if(titler === "none") {
        ii = ii+1;
        setTimeout(function() {
	      getMovieTitle(elem, x);
        }, 1000 * ii);
      } else {
          addMovieTitle(elem, titler, x);
      }
    });
  }
}

function getMovieTitle(elem, x) {
  const url = "https://www.imdb.com/title/tt" +x+ "/reference";
  GM.xmlHttpRequest({
	url : url,
	method : "GET",
    timeout: 10000,
	onload : function(response) {
      if (response.status == 200) {
        const parser = new DOMParser();
        const result = parser.parseFromString(response.responseText, "text/html");

        const rawJsn   = $(result).find('[id=__NEXT_DATA__]:eq(0)').text();
        const parseJsn = JSON.parse(rawJsn);
        const title = htmlDecode(parseJsn.props.pageProps.aboveTheFoldData.titleText.text);
        let title_orig = htmlDecode(parseJsn.props.pageProps.aboveTheFoldData.originalTitleText.text);
        if (title == title_orig) {
          title_orig = "";
        }

        const year = $(result).find('title').text().replace(/^(.+) \((\D*|)(\d{4})(.*)$/gi, '$3');
        const is_tv = Boolean($(result).find('title').text().match('\\\(TV'));
        let titler = (is_tv) ? title+ " (" +title_orig+ ") [TV][" +year+ "]" : title+ " (" +title_orig+ ") [" +year+ "]";
            titler = titler.replace(' ()','');
        GM.setValue("cg_tt" +x, titler);
        addMovieTitle(elem, titler, x);
      } else {
        console.log("CG Mod Tool(IMDb Titler) (tt" +x+ "): HTTP " +response.status+ " Error.");
        CG_Mod_Tool__Generate_Not_Defined_Error_To_Stop_The_Script();
      }
    },
    onerror: function() {
      console.log("CG Mod Tool(IMDb Titler) (tt" +x+ "): Request Error.");
    },
    onabort: function() {
      console.log("CG Mod Tool(IMDb Titler) (tt" +x+ "): Request is aborted.");
    },
    ontimeout: function() {
      console.log("CG Mod Tool(IMDb Titler) (tt" +x+ "): Request timed out.");
    }
  });
}

function addMovieTitle(elem, titler, x) {
  const span = document.createElement("span");
        span.setAttribute("style","vertical-align:top; color:#009900; font-weight:bold");
        span.innerHTML = " " +titler;
  $(elem).after(span);
}

function htmlDecode(value) {
  return $("<textarea/>").html(value).text();
}

//==============================================================================
//    Mark if IMDb ID is New.
//==============================================================================

function startMarkNewID() {
  if($('a[href^="browse.php?search=tt"]').length !== 0) {
    let ii = -1;
    $('a[href^="browse.php?search=tt"]').each(async function(i) {
      const imdb = $(this).parent().find('.sc-imdb').attr('href');
      if(Boolean(imdb.match('%20')) || Boolean(imdb.match(' '))) {
        return;
      }
      const elem = $(this);
      const x = $(this).attr('href').split('=tt')[1];
      const number = await GM.getValue("cg_bb" +x, 1);
      if(number < 2) {
        ii = ii+1;
        setTimeout(function() {
          searchCG(elem, x);
        }, 600 * ii);
      } else {
          markBinoculars(elem, number, x);
      }
    });
  }
}

function searchCG(elem, x) {
  const url = "https://cinemageddon.net/browse.php?search=tt" +x;
  GM.xmlHttpRequest({
	url : url,
	method : "GET",
    timeout: 15000,
	onload : function(response) {
      if (response.status == 200) {
        const parser = new DOMParser();
        const result = parser.parseFromString(response.responseText, "text/html");
        const xxx = $(result).find('.torrenttable').find('tbody>tr').length;
        const yyy = $(result).find('.torrenttable').find('.sc-imdb');
        let negative = 0;
        yyy.each(function() {
          const imdb = $(this).attr('href');
          if(Boolean(imdb.match('%20')) || Boolean(imdb.match(' '))) {
            negative = negative +1;
          }
        });
        const number = xxx - negative;
        if (number > 1) {
          GM.setValue("cg_bb" +x, number);
          markBinoculars(elem, number, x);
        } else {
          markBinoculars(elem, number, x);
        }
      } else {
        console.log("CG Mod Tool(CG Search) (tt" +x+ "): HTTP " +response.status+ " Error.");
        CG_Mod_Tool__Generate_Not_Defined_Error_To_Stop_The_Script();
      }
    },
    onerror: function() {
      console.log("CG Mod Tool(CG Search) (tt" +x+ "): Request Error.");
    },
    onabort: function() {
      console.log("CG Mod Tool(CG Search) (tt" +x+ "): Request is aborted.");
    },
    ontimeout: function() {
      console.log("CG Mod Tool(CG Search) (tt" +x+ "): Request timed out.");
    }
  });
}

function markBinoculars(elem, number, x) {
    const img_red   = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAA51BMVEUAAABUAgL0JCJHAwA9AwMAAACZBgASAAD/Rk2qAAA1AAUBAQFAAAD/JSD/JSD/Bwf/SEQHAAMfBQC6AABlAAamDAAfBQA3AAVRAAZyAAB/BgAXCwD5AAYrAAcrAAf/XlrkAAD/IyHrAAACAAD/NzT/ExPeAAWfAABxAAD/h4f/cHP/KSXJBQJgAAL1BwDbBgD/dnL/cmv/XV3/SUUMAgN+AAPyDADvBwDPAACNAAAvAAD/YWH/T0//Ly//Lib/EAr/CQneCwD3BwBFBwBpBgA7BgDoAADWAAC6AACUAABIAAAcAAAUAAC1oAXSAAAAIHRSTlMA/QTVDQT8/Pr57u7l5OLi4eDb2tXDw7WoqKd6SDAaCML/ZHEAAACnSURBVBjTjczFEsIwAATQlBZ3d0iqqTsV3PX/v4fkwHCEPezMvsOC/1JbIuCj9hfqzg1AsfqZ17WkY5BcLDziyJxPEDood96w9Z0yJpBpeFG0WRVEtDekZpYA8nloG4xCOhYoFEMFm5VpPz2mzzL97OqqKw7BYKu5Yo9CbqHKcQewlibDPIWEAGRASSIQUAgtB/Imx0oe5AUK+GQyj/Os9QoEgcDvvAGlUhUDNZNK3QAAAABJRU5ErkJggg==";
    const img_green = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAw1BMVEUAAAACaQACWQAFDAABUwIAJwMAIgMLtAABMAABAQEFHQAGIwADngAAkQMDngAAswMCAgIAEQgAZwQGNwAAXAoAEQgAHwUHPwAMLAABRgAADQYDigAAGAAAGAAEvgACegEBAgEAfwMAoQIBhQIEPgEIlwAAiAcAwgQAggQAqAMAJQIE2AANywAIgQACbwACNQAAfQMAtwIDTgIBkwEEzAAEyAADrAADogABngAFcgAERQABGgAAZwQAsQMCdgABLgAMLAAHmqc3AAAAH3RSTlMABP7+/tUN+vnu7uXk4uLh4Nva1cPDtaiop3pIMBoI6K4FRwAAAKFJREFUGNONydUSgzAURdFLKNTdNSQEd7fa/39VQ2c6fWW/nXWgWzODwoOu/jBN70DyyW8+La1gEJs6O8oCwO1cUhX1TB/TBJ34L8wNVaVR3yqxry0EDjTyCPZfyCS4UlpANWLB+LJr7EYccoBN4WTWHg6Jm+Vb4PVUB1drkHQXh2ILMYdwACPNxURpodZT4gWypBnE+wJjwdu2r0tR4UGHPlWaEotimlI6AAAAAElFTkSuQmCC";
  if (number < 2) {
    $(elem).find('img').attr('src', img_red);
  } else {
    $(elem).find('img').attr('src', img_green);
  }
}


//============================================================================//
//================================  MAIN  ====================================//
//============================================================================//


//==============================================================================
//    Settings Menu (GM_config)
//==============================================================================

var config_fields = {
  'aftertitle': {
    'section': ' ',
    'label': ' &nbsp',
    'type': 'hidden'
  },
  'mark_new_uploads': {
    'type': 'checkbox',
    'label': 'Mark new uploads?',
    'default': true
  },
  'imdb_titler': {
    'type': 'checkbox',
    'label': 'Get titles & year from IMDb?',
    'default': true
  },
  'search_same_id': {
    'type': 'checkbox',
    'label': "Mark if IMDb ID is new (binoculars)?",
    'default': true
  }
};

//==============================================================================
//    Initialize and register GM_config
//==============================================================================

GM_config.init({
  'id': 'cg_mod_tool',
  'title': 'CG Mod Tool Settings',
  'fields': config_fields,
  'css': `.field_label { \
             display:         flex !important; \
             align-items:   center !important; \
             font-weight:   normal !important;}\
          .config_var { \
             margin-top:       2px !important; \
             margin-bottom:    2px !important; \
             display:         flex !important; \
             align-items:   center !important;}\
          #cg_mod_tool_aftertitle_var { \
             margin-top:       0px !important; \
             margin-bottom:    0px !important;}\
          input { \
             margin-top:       0px !important; \
             margin-bottom:    0px !important;}\
          .grey_link { \
             margin-left:      4px !important;}\
          #cg_mod_tool_section_header_0 { \
             font-weight:     bold !important; \
             border:           0px !important; \
             margin-top:       0px !important; \
             background:   #bfbfbf !important;}\
          #cg_mod_tool_header { \
             background:     black !important; \
             color:          white !important;}\
          #cg_mod_tool_section_0 { \
             margin-top:       0px !important;}`,
  'events':
  {
    'open': function() {
      // Iframe position.
      this.frame.style.top    = '50px';
      this.frame.style.left   = 'auto';
      this.frame.style.right  = '20px';
      this.frame.style.height = '40%';
      this.frame.style.width  = '350px';

      const modVersion = 'CG Mod Tool v' + GM.info.script.version;
      const modUrl = 'https://greasyfork.org/en/scripts/448674-cg-mod-tool';
      $('#cg_mod_tool').contents().find('#cg_mod_tool_section_header_0').append($('<a href="'+modUrl+'" target ="_blank">'+modVersion+'</a>'));
      $('#cg_mod_tool').contents().find('#cg_mod_tool_section_header_0').find('a').css({
       'text-decoration': 'none',
       'color': '#cb0000'
      });
    },
    'close': function() {
      location.reload();
    }
  }
});

GM.registerMenuCommand('CG Mod Tool Settings', function() {GM_config.open();});

//==============================================================================
//    Starts.
//==============================================================================

async function startCGModTool() {
  const onFirstBrowsePage = Boolean(location.href === "https://cinemageddon.net/browse.php"
                                 || location.href === "http://cinemageddon.net/browse.php"
                                 || location.href === "https://cinemageddon.net/browse.php?page=0"
                                 || location.href === "http://cinemageddon.net/browse.php?page=0");

  if(onFirstBrowsePage && GM_config.get('mark_new_uploads')) {
    startMarkNewUploads();
  }
  if(GM_config.get('imdb_titler')) {
    startIMDbTitler();
  }
  if(GM_config.get('search_same_id')) {
    startMarkNewID();
  }
}

startCGModTool();