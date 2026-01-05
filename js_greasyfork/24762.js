// ==UserScript==
// @name          Dmhy Download Enhance
// @namespace     kind.stranger
// @version       0.2.2
// @description   在下载列表中增加magnet列和torrent列
// @include       http*://share.dmhy.org/
// @include       http*://share.dmhy.org/topics/list*
// @grant         none
// @author        Anonymous
// @license       GPL version 3 (http://www.gnu.org/licenses/gpl.txt)

// @downloadURL https://update.greasyfork.org/scripts/24762/Dmhy%20Download%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/24762/Dmhy%20Download%20Enhance.meta.js
// ==/UserScript==

if (window.jQuery) {
  var $ = window.jQuery;
} else {
  console.log('Do Not support jQuery');
  return false;
}

$.fn.tagNameLowerCase = function() {
  return this.prop ? this.prop('tagName').toLowerCase() : this.attr('tagName').toLowerCase();
}

// http://99jty.com/?p=587
// http://ejohn.org/blog/comparing-document-position/
if (!$.contains) {
  $.contains = function(a, b) {
    return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16);
  };
}

var basePage = {};
basePage = (function() {
  var torrentList = $('#topic_list');
  var torrentRows = torrentList.find('tr');
  var theadRows = torrentList.find('>thead tr');
  var tbodyRows = torrentList.find('>tbody tr');
  var thead = torrentList.find('>thead');
  var tbody = torrentList.find('>tbody');

  /**
   * Get the current <tr> of the first element in the set
   * @param target DOM or jQuery object(s)
   * @return currentRow A jQuery object
   */
  function getCurrentRow(target) {
    var $ele = $($(target)[0]);

    if (!$.contains(thead[0], $ele[0]) &&
        !$.contains(tbody[0], $ele[0])) {
      return false;
    }
    if ($ele.tagNameLowerCase() === 'tr') {
      return $ele;
    }

    var currentRow = $ele.parent();
    while (currentRow.tagNameLowerCase() !== 'tr') {
      currentRow = currentRow.parent();
    }

    return currentRow;
  }

  /**
   * Get the title <td> of the first element in the set 
   * @param target DOM or jQuery object(s)
   * @return titleCol A jQuery object
   */
  // TODO : a more reasonable way to find col
  function getTitleCol(target) {
    var $row = getCurrentRow(target);
    if (!$row) {
      return false;
    }
    return $row.find('>:eq(2)');
  }

  /**
   * Get the magnet <td> of the first element in the set
   * @param target DOM or jQuery object(s)
   * @return magnetCol A jQuery object
   */
  // TODO : a more reasonable way to find col
  function getMagnetCol(target) {
    var $row = getCurrentRow(target);
    if (!$row) {
      return false;
    }
    return $row.find('>:eq(3)');
  }

  /**
   * Get the title anchor's link of the first element in the set
   * @param target DOM or jQuery object(s)
   * @return link String
   */
  function getTitleLink(target) {
    var $title = getTitleCol(target);
    if (!$title ||
        !$title.hasClass('title')) {
      return false;
    }

    return $title.find('a[href ^= "/topics/view/"][href $= ".html"]').attr('href');
  }
  
  return {
    //property
    'torrentList'   :   torrentList,
    'torrentRows'   :   torrentRows,
    'theadRows'     :   theadRows,
    'tbodyRows'     :   tbodyRows,
    //method
    'getCurrentRow' :   getCurrentRow,
    'getTitleCol'   :   getTitleCol,
    'getMagnetCol'  :   getMagnetCol,
    'getTitleLink'  :   getTitleLink,
  };
})();

var preparePage = {};
preparePage =(function() {
  var bp          = basePage;
  var theadRows   = bp.theadRows;
  var tbodyRows   = bp.tbodyRows;
  var torrentRows = bp.torrentRows;
  var exists = {  // module existence
    'torrent'     : false,
    'magnet'      : false,
  };

  function exist(search) {
    if (search in exists) {
      return exists[search];
    } else {
      return false;
    }
  }

  // module: Appearance Components
  /**
   * Add a new Magnet Column
   */
  function addMagnetCol() {
    var magnetTitle = bp.getMagnetCol(theadRows).clone();
    $(magnetTitle).attr('id', 'magnetTitle');
    $(magnetTitle).find(':first-child').text('Magnet');

    var magnetArrow = bp.getMagnetCol(tbodyRows).clone();
    $(magnetArrow).addClass('dde-magnet');
    $(magnetArrow).find(':first-child')
                  .attr('href', '#')
                  .attr('title', 'Magnet')
                  .text('M');

    torrentRows.each(function(index) {
      var oldMagnetCol = bp.getMagnetCol(this);
      if (index === 0) {
        oldMagnetCol.after(magnetTitle);
      } else {
        oldMagnetCol.after(magnetArrow.clone());
      }
    });

    exists.magnet = true;

    return true;
  }

  /**
   * Add a new Torrent Column
   */
  function addTorrentCol() {
    var torrentTitle = bp.getMagnetCol(theadRows).clone();
    $(torrentTitle).attr('id', 'torrentTitle');
    $(torrentTitle).find(':first-child').text('Torrent');

    var torrentArrow = bp.getMagnetCol(tbodyRows).clone();
    $(torrentArrow).addClass('dde-torrent');
    $(torrentArrow).find(':first-child')
                  .attr('href', '#')
                  .attr('title', 'Torrent')
                  .text('T');

    torrentRows.each(function(index) {
      var oldMagnetCol = bp.getMagnetCol(this);
      if (index === 0) {
        oldMagnetCol.after(torrentTitle);
      } else {
        oldMagnetCol.after(torrentArrow.clone());
      }
    });

    exists.torrent = true;

    return true;
  }

  /**
   * Get the newadd-magnet <td> of the first element in the set
   * @param target DOM or jQuery object(s)
   * @return newaddMagnetCol A jQuery object
   */
  function getMagnetCol(target) {
    if (!exist('magnet')) {
      return false;
    }

    var $row = bp.getCurrentRow(target);
    if (!$row) {
      return false;
    }

    return  $row.find('> .dde-magnet') ?
            $row.find('> .dde-magnet') :
            $row.find('#magnetTitle');
  }

  /**
   * Get the newadd-torrent <td> of the first element in the set
   * @param target DOM or jQuery object(s)
   * @return newaddTorrentCol A jQuery object
   */
  function getTorrentCol(target) {
    if (!exist('torrent')) {
      return false;
    }

    var $row = bp.getCurrentRow(target);
    if (!$row) {
      return false;
    }

    return  $row.find('> .dde-torrent') ?
            $row.find('> .dde-torrent') :
            $row.find('#torrentTitle');
  }

  /**
   * Get the newadd-torrent's download arrow(<a>) of the first element in the set
   * @param target DOM or jQuery object(s)
   * @return newaddTorrentArrow A jQuery object
   */
  function getTorrentArrow(target) {
    var torrrentCol = getTorrentCol(target);
    if (!torrrentCol ||
        !torrrentCol.hasClass('dde-torrent')) {
      return false;
    }

    return torrrentCol.find(':first-child');
  }

  /**
   * Get the newadd-magnet's download arrow(<a>) of the first element in the set
   * @param target DOM or jQuery object(s)
   * @return newaddMagnetArrow A jQuery object
   */
  function getMagnetArrow(target) {
    var magnetCol = getMagnetCol(target);
    if (!magnetCol || 
        !magnetCol.hasClass('dde-magnet')) {
      return false;
    }

    return magnetCol.find(':first-child');
  }

  /**
   * Get or set the newadd-magnet's href attribute of the first element in the set
   * @param target DOM or jQuery object(s), specify which magnetAnchor to find
   * @param href A value to set for magnet's "href" attribute
   * @return
   */
  function magnetHref(target, href) {
    var magnetAnchor = getMagnetArrow(target);
    if (!magnetAnchor) {
      return false;
    }

    if (href === undefined) {
      return magnetAnchor.attr('href');
    } else {
      magnetAnchor.attr('href', href);
    }

    return true;
  }

  /**
   * Get or set the newadd-torrent's href attribute of the first element in the set
   * @param target DOM or jQuery object(s), specify which torrentAnchor to find
   * @param css object literal to set css
   * @return
   */
  function torrentHref(target, href) {
    var torrentAnchor = getTorrentArrow(target);
    if (!torrentAnchor) {
      return false;
    }

    if (href === undefined) {
      return torrentAnchor.attr('href');
    } else {
      torrentAnchor.attr('href', href);
    }

    return true;
  }

  /**
   * Get or set the newadd-torrent's css of the first element in the set
   * @param target DOM or jQuery object(s), specify which torrentAnchor to find
   * @param css object literal to set css
   * @return
   */
  function setTorrentCss(target, style) {
    var torrentArrow = getTorrentArrow(target);
    if (!torrentArrow ||
        !torrentArrow.hasClass('arrow-magnet')) {
      return false;
    }
    torrentArrow.css(style);
    return true;
  }

  /**
   * Get or set the newadd-magnet's css of the first element in the set
   * @param target DOM or jQuery object(s), specify which magnetAnchor to find
   * @param css object literal to set css
   * @return
   */
  function setMagnetCss(target, style) {
    var magnetArrow = getMagnetArrow(target);
    if (!magnetArrow ||
        !magnetArrow.hasClass('arrow-magnet')) {
      return false;
    }

    magnetArrow.css(style);
    return true;
  }

  // var torrentArrows = $('.dde-torrent > a'); WRONG: if <code>addTorrentCol</code> is not execute first, this will get an empty object

  function getTorrentTitle() {
    return exist('torrent') ? $('#torrentTitle') : false;
  }

  function getMagnetTitle() {
    return exist('magnet') ? $('#magnetTitle') : false;
  }

  function getTorrentArrows() {
    return exist('torrent') ? $('.dde-torrent > a') : false;
  }

  function getMagnetArrows() {
    return exist('magnet') ? $('.dde-magnet > a') : false;
  }


  return {
    //module
    'addTorrentCol'     :   addTorrentCol,
    'addMagnetCol'      :   addMagnetCol,
    // getter
    'getTorrentTitle'   :   getTorrentTitle,
    'getMagnetTitle'    :   getMagnetTitle,
    'getTorrentArrows'  :   getTorrentArrows,
    'getMagnetArrows'   :   getMagnetArrows,
    //method
    'getMagnetCol'      :   getMagnetCol,
    'getTorrentCol'     :   getTorrentCol,
    'getTorrentArrow'   :   getTorrentArrow,
    'getMagnetArrow'    :   getMagnetArrow,
    'magnetHref'        :   magnetHref,
    'torrentHref'       :   torrentHref,
    'setTorrentCss'     :   setTorrentCss,
    'setMagnetCss'      :   setMagnetCss,
  };
})();

var prepaerEvent = {};
prepaerEvent = (function() {
  var bp            = basePage;
  var pp            = preparePage;
  // origin css: background: url("/images/icons.gif") no-repeat scroll -17px -40px rgba(0, 0, 0, 0);
  var SuccCss = {
    'background-position' : '0px -40px',
  }
  var FailCss = {
    'background-position' :  '-34px -40px',
  }

  function responsedataToTorrentLink(data) {
    var reg = /dl\.dmhy\.org.*\.torrent/;
    var matchs = reg.exec(data);
    var torrentLink = 'http://' + matchs[0];
    return matchs[0] ? torrentLink : '';
  }

  function hashTomagnetLink(hash) {
    var magnetLink = 'magnet:?xt=urn:btih:' + hash
    return hash ? magnetLink : '';
  }

  function torrentLinkToHash(torrentLink) {
    var hashStart = torrentLink.lastIndexOf('/');
    var hashEnd   = torrentLink.lastIndexOf('.');
    var hash      = torrentLink.slice(hashStart + 1, hashEnd);
    return hash ? hash : '';
  }

  /**
   * onmouseover: 
   *  change torrent link if exist and is NOT changed
   *  TRY to change magnet link if exist
   *  change css after change link successfully
   */
  function addTorrentMouseOver() {
    var torrentArrows = pp.getTorrentArrows();
    if (!torrentArrows) {
      return false;
    }

    torrentArrows.mouseover(function(event) {
      var target  = this;
      
      if (!pp.torrentHref(target) ||
          pp.torrentHref(target) !== '#') { // not a valid target OR torrent link is set
        return;
      }

      var requestLink = bp.getTitleLink(target);
      if (!requestLink) {
        return false;
      }

      // every time a ajax response is received, program will TRY to process BOTH magnet AND torrent link
      $.get(requestLink, function(data) {
        var torrentLink = responsedataToTorrentLink(data);
        if (! torrentLink) {return;}
        pp.torrentHref(target, torrentLink) && pp.setTorrentCss(target, SuccCss);

        if (pp.magnetHref(target) &&
            pp.magnetHref(target) === '#') {
          var magnetLink  = hashTomagnetLink(torrentLinkToHash(torrentLink));
          if (!magnetLink) {return false;}
          pp.magnetHref(target, magnetLink) && pp.setMagnetCss(target, SuccCss);
        }
      });

      event.stopPropagation();
    });
  }

  /**
   * onmouseover: 
   *  change magnet link if exist and is NOT changed
   *  TRY to change torrent link if exist
   *  change css after change link successfully
   */
  function addMagnetMouseOver() {
    var magnetArrows = pp.getMagnetArrows();
    if (!magnetArrows) {
      return false;
    }

    magnetArrows.mouseover(function(event) {
      var target  = this;

      if (!pp.magnetHref(target) ||
          pp.magnetHref(target) !== '#') {  //not a valid target OR magnet link is set
        return ;
      }

      var requestLink = bp.getTitleLink(target);
      if (!requestLink) {
        return false;
      }

      // every time a ajax response is received, program will TRY to process BOTH magnet AND torrent link
      $.get(requestLink, function(data) {
        var torrentLink = responsedataToTorrentLink(data);
        var magnetLink  = hashTomagnetLink(torrentLinkToHash(torrentLink));
        if (!torrentLink || !magnetLink) {return false;}
        pp.magnetHref(target, magnetLink) && pp.setMagnetCss(target, SuccCss);

        if (pp.torrentHref(target) &&
            pp.torrentHref(target) === '#') {
          pp.torrentHref(target, torrentLink) && pp.setTorrentCss(target, SuccCss);
        }       
      });

      event.stopPropagation();
    });
  }

  return {
    'addTorrentMouseOver'   :   addTorrentMouseOver,
    'addMagnetMouseOver'    :   addMagnetMouseOver,
  }
})();

// TODO add configuration options and a controller
$(document).ready(function() {
  preparePage.addTorrentCol();
  preparePage.addMagnetCol();
  
  prepaerEvent.addTorrentMouseOver();
  prepaerEvent.addMagnetMouseOver();
});