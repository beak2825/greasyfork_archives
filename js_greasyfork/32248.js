// ==UserScript==
// @name           RED: FLAC Upload Quick Buttons
// @description    Adds buttons to quickly set release type / format / media for FLAC uploads
// @author         mrpoot
// @version        0.4
// @match          https://redacted.sh/upload.php*
// @grant          none
// @run-at         document-end
// @namespace      https://greasyfork.org/users/148773
// @downloadURL https://update.greasyfork.org/scripts/32248/RED%3A%20FLAC%20Upload%20Quick%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/32248/RED%3A%20FLAC%20Upload%20Quick%20Buttons.meta.js
// ==/UserScript==
  
(() => {
    
  // constants (probably shouldn't edit these)
    
  const FORMAT = {
    FLAC: 'FLAC',
    MP3: 'MP3',
    // unsed, but maybe you want them:
    AAC: 'AAC',
    AC3: 'AC3',
    DTS: 'DTS',
  };
    
  const MEDIA = {
    CD: 'CD',
    WEB: 'WEB',
    VINYL: 'Vinyl',
    // unsed, but maybe you want them:
    DVD: 'DVD',
    SOUNDBOARD: 'Soundboard',
    SACD: 'SACD',
    DAT: 'DAT',
    CASSETTE: 'Cassette',
    BLURAY: 'Blu-Ray',
  };
    
  const BITRATE = {
    LOSSLESS: 'Lossless',
    LOSSLESS_24: '24bit Lossless',
    MP3_V0: 'V0 (VBR)',
    MP3_320: '320',
    // unused, but maybe you want them:
    MP3_192: '192',
    MP3_APS: 'APS (VBR)',
    MP3_V2: 'V2 (VBR)',
    MP3_V1: 'V1 (VBR)',
    MP3_256: '256',
    MP3_APX: 'APX (VBR)',
    OTHER: 'Other',
  };
    
  // okay, start editing here if you want to: 
    
  // set PERFECT to true to automatically add perfect 3(/4) transcodes:
  // MP3 V0 + MP3 320 (+ FLAC 16-bit for 24-bit flacs)
  // if set to false, you'll need to click some buttons to add transcodes
    
  const PERFECT = false;
    
  // Comment/uncomment these to personal taste:
    
  const releaseTypes = [
    { name: 'Album',       val: 1 },
    { name: 'EP',          val: 5 },
    { name: 'Single',      val: 9 },
    { name: 'Compilation', val: 7 },
    { name: 'Soundtrack',  val: 3 },
    { name: 'DJ Mix',      val: 19 },
    { name: 'Mixtape',     val: 16 },
    // { name: 'Anthology',   val: 6 },
    // { name: 'Live album',  val: 11 },
    // { name: 'Remix',       val: 13 },
    // { name: 'Bootleg',     val: 14 },
    // { name: 'Interview',   val: 15 },
    // { name: 'Demo',        val: 17 },
    // { name: 'Concert Recording', val: 18 },
    // { name: 'Unknown',     val: 21 },
  ];
    
  // You should probably stop editing here, but I won't stop you.
    
  const quickLinks = [
    {
      name: 'CD FLAC',
      format: FORMAT.FLAC,
      media: MEDIA.CD,
      bitrate: BITRATE.LOSSLESS,
    },
    {
      name: 'Web FLAC',
      format: FORMAT.FLAC,
      media: MEDIA.WEB,
      bitrate: BITRATE.LOSSLESS,
    },
    {
      name: 'Web FLAC (24 bit)',
      format: FORMAT.FLAC,
      media: MEDIA.WEB,
      bitrate: BITRATE.LOSSLESS_24,
    },
    {
      name: 'Vinyl FLAC',
      format: FORMAT.FLAC,
      media: MEDIA.VINYL,
      bitrate: BITRATE.LOSSLESS,
    },
    {
      name: 'Vinyl FLAC (24 bit)',
      format: FORMAT.FLAC,
      media: MEDIA.VINYL,
      bitrate: BITRATE.LOSSLESS_24,
    },
  ];
    
  // You should really stop editing from here on out though!
    
  const quickMultiFormat = [
    {
      name: 'FLAC (16 bit)',
      format: FORMAT.FLAC,
      bitrate: BITRATE.LOSSLESS,
    },
    {
      name: 'MP3 (320)',
      format: FORMAT.MP3,
      bitrate:  BITRATE.MP3_320,
    },
    {
      name: 'MP3 (V0)',
      format: FORMAT.MP3,
      bitrate: BITRATE.MP3_V0,
    },
  ];
    
  $('head').append(`<style type="text/css" id="flac_quickbutton_styles">
  body .flac_quickbutton:disabled {
    font-weight: bold;
    background: transparent;
    border-color: transparent;
    text-decoration: underline;
  }
  </style>`);
    
  quickLinks.reduce((before, { name, format, media, bitrate }) => {
    const newRow = $(`<tr class="flac_quickbutton_row"><td class="label">${name}:</td></tr>`);
    const buttonContainer = $('<td></td>');
    releaseTypes.forEach(({ name: releaseType, val }) => buttonContainer.append(`
      <input
        class="flac_quickbutton"
        type="button"
        value="${releaseType}"
        data-releasetype="${val}"
        data-format="${format}"
        data-media="${media}"
        data-bitrate="${bitrate}"
      />
    `));
    newRow.append(buttonContainer);
    before.after(newRow);
    return newRow;
  }, $('tr#edition_catalogue_number'))
  .after(`
    <tr class="flac_quickbutton_row"><td class="label">
        Quick Buttons:
    </td><td>
      <input
        class="flac_quickbutton_reset"
        type="button"
        value="Manual Mode"
      />
      This will restore the original dropdowns and remove quick buttons.
    </td></tr>
  `)
  .after($('#placeholder_row_top, #placeholder_row_bottom'))
  .after(`
    <tr class="flac_quickbutton_row"><td class="label">
      Multi-Format:
    </td><td>
    ${
      quickMultiFormat.map(({ name, format, bitrate }) => 
        `<input
          class="flac_quickbutton_add"
          type="button"
          value="Add ${name}"
          data-format="${format}"
          data-bitrate="${bitrate}"
        />`
      ).join(' ')
    }
    <input
      class="flac_quickbutton_remove"
      type="button"
      value="Remove"
    />
    </td></tr>
  `)
  .after($('#upload_logs'));
    
    
  $(document).delegate('.flac_quickbutton', 'click', ({ target }) => {
    const $target = $(target);
    const {
      releasetype,
      format,
      media,
      bitrate
    } = $target.data();
    
    $('#releasetype').val(releasetype);
    $('#format').val(format);
    $('#bitrate').val(bitrate);
    $('#media').val(media);
    
    $('.flac_quickbutton').attr('disabled', false);
    $target.attr('disabled', true);
    
    if (media === MEDIA.CD) {
      Format();
    } else {
      $('#upload_logs').ghide();
    }
    
    if (PERFECT) {
      while (window.buttonCount > 1) {
        window.removeRow();
      }
      quickMultiFormat.forEach((option) => {
        if (format !== option.format || bitrate !== option.bitrate) {
          addExtraFormat(option);
        }
      })
    }
  });
    
  const addExtraFormat = ({ format, bitrate }) => {
    window.createRow();
    
    const lastFormatRow = $('[id^="extra_format_row"]:last');
    lastFormatRow.find('select[id^="format"]').val(format);
    lastFormatRow.find('select[id^="bitrate"]').val(bitrate);
  };
    
  $(document).delegate('.flac_quickbutton_add', 'click', ({ target }) => {
    const $target = $(target);
    const data = $target.data();
    if (data) {
      addExtraFormat(data);
    }
  });
    
  $('.flac_quickbutton_remove').bind('click', () => {
    window.removeRow();
  });
    
  $('.flac_quickbutton_reset').bind('click', () => {
    $('.flac_quickbutton_row').remove();
    $('#flac_quickbutton_styles').remove();
    
    $('#releasetype').closest('tr').show();
    $('#format').closest('tr').show();
    $('#bitrate').closest('tr').show();
    $('#media').closest('tr').show();
    $('#add_format').closest('tr').show();
    
    $('#add_format').closest('tr').after(
      $('#placeholder_row_top, [id^="extra_format_row"], #placeholder_row_bottom')
    );
    
    $('#bitrate_row').after($('#upload_logs'));
  });
    
  $('#releasetype').closest('tr').hide();
  $('#format').closest('tr').hide();
  $('#bitrate').closest('tr').hide();
  $('#media').closest('tr').hide();
  $('#add_format').closest('tr').hide();
    
})();
