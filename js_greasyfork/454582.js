// ==UserScript==
//
// @name         Imgbox Tweaker
// @version      2.1
// @namespace    https://github.com/Purfview/Imgbox-Tweaker
// @description  Adds custom formatted links, working Copy to clipboard buttons, menu pre-select for 1-click uploading, links centering.
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAKlBMVEUAAQH9cgMYEAs2Hg1VLRB6PhCdTRG+WQrTZRSyWhrfZwbnbQ/ucxb+eRkNjKAWAAADwElEQVRIx72TSY8SQRTHn90NqLcn0ECrSdm0GOXS0IhLPLTCjFtMugUxGk3AGYjLBVwYozFR1IneHHG9ycHowYtrYryo0cSr28VP46sqG3GcmZPxl3R3Vde/6i31HvxnlLFytzxWZfOtjw9QkKjMvf0gDnkx13oDhyyfefi3ma34m1gEJ2evr8G7mFjfOju9b2qqa/rJ0iw/1EGMjqgLW+lWB1OeZf9pYIWJxOOJ4qNzIhYXnNF17XMvjILrKPFAc0cEuRSoTadQ3r3CvoSEsFYaCRF7yl4xqsIGsT5p07H2bxdXuuuSwYkNHqf4W4eA1XH1KRqtKXFK5ixO870MXg4tXGovRY7RZHxaZqZZ7LqwNUhnCD0/dRSJJAjCPzq4Ig+RwEZYh6QNRX6P0qVPGcQPCqjLgiCj6hH6rCXFGWY51iC25GqVWQAJkPg3yDADZYbHv5tbusVdASgHWfBAOcFz9w51x0JceRO2TwrnXOljkoE6/ibFwCpToJuulyCDCV54kQdCsHQ54ybIyBBT2dinqXZRzLK6tCTeTalgist/HZGCOB+bYyp9VTEuFb3TYs9zGWWMj48bHf2XQEVE+hLy7T+jl70E8Ts5rIs/iD3gLrWEoNMmm/vZ+n02JTUpG2gfExXVDQSqvpqujgSLDVmWZlpkaSoQRFB/At1bDLIkcGytFtLDVROgJitkGW+KpIaDj5AjQaFgWzXjddMDOCcFUcghxhal7rfMDjeRvYstNJ64wWX4MViMqGfr6ngBKavK4CDWZG3kZU/E6RR9vLntfiXM41fOb8aJAV6mpSvDVKsuPH29F3wUmdSO2TtLfNCTXSPrYowBzMR8Vx4rKkT15KjjBne4OhrBm78F4boc7uiLT3qaiuHaR1HxkiztlDYUvqOITK7l4vTmvXk0OGwmL/7gw6oNKtuKwvnFnvoNJGyt6/Besqhx7xx9u6MCRCEDkYvD1rInSLAewClsM7kUKtB04DCDIa+AHNRkh1N4J0vK5YpCloY0bFKvivPcKtsUtwmL+94Sb0SQW2ZR2F+1WEZt++oXgMMbvQMwQhjTdD4LvT3sxPa4Lii3m9oNGMWPpoVLO/N9iwbrltuH4A8i6EyMTC8cWfoV/qSB6ELolJyse6+ttGcJQoht2MKzvQ1Wo9vpwWw2Ypuek6DpsDW5S4e/2fIeVmHcisShkcD6HALFhnVonN0Vh3u1PszNGkSDBKYJ8xBGxEEU5l2HEBcsg/lRyUTjBizAAI37bCGBj0YeFiKHy2FBtOlJ+Nf8BCbnsb61BX21AAAAAElFTkSuQmCC
// @license      MIT
//
// @homepage     https://github.com/Purfview/Imgbox-Tweaker
// @supportURL   https://github.com/Purfview/Imgbox-Tweaker/issues
//
// @compatible   firefox
// @compatible   opera
// @compatible   chrome
// @compatible   safari
// @compatible   edge
//
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@43fd0fe4de1166f343883511e53546e87840aeaf/gm_config.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
//
// @include      https://imgbox.com/
// @include      https://imgbox.com/upload/edit/*
// @include      https://imgbox.com/gallery/edit/*
//
// @grant        GM_registerMenuCommand
// @grant        GM.registerMenuCommand
//
// @run-at       document-start
//
// @downloadURL https://update.greasyfork.org/scripts/454582/Imgbox%20Tweaker.user.js
// @updateURL https://update.greasyfork.org/scripts/454582/Imgbox%20Tweaker.meta.js
// ==/UserScript==
/*
//==============================================================================
//                         Version History:
//==============================================================================

2.1     -    New feature: Works when logged in.

2.0     -    Major script rewrite.
             Namespace change.
             New feature: Settings menu.
             New feature: Pre-select menu for 1-click uploading.
             New feature: After upload auto-load into 'edit' page to get Copy buttons.
             New feature: All Copy buttons are working.
             New feature: Fully working centering option.
             New feature: Support for classic Greasemonkey.

1.1     -    Fixed: The script was breaking the upload page.

1.0     -    New feature: Working Copy buttons.
             Added an icon for the script.

0.0.4   -    Disabled centering for BBCode boxes (can be enabled with a variable below).

0.0.3   -    Fixed: the script wasn't working with the current imgbox.

0.0.2   -    Last version from SMz before his disappearance.

*/
//==============================================================================


/**
 * Sets array elements into placeholders of a pattern.
 * @param {string} Base pattern. Placeholders as {%i} for the i-th replacement
 *        array.
 * @param {...string[]} Replacement sources for the pattern. The first array
 *        will set the returned array length.
 * @return {string[]} Replaced pattern elements.
 */
function createPatternedArray() {
  var pattern = arguments[0];
  var modArray = [];
  for (var i = 0; i < arguments[1].length; i++) {
    modArray[i] = pattern;
  }
  for (var j = 1; j < arguments.length; j++) {
    for (var k = 0; k < modArray.length; k++) {
      var replacement = arguments[j][k] || '';
      modArray[k] = modArray[k].split('{%' + j + '}').join(replacement);
    }
  }
  return modArray;
}


function copyInfoToClipboard(collect) {
  document.body.insertBefore(collect,document.body.firstChild);
  collect.focus();
  collect.select();
  const x = document.execCommand('copy');
  document.body.removeChild(collect);
}


function startObserver() {
  const obscfg = { attributes: true };
  const obs = new MutationObserver(preselectMenus);
  obs.observe($('#upload-form')[0], obscfg);
}


function preselectMenus(mutation, observer) {
  observer.disconnect();
  console.log("Imgbox Tweaker: '#upload-form' mutation detected. Starting preselectMenus().");

  // Content preselect
  let content_index;
  const content_val = GM_config.get('menu_content');
  if (content_val === 'Family Safe Content' ) { content_index = 1;
  } else if (content_val === 'Adult Content') { content_index = 2;
  } else                                      { content_index = 0;
  }
  $('#dropdown-content-type').find('option[selected="selected"]').removeAttr("selected");
  $('#dropdown-content-type option:eq('+content_index+')').attr('selected', "selected");
  $('button[data-id="dropdown-content-type"]>.filter-option').text(content_val);
  $('.dropdown-menu.inner.selectpicker:eq(0)').find('li').removeAttr('class');
  $('.dropdown-menu.inner.selectpicker:eq(0)').find('li:eq('+content_index+')').addClass("selected");

  // Thumbnail preselect
  let thumb_index;
  const thumb_val = GM_config.get('menu_thumb');
  if        (thumb_val.match('100x100 pixel \\(square\\)' )) { thumb_index =  0;
  } else if (thumb_val.match('150x150 pixel \\(square\\)' )) { thumb_index =  1;
  } else if (thumb_val.match('200x200 pixel \\(square\\)' )) { thumb_index =  2;
  } else if (thumb_val.match('250x250 pixel \\(square\\)' )) { thumb_index =  3;
  } else if (thumb_val.match('300x300 pixel \\(square\\)' )) { thumb_index =  4;
  } else if (thumb_val.match('350x350 pixel \\(square\\)' )) { thumb_index =  5;
  } else if (thumb_val.match('500x500 pixel \\(square\\)' )) { thumb_index =  6;
  } else if (thumb_val.match('800x800 pixel \\(square\\)' )) { thumb_index =  7;
  } else if (thumb_val.match('100x100 pixel \\(resized\\)')) { thumb_index =  8;
  } else if (thumb_val.match('150x150 pixel \\(resized\\)')) { thumb_index =  9;
  } else if (thumb_val.match('200x200 pixel \\(resized\\)')) { thumb_index = 10;
  } else if (thumb_val.match('250x250 pixel \\(resized\\)')) { thumb_index = 11;
  } else if (thumb_val.match('300x300 pixel \\(resized\\)')) { thumb_index = 12;
  } else if (thumb_val.match('350x350 pixel \\(resized\\)')) { thumb_index = 13;
  } else if (thumb_val.match('500x500 pixel \\(resized\\)')) { thumb_index = 14;
  } else if (thumb_val.match('800x800 pixel \\(resized\\)')) { thumb_index = 15;
  }
  $('#thumbnail-option').find('option[selected="selected"]').removeAttr("selected");
  $('#thumbnail-option option:eq('+thumb_index+')').attr('selected', "selected");
  $('button[data-id="thumbnail-option"]>.filter-option').text(thumb_val);
  $('.dropdown-menu.inner.selectpicker:eq(1)').find('li').removeAttr('class');
  $('.dropdown-menu.inner.selectpicker:eq(1)').find('li:eq('+thumb_index+')').addClass("selected");

  // Comments preselect
  let comment_index;
  const comment_val = GM_config.get('menu_comment');
  if (comment_val === 'Enable Comments') { comment_index = 0;
  } else                                 { comment_index = 1;
  }
  $('#comments-option').find('option[selected="selected"]').removeAttr("selected");
  $('#comments-option option:eq('+comment_index+')').attr('selected', "selected");
  $('button[data-id="comments-option"]>.filter-option').text(comment_val);
  $('.dropdown-menu.inner.selectpicker:eq(2)').find('li').removeAttr('class');
  $('.dropdown-menu.inner.selectpicker:eq(2)').find('li:eq('+comment_index+')').addClass("selected");


  // Check if logged in [Gallery preselect is not supported there]
  if ($('.icon-comments').length) {
    console.log("Imgbox Tweaker: Login detected. Skiping 'Gallery preselect'.");
    return;
  }

  // Gallery preselect
  let gallery_index;
  const gallery_val = GM_config.get('menu_gallery');
  if (gallery_val === 'Create a New Gallery') { gallery_index = 0;
  } else                                      { gallery_index = 1;
  }
  $('#gallery-option').find('option[selected="selected"]').removeAttr("selected");
  $('#gallery-option option:eq('+gallery_index+')').attr('selected', "selected");
  $('button[data-id="gallery-option"]>.filter-option').text(gallery_val);
  $('.dropdown-menu.inner.selectpicker:eq(3)').find('li').removeAttr('class');
  $('.dropdown-menu.inner.selectpicker:eq(3)').find('li:eq('+gallery_index+')').addClass("selected");
  if (gallery_index === 1) {$('.new-gallery-title-input-container').addClass("hidden");}
}


function startImboxTweaker() {
  // Upload menu-select page
  if (GM_config.get('preselect_menu')) {
    if ($('#upload-form').length === 1) {
      console.log("Imgbox Tweaker: '#upload-form' detected. Starting MutationObserver.");
      startObserver();
    }
  }

  // Upload result page
  if ($('#codes-full').length === 1) {

    // Check if logged in [there is no Edit page and no Copy butons]
    let not_login = true;
    if ($('.icon-comments').length) {
      not_login = false;
    }

    // Go to "upload edit" page to see Copy buttons
    if (!Boolean(location.href.match('\\/edit\\/')) && not_login) {
      console.log("Imgbox Tweaker: Restarting into 'upload edit' page.");
      const edithref = $('div.text-right a').text();
      window.location.replace(edithref +'?#');
      return;
    }
    console.log("Imgbox Tweaker: Upload result page detected. Starting tweaks.");

    // Display all available outputs
    $('#codes-full').show().css('visibility', 'visible')
      .insertBefore('#codes-thumb');
    $('#codes-thumb').show().css('visibility', 'visible');

    // Extract direct links to full images and thumbs
    var links = [];
    $($('#code-html-full').text()).find('img').each(function() {
      links.push($(this).attr('src'));
    });

    var thumbs = [];
    $($('#code-html-thumb').text()).find('img').each(function() {
      thumbs.push($(this).attr('src'));
    });

    // Modify the existing outputs and titles, display all options
    $('#code-link-full')
      .text(links.join('\n'))
      .prev('div').children('span').text('Full size plain');

    if(GM_config.get('centered_links')){
      $('#code-html-full')
        .text('<center>' +createPatternedArray('<img src="{%1}">', links).join('\n\n') +'</center>')
        .prev('div').children('span').text('Full size HTML');
    } else {
      $('#code-html-full')
        .text(createPatternedArray('<img src="{%1}">', links).join('\n\n'))
        .prev('div').children('span').text('Full size HTML');
    }

    if(GM_config.get('centered_links')){
      $('#code-bb-full')
        .text('[center]' +createPatternedArray('[img]{%1}[/img]', links).join('\n\n') +'[/center]')
        .prev('div').children('span').text('Full size BBCode');
    } else {
      $('#code-bb-full')
        .text(createPatternedArray('[img]{%1}[/img]', links).join('\n\n'))
        .prev('div').children('span').text('Full size BBCode');
    }

    $('#code-link-thumb')
      .text(thumbs.join('\n'))
      .prev('div').children('span').text('Thumbs plain');

    if(GM_config.get('centered_links')){
      $('#code-html-thumb')
        .text('<center>' +createPatternedArray('<a href="{%1}" target="imgbox-full-size"><img src="{%2}"></a>', links, thumbs).join('\n\n') +'</center>')
        .prev('div').children('span').text('Linked thumbs HTML');
    } else {
      $('#code-html-thumb')
        .text(createPatternedArray('<a href="{%1}" target="imgbox-full-size"><img src="{%2}"></a>', links, thumbs).join('\n\n'))
        .prev('div').children('span').text('Linked thumbs HTML');
    }

    if(GM_config.get('centered_links')){
      $('#code-bb-thumb')
        .text('[center]' +createPatternedArray('[url={%1}][img]{%2}[/img][/url]', links, thumbs).join('\n\n') +'[/center]')
        .prev('div').children('span').text('Linked thumbs BBCode');
    } else {
      $('#code-bb-thumb')
        .text(createPatternedArray('[url={%1}][img]{%2}[/img][/url]', links, thumbs).join('\n\n'))
        .prev('div').children('span').text('Linked thumbs BBCode');
    }

    // Fix Copy to clipboard buttons
    let buttons = $('.clipboard-button');
    if (buttons.length > 2 && not_login) {
      buttons.each(function() {
        const elem = $(this);
        let collect_id, collect_txt;
        if (elem.attr("data-clipboard-text")) {
          collect_txt = elem.attr("data-clipboard-text")
        } else {
          collect_id  = elem.attr("data-clipboard-target");
          collect_txt = $('#' +collect_id).text();
        }
        let collect = document.createElement("textarea");
            collect.innerHTML+=collect_txt;
        elem.click(function() {
          copyInfoToClipboard(collect);
        });
      });
    }
  }
}

//==============================================================================
//    Settings Menu (GM_config)
//==============================================================================

var config_fields = {
  'aftertitle': {
    'section': ' ',
    'label': ' &nbsp',
    'type': 'hidden'
  },
  'centered_links': {
    'type': 'checkbox',
    'label': 'Enable centering on links?',
    'default': false
  },
  'preselect_menu': {
    'type': 'checkbox',
    'label': 'Enable the pre-select menu feature?',
    'default': true
  },
  'menu_content': {
    'section': 'Pre-select menu:',
    'type': 'select',
    'options': ['SELECT CONTENT TYPE', 'Family Safe Content', 'Adult Content'],
    'default': 'Family Safe Content'
  },
  'menu_thumb': {
    'type': 'select',
    'options': ['100x100 pixel (square)', '150x150 pixel (square)', '200x200 pixel (square)', '250x250 pixel (square)', '300x300 pixel (square)', '350x350 pixel (square)', '500x500 pixel (square)', '800x800 pixel (square)', '100x100 pixel (resized)', '150x150 pixel (resized)', '200x200 pixel (resized)', '250x250 pixel (resized)', '300x300 pixel (resized)', '350x350 pixel (resized)', '500x500 pixel (resized)', '800x800 pixel (resized)'],
    'default': '100x100 pixel (resized)'
  },
  'menu_comment': {
    'type': 'select',
    'options': ['Enable Comments', 'Disable Comments'],
    'default': 'Disable Comments'
  },
  'menu_gallery': {
    'type': 'select',
    'options': ['Create a New Gallery', 'Do Not Create a Gallery'],
    'default': 'Do Not Create a Gallery'
  },
};

//==============================================================================
//    Initialize and register GM_config
//==============================================================================

GM_config.init({
  'id': 'imgbox_tweaker',
  'title': 'Imgbox Tweaker Settings',
  'fields': config_fields,
  'css': `#imgbox_tweaker_section_header_1 { \
             background:   #00ab00 !important; \
             color:          black !important; \
             font-weight:     bold !important; \
             border:           0px !important; \
             padding-left:     0px !important; \
             text-align:    middle !important;}\
          .field_label { \
             display:         flex !important; \
             align-items:   center !important; \
             font-weight:   normal !important;}\
          .config_var { \
             margin-top:       2px !important; \
             margin-bottom:    2px !important; \
             display:         flex !important; \
             align-items:   center !important;}\
          #imgbox_tweaker_aftertitle_var { \
             margin-top:       0px !important; \
             margin-bottom:    0px !important;}\
          input { \
             margin-top:       0px !important; \
             margin-bottom:    0px !important;}\
          .grey_link { \
             margin-left:      4px !important;}\
          #imgbox_tweaker_section_header_0 { \
             font-weight:     bold !important; \
             border:           0px !important; \
             margin-top:       0px !important; \
             background:   #bfbfbf !important;}\
          #imgbox_tweaker_header { \
             background:     black !important; \
             color:          white !important;}\
          #imgbox_tweaker_section_0 { \
             margin-top:       0px !important;}`,
  'events':
  {
    'open': function() {
      // Iframe position.
      this.frame.style.top    = '50px';
      this.frame.style.left   = 'auto';
      this.frame.style.right  = '150px';
      this.frame.style.height = '50%';
      this.frame.style.width  = '450px';

      $('#imgbox_tweaker').contents().find('input#imgbox_tweaker_field_ignore_list').attr('size', '47');

      const modVersion = 'Imgbox Tweaker v' + GM.info.script.version;
      const modUrl = 'https://greasyfork.org/en/scripts/454582-imgbox-tweaker';
      $('#imgbox_tweaker').contents().find('#imgbox_tweaker_section_header_0').append($('<a href="'+modUrl+'" target ="_blank">'+modVersion+'</a>'));
      $('#imgbox_tweaker').contents().find('#imgbox_tweaker_section_header_0').find('a').css({
       'text-decoration': 'none',
       'color': '#cb0000'
      });
    },

    'close': function() {
      location.reload();
    }
  }
});

GM.registerMenuCommand('Imgbox Tweaker Settings', function() {GM_config.open();});

window.addEventListener('DOMContentLoaded', startImboxTweaker);
