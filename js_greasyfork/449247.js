// ==UserScript==
// @name            TruyenFull downloader
// @name:vi         TruyenFull downloader
// @namespace       https://https://zalo.me/g/mzpssn207
// @description     Tải truyện tranh từ các trang chia sẻ ở Việt Nam. Nhấn Alt+Y để tải toàn bộ.
// @version         vip.1.1
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAe1BMVEUAAAD////MzMzBwcHp6enJycnOzs7g4OCzs7Oampr09PT8/Pz5+fnj4+PY2Njs7OzT09NWVlZ6enqsrKxzc3O5ubltbW2kpKQ5OTkxMTGCgoKenp4kJCRAQEBFRUUYGBhmZmYSEhJaWloqKiqSkpJNTU2KioofHx8TExNnZgGHAAAIVElEQVR4nO2c2WLbOAxFLcWSFcuS3bqdpmmbpm26/P8XjpZY5oJ7tcRG8oD7Np0Y1JFIACRBrlYmk8lkMplMJpPJZDKZTCaTyWQymUwmk8lkMplMJpPJZDKZTCaTyWQymV5L6+SsskygHha38B4b9dq7uSCVK5cw2eKHKRa3cMBGvfZUCNcJ1HZpA7+wzaRSJ9yQbnq/sIFbbHLvNa7zDclH3FyiAV+1fi/dkjGz0Ne8IxYz779UCJObHX6e4yL7H7HBff4KhLk39n2Vi+xje0ldvwJh7b9WX+8XmCfBcJf5r1OHsMpISKwXmCdvrMr2r0C4zzb4kZK72da/EmuH4G3qEG4z1k3n+xoSDLdZ6v+DDmGZsm46P69h8TV8mTqESZ75Ds7Xh5nGWTBM06AlJcI69cOwr8NM4yQYbrPAlWoRVlng4XzN9DUkzW1eZdCQEuE+CzuPp3m+hs0Ms2jEKxE2Hi4jb343yzbJctdZmgbtKBGWaZoRB5j8N8P0d2LnkKZhXFIiTPI0ZROMfIZpEgx3WeRK1QjrlIbE5Ndy046qZjCESb4WYds2y9w+Tbb8m1hpekrks7UIG2cajRDv/0+2XGAjjT9Ls3AqqkXYNc666WRfQybTzVCIXKkaYROo0pR106m+hgTDpG0j8mdahK0fT9PwH11N9DXEI7cjIU4s1AjbHkQzty+T7H4mFromovUSNcJKfMGOps2hSDDsBkL8EtUIuy7EMrfkcYpd0gvWXQuRN1Mj3Hbts8wtnWCWBcNupMeTNDXCztHRzC35O252JBhKMVePMO9eMYlmye24WfLzTUcYj3Q9wi4cx67O0XrUKguGObCvR1iNd9PHMatjwVCKR3qEz4/AMrdsxOgd+W3XRSTzeoS9J6ATjDFfMxYMhaxUk7DsH4FmbiO+ZiwYitMXPcLeFfBuyudQZJm0uumtC0mTImE/UvJPDPEds0mWSd8fkSvVJOwDVv70hRDSx8E/K1dFDlypJmHvTPNbtnGU/MAmSTD8eCIU+oci4XNadcs2/5InbJIEw9/PhIIr1STsnWlD+EgIcV5DPv1m9UwovQRFwt6ZNoTM62NfQ4Lh/YlQmn9qEtYnwkW+Bk+82j2BjlDMejUJu8y0JfxLCEvga0gwLAZCqXNoEu5PhCu2mfhHNkiC4cNAKIVaTcLtQLjA1+CZYbUaCKVFEk3C8jQOF/gaEgzvB0IxnmgSdispPeETIRQfCQfDfu+xIxSX8lQJ64GQ5TVSGRjZMywGQnkBQZWwdaY9IfU1QskpCYYPZ0Kx76sSrs+EPwmhUHKKg+FzzVhHKM5aVAm3Z8IVW5L6HVojwfDeIRT/QJWwdAj/EMKPoTUcDE81Di2hnNGrEraZ6YmQVYiGvuYHDoanWv+WUN4V0SWsHUKSpIS+hgTDU61RQwjWYnUJm2n+QMi2IAJfg4PhUJvaEspphC7h3iFkNRXJN9cW2TMcPnZLKC8A6RJuXULma7yjNDgYnmupWkJ5606XsHQJWQGeVwaGk9jzi2gIweKILmHjTB1CslXm+hoSDM+duSEEG8zKhLVL+EAInfJ27HSdPypytF+gTFhlDuGK7WGcPw8Ohs45hoYQdGZlwr1HeE8Ih5LTD/BP3MHaEIK1dGXCrUfItnSH0gwcDF2H24xD4LiUCcvUIzxiwlMXJMHQDZpFjtaZlQmT3COk9T/9n+Bg6J21KXJUq6NNWHuEK1ZCdEcNBeelihRNx7QJK58Qu5FnX4Nnyn4NVZGivECbcO0TrsaO0uBg6Nf3FymypE24DQiZr2lLTnFm5yXnzThEf6lNuAsIWXnFgc0MgzN9BQwq2oTJIahGYJuJdyQYBucyC+iz1AnrgPA/QnjESx1hrWYBV7bUCauwooT4mj3ehgvPERVwiqVOuA8JP2FCos8hIXxR6oS7kBBvJpY4bY3ODuO5pjphXPcEfQ3pv9H5bxw39QmjinW0mVji1Yv4rNvNGyKMzxoCkjWO9rENvNOjTxjfSAOmD2QFID5zigOnPmHconzVTIWHoXBuGL+Ot0AodrGSlEAJZ7/fOKE0RaqwBensyRsnFOtt5/iZt08YFy5UZPYvnQF764RRhl2SUmLxfgJ9QvwJxBbDgF2RSZV4xwQmXH5f2ojm5frB3kRJDkjJZ9wg4ZxT4vP0fd66iT+925BDbvKZaES49CqxKboDMwOZ0NtMLNlNKN/E3wPC8YNGLxHYxpYJvWKEzVw/gwj3E47DvUTyxh/wbc70Z8duJAJnvkXC3Yx7DJZJnBcBQueLb8gJN3SWViSUO/RFJW2fofg0PGOZkVOK6O4FiTAqrbqGhIkRIhzexob5ma/g1wLhnPtSXqB4tQzmGOdPiCf38L6lmHDJRXeLFC3bQ8Lj6RPOzWdaRYSgXPwaCid/kLAvXNhFV1k5wmf2Q8Lpd6VcQMFUFmfCdf8JF/iZiHDZhZqL5beOCe+7T8guXsB3gk1t40qaeq9vk8nUi/xMQHi9bBvpn5uEEcJjd9ET/oTE/7uESy7TfKk+O0OLEN4lG3YUmt0N4vzqutk20rdJhCt+ERHzj2fC/b9LP/w0nbNwRvjzwK4kYBOFgXCLsp6ra8jCqZ/LYEnFiP8YCBWybaTTljwlvD/gyT3NM0+EKtk20tMEwq9L8plWz4SPF3zeBfoyTrjCsYLnYT3h3KteL67jOCE+mcjvOO0Il97Rf0HdjBLCVciRPKUlnHZb2JWVjhKi8otH/rONeraNVI8RgpOJY/cqbuLDUq+l9dg1Oze7bayogmO2WT39vU5nutruhMlkMplMJpPJZDKZTCaTyWQymUwmk8lkMplMJpPJZDKZTCaTyWQymUymF+h//KpZ81bdLPYAAAAASUVORK5CYII=
// @author          trùm mod
// @license         MIT; https://baivong.mit-license.org/license.txt
// @match           https://truyenfull.vn/*/
// @match           https://truyenfull.net/*/
// @require         https://code.jquery.com/jquery-3.5.1.min.js
// @require         https://unpkg.com/jszip@3.1.5/dist/jszip.min.js
// @require         https://unpkg.com/file-saver@2.0.2/dist/FileSaver.min.js
// @require         https://unpkg.com/ejs@2.7.4/ejs.min.js
// @require         https://unpkg.com/jepub@2.1.4/dist/jepub.min.js
// @require         https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js?v=a834d46
// @noframes
// @connect         self
// @connect         8cache.com
// @supportURL      https://github.com/lelinhtinh/Userscript/issues
// @run-at          document-idle
// @grant           GM_xmlhttpRequest
// @grant           GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/449247/TruyenFull%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/449247/TruyenFull%20downloader.meta.js
// ==/UserScript==
 
(function ($, window, document) {
  'use strict';
 
  /**
   * Nhận cảnh báo khi có chương bị lỗi
   */
  var errorAlert = false;
 
  /**
   * Thời gian giãn cách giữa 2 lần tải
   * @type {Number}
   */
  var downloadDelay = 0;
 
  function cleanHtml(str) {
    str = str.replace(/\s*Chương\s*\d+\s?:[^<\n]/, '');
    str = str.replace(/[^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]+/gm, ''); // eslint-disable-line
    return '<div>' + str + '</div>';
  }
 
  function downloadError(mess, err, server) {
    downloadStatus('danger');
    if (errorAlert) errorAlert = confirm('Lỗi! ' + mess + '\nBạn có muốn tiếp tục nhận cảnh báo?');
    if (err) console.error(mess);
 
    if (server) {
      if (downloadDelay > 700) {
        if (chapTitle) titleError.push(chapTitle);
        saveEbook();
        return;
      }
 
      downloadStatus('warning');
      downloadDelay += 100;
      setTimeout(function () {
        getContent();
      }, downloadDelay);
      return;
    }
    if (!chapTitle) return;
    titleError.push(chapTitle);
 
    return '<p class="no-indent"><a href="' + referrer + chapId + '">' + mess + '</a></p>';
  }
 
  function beforeleaving(e) {
    e.preventDefault();
    e.returnValue = '';
  }
 
  function genEbook() {
    jepub
      .generate('blob', function (metadata) {
        $download.html('Đang nén <strong>' + metadata.percent.toFixed(2) + '%</strong>');
      })
      .then(function (epubZipContent) {
        document.title = '[⇓] ' + ebookTitle;
        window.removeEventListener('beforeunload', beforeleaving);
 
        $download
          .attr({
            href: window.URL.createObjectURL(epubZipContent),
            download: ebookFilename,
          })
          .text('Hoàn thành')
          .off('click');
        if (status !== 'danger') downloadStatus('success');
 
        saveAs(epubZipContent, ebookFilename);
      })
      .catch(function (err) {
        downloadStatus('danger');
        console.error(err);
      });
  }
 
  function saveEbook() {
    if (endDownload) return;
    endDownload = true;
    $download.html('Bắt đầu tạo EPUB');
 
    if (titleError.length) {
      titleError = '<p class="no-indent"><strong>Các chương lỗi: </strong>' + titleError.join(', ') + '</p>';
    } else {
      titleError = '';
    }
    beginEnd = '<p class="no-indent">Nội dung từ <strong>' + begin + '</strong> đến <strong>' + end + '</strong></p>';
 
    jepub.notes(beginEnd + titleError + '<br /><br />' + credits);
 
    GM.xmlHttpRequest({
      method: 'GET',
      url: ebookCover,
      responseType: 'arraybuffer',
      onload: function (response) {
        try {
          jepub.cover(response.response);
        } catch (err) {
          console.error(err);
        }
        genEbook();
      },
      onerror: function (err) {
        console.error(err);
        genEbook();
      },
    });
  }
 
  function getContent() {
    if (endDownload) return;
    chapId = chapList[count];
 
    $.get(pathname + chapId + '/')
      .done(function (response) {
        var $data = $(response),
          $chapter = $data.find('.chapter-c'),
          $notContent = $chapter.find('script, style, a'),
          $referrer = $chapter.find('[style]').filter(function () {
            return this.style.fontSize === '1px' || this.style.fontSize === '0px' || this.style.color === 'white';
          }),
          chapContent;
 
        if (endDownload) return;
 
        chapTitle = $data.find('.chapter-title').text().trim();
        if (chapTitle === '') chapTitle = 'Chương ' + chapId.match(/\d+/)[0];
 
        if (!$chapter.length) {
          chapContent = downloadError('Không có nội dung');
        } else {
          var $img = $chapter.find('img');
          if ($img.length)
            $img.replaceWith(function () {
              return '<br /><a href="' + this.src + '">Click để xem ảnh</a><br />';
            });
 
          if ($notContent.length) $notContent.remove();
          if ($referrer.length) $referrer.remove();
 
          if ($chapter.text().trim() === '') {
            chapContent = downloadError('Nội dung không có');
          } else {
            if (status !== 'danger') downloadStatus('warning');
            chapContent = cleanHtml($chapter.html());
          }
        }
 
        jepub.add(chapTitle, chapContent);
 
        if (count === 0) begin = chapTitle;
        end = chapTitle;
 
        $download.html('Đang tải <strong>' + count + '/' + chapListSize + '</strong>');
 
        count++;
        document.title = '[' + count + '] ' + pageName;
        if (count >= chapListSize) {
          saveEbook();
        } else {
          setTimeout(function () {
            getContent();
          }, downloadDelay);
        }
      })
      .fail(function (err) {
        chapTitle = null;
        downloadError('Kết nối không ổn định', err, true);
      });
  }
 
  var pageName = document.title,
    $download = $('<a>', {
      class: 'btn btn-primary',
      href: '#download',
      text: 'Tải xuống',
    }),
    status,
    downloadStatus = function (label) {
      status = label;
      $download.removeClass('btn-primary btn-success btn-info btn-warning btn-danger').addClass('btn-' + status);
    },
    $novelId = $('#truyen-id'),
    chapList = [],
    chapListSize = 0,
    chapId = '',
    chapTitle = '',
    count = 0,
    begin = '',
    end = '',
    endDownload = false,
    ebookTitle = $('h1').text().trim(),
    ebookAuthor = $('.info a[itemprop="author"]').text().trim(),
    ebookCover = $('.books img').attr('src'),
    ebookDesc = $('.desc-text').html(),
    ebookType = [],
    beginEnd = '',
    titleError = [],
    host = location.host,
    pathname = location.pathname,
    referrer = location.protocol + '//' + host + pathname,
    ebookFilename = pathname.slice(1, -1) + '.epub',
    credits =
      '<p>Truyện được tải từ <a href="' +
      referrer +
      '">TruyenFull</a></p><p>Userscript được viết bởi: <a href="https://lelinhtinh.github.io/jEpub/">Zzbaivong</a></p>',
    jepub;
 
  if (!$novelId.length) return;
 
  var $ebookType = $('.info a[itemprop="genre"]');
  if ($ebookType.length)
    $ebookType.each(function () {
      ebookType.push($(this).text().trim());
    });
 
  jepub = new jEpub();
  jepub
    .init({
      title: ebookTitle,
      author: ebookAuthor,
      publisher: host,
      description: ebookDesc,
      tags: ebookType,
    })
    .uuid(referrer);
 
  $download.insertAfter('.info');
  $download.wrap('<div class="panel-group books"></div>');
  $download.one('click contextmenu', function (e) {
    e.preventDefault();
    document.title = '[...] Vui lòng chờ trong giây lát';
 
    $.when(
      $.get('/ajax.php', {
        type: 'hash',
      }),
    )
      .done(function (res) {
        $.get('/ajax.php', {
          type: 'chapter_option',
          data: $novelId.val(),
          bnum: '',
          num: 1,
          hash: res,
        })
          .done(function (data) {
            chapList = data.match(/(?:value=")[^"]+(?=")/g).map(function (val) {
              return val.slice(7);
            });
 
            if (e.type === 'contextmenu') {
              $download.off('click');
              var startFrom = prompt('Nhập ID chương truyện bắt đầu tải:', chapList[0]);
              startFrom = chapList.indexOf(startFrom);
              if (startFrom !== -1) chapList = chapList.slice(startFrom);
            } else {
              $download.off('contextmenu');
            }
 
            chapListSize = chapList.length;
            if (chapListSize > 0) {
              window.removeEventListener('beforeunload', beforeleaving);
 
              $download.one('click', function (e) {
                e.preventDefault();
                saveEbook();
              });
 
              getContent();
            }
          })
          .fail(function (jqXHR, textStatus) {
            downloadError(textStatus);
          });
      })
      .fail(function (jqXHR) {
        $download.text('Lỗi danh mục');
        downloadStatus('danger');
        console.error(jqXHR);
      });
  });
})(jQuery, window, document);