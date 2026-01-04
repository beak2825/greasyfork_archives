// ==UserScript==
// @name         GBookDown - Download Google Books
// @description  Saves all available Preview pages from a Google Book as PNGs
// @author       nikisby
// @namespace    nikisby
// @include      https://books.google.*/books*
// @version      1.2
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/379049/GBookDown%20-%20Download%20Google%20Books.user.js
// @updateURL https://update.greasyfork.org/scripts/379049/GBookDown%20-%20Download%20Google%20Books.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function () {
  var css = [
    '#savePNG {',
    '    position: fixed;',
    '    padding: 7px;',
    '    background-color: #F8EEB1;',
    '    border: 2px solid #333;',
    '    border-radius: 6px;',
    '    z-index: 9999;',
    '    font-size: 18px;',
    '    right: 30px;',
    '    bottom: 20px;',
    '    color: #000;',
    '    width: 650px;',
    '    text-align: center;',
    '    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 0, 0, 0.3);',
    '}',
    '#savePNG button {',
    '    font-size: 18px;',
    '    width: 100px;',
    '    cursor: pointer;',
    '}',
    '#savePNG input {',
    '    width: 60px;',
    '    font-size: 18px;',
    '    text-align: center;',
    '}'
  ].join('\n');
  if (typeof GM_addStyle != 'undefined') {
    GM_addStyle(css);
  } else if (typeof PRO_addStyle != 'undefined') {
    PRO_addStyle(css);
  } else if (typeof addStyle != 'undefined') {
    addStyle(css);
  } else {
    var node = document.createElement('style');
    node.type = 'text/css';
    node.appendChild(document.createTextNode(css));
    var heads = document.getElementsByTagName('head');
    if (heads.length > 0) {
      heads[0].appendChild(node);
    } else {
      // no head yet, stick it whereever
      document.documentElement.appendChild(node);
    }
  }
}) ();

var html = '<div id="savePNG">' +
    '<span>There are max </span> ' +
    '<input type="text" id="total" value="---" readonly> ' +
    '<span>pages available. Input the page range to download </span> ' +
    '<input type="text" id="count" value="0"> ' +
    '<input type="text" id="max" value="1"> ' +
    '<span>.</span> ' +
    '<button>Start</button>' +
    '</div>';

$('body').prepend(html);

$('#count').select();

var title, id, zipfile, zipname;
var zipflag = false;
var next = true;
var zip = new JSZip();
var pids = [];

$('#savePNG button').click(function(){
  doTheMagic();
})

$("#count").keyup(function(event){
    if(event.keyCode == 13){
        $("#savePNG button").click();
    }
});

function addIMG(url, name, count) {
  var filename = name + '.png';
  GM_xmlhttpRequest({
    method: 'GET',
    synchronous: true,
    url: url,
    overrideMimeType: 'image/png; charset=x-user-defined',
    onload: function (response) {
      $('#savePNG button').prop('disabled', true).text('Working…');
      $('#count').val(count);
      $('#count').css('font-weight', 'normal').css('text-decoration', 'none');
      zip.file(filename, response.responseText, {
        binary: true
      });
    }
  });
}

function saveZip(count, number) {
  zipname = title + '_' + id + '_' +
    pad(count, number.toString().length) +
    '_' + number + '.zip';
  zipfile = zip.generate({
    type: 'blob'
  });
  $('#savePNG button').prop('disabled', false).text('Start');
  saveAs(zipfile, zipname);
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

function doTheMagic() {
  $('#savePNG button').prop('disabled', true);
  var href = window.location.href;
  var domain = href.split('/') [2];

  id = href.match(/id=([^&]+)/) [1];
  title = $('title').text().split(' - ')[0].replace(/\s+/g,'_');

  var pid = 'PP1';
  var count = parseInt($('#count').val());
  var max = parseInt($('#max').val());

  var url = 'https://' + domain + '/books?id=' + id + '&lpg=' + pid + '&pg=' + pid + '&jscmd=click3';

  $.ajax({
    dataType: 'json',
    async: false,
    url: url,
  }).done(function (data) {
    pids = $.map(data.page, function (val, i) {
      if (i > 3) {
        return val.pid;
      }
    });
  });

  var number = pids.length;
  $('#total').val(number);

  if (count >= number) {
    alert('Wrong number of pages. There are only ' + number + ' available.');
    $('#savePNG button').prop('disabled', false);
  } else {
    var i = count;
    var timer = setInterval(function () {

      if (i == max ||  i == number) {
        clearInterval(timer);
        alert('Downloaded every available page out of '+ number + ' total. Saving…');
        saveZip(i, number);
        return false;
      }

      var url = 'https://' + domain + '/books?id=' + id + '&lpg=' + pids[i] + '&pg=' + pids[i] + '&jscmd=click3';

      $.ajax({
        dataType: 'json',
        async: false,
        url: url,
      }).done(function (data) {
        if (data.page[0].hasOwnProperty('src') || data.page[0].flags == 8) {
          var url = data.page[0].src + '&w=1600';
          var name = pad((i+1), number.toString().length) + '_' + pids[i];

          if (data.page[0].flags == 8) {
            $('#count').val(i + 1);
            $('#count').css('font-weight', 'bold').css('text-decoration', 'line-through');
          } else {
            addIMG(url, name, (i + 1));
          }
          i++;

        } else {
          clearInterval(timer);
          alert('Can\'t download more.\n' +
                'Saving ' + i + ' out of ' + number + ' pages…\n' +
                'Change your IP and continue!');
          saveZip(i, number);
        }
      });
    }, 400);
  }
}
