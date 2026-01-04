// ==UserScript==
// @name         Erome Sort by views + Infinite Scroll
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Sort by views. Infinite scroll. Only videos mode. Hide photos. Tags below title
// @author       ricaroal
// @match        *://*.erome.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=erome.com
// @run-at       document-idle
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/528378/Erome%20Sort%20by%20views%20%2B%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/528378/Erome%20Sort%20by%20views%20%2B%20Infinite%20Scroll.meta.js
// ==/UserScript==
/* globals $ LazyLoad */

    $(document).ready(function() {
        // CSS que deseas añadir
        var css = `
.album .album-bottom-right, .album .album-bottom-views {
    text-shadow: 3px 0 #000, -3px 0 #000, 0 3px #000, 0 -3px #000,
             1px 1px #000, -1px -1px #000, 1px -1px #000, -1px 1px #000;
    font-size: 20px;
    font-weight: bold;
}

#tabs {
  display:none;
}

.page-content h1 {
  margin-bottom:30px;
}
        `;
        // Añadir el CSS al documento
        var style = $('<style></style>').text(css);
        $('head').append(style);
    });

  $("#tabs").first().css("display", "flex");
  $(".page-content h1").first().css("margin-bottom", "10px");

  const etiquetasBottom = $(".mt-10");
  const userprofileTop = $(".user-profile");
  if (etiquetasBottom.length && userprofileTop.length) {
    etiquetasBottom.insertAfter(userprofileTop);
  }
  const spanElement = $('<span>Tags: </span>');
  $('p.mt-10').prepend(spanElement);
  $('p.mt-10').css('font-size', '20px');

  if ($('.user-profile').length === 0) {
    const orderByViews = $('<button id="order-by-views">Order by views</button>').css({
      'float': 'right',
      'color': '#eb6395',
        'background-color': 'black',
        'padding': '7px',
        'font-size': '17px'
    });
    $('h1').append(orderByViews);
  }


setInterval(function() {
  $('div#page .page-content.row').addClass('albumes');
}, 1000);



    $(document).ready(function() {
      // Function to convert formatted views to complete numbers
      function convertViews(views) {
        if (views.includes('K')) {
          return parseFloat(views.replace('K', '').replace(',', '.')) * 1000;
        }
        return parseInt(views.replace(',', ''));
      }

      // Event listener for the button
      $('#order-by-views').click(function() {

// MODIFICACION SCRIPT
    // Select all albumes divs
    const albumesDivs = $('.albumes');
    // If there are no albumes divs or only one, no need to merge
    if (albumesDivs.length <= 1) {
        return;
    }
    // Get the first albumes div
    const mainAlbumesDiv = albumesDivs.first();
    // Loop through all albumes divs except the first one
    albumesDivs.slice(1).each(function() {
        // Get all album divs inside the current albumes div
        const albumDivs = $(this).find('.album');
        // Append each album div to the first albumes div
        albumDivs.appendTo(mainAlbumesDiv);
        // Remove the current albumes div
        $(this).remove();
    });
// MODIFICACION SCRIPT

        // Iterate over each span element with the class 'album-bottom-views' and convert views
        $('.album-bottom-views').each(function() {
          const $this = $(this);
          const viewsText = $this.text().trim().replace(/[^\d,K]/g, ''); // Extract the views text
          const completeViews = convertViews(viewsText); // Convert views to complete number
          $this.html('<i class="fa fa-eye"></i>' + completeViews.toLocaleString()); // Update the span content
        });

        // Get all child divs with the class 'album' and sort them based on the number of views
        const $albums = $('.albumes').children('.album').sort(function(a, b) {
          const viewsA = convertViews($(a).find('.album-bottom-views').text().trim().replace(/[^\d,k]/g, ''));
          const viewsB = convertViews($(b).find('.album-bottom-views').text().trim().replace(/[^\d,k]/g, ''));
          return viewsB - viewsA; // Sort in descending order
        });

        // Append the sorted albums back to the parent container
        $('.albumes').append($albums);
      });
    });


(function disableDisclaimer() {
    if (!$('#disclaimer').length) return;
    $.ajax({ type: 'POST', url: '/user/disclaimer', async: true });
    $('#disclaimer').remove();
    $('body').css('overflow', 'visible');
})();

const PINK = '#eb6395';
const GREY = '#a09f9d';

function isActiveColor(condition) { return condition ? PINK : GREY; };

function togglePhotoElements() {
    document.querySelectorAll('.media-group > div:last-child:not(.video)').forEach(a => {
        $(a.parentElement).toggle(config.showPhotos);
    });
    $('#togglePhotos').css('backgroundColor', isActiveColor(config.showPhotos));
    $('#togglePhotos').text(!config.showPhotos ? 'show photos' : 'hide photos');
}

function hidePhotoOnlyAlbums() {
    $('div[id^=album]').filter((_, e) => !$(e).find('.album-videos').length).toggle(config.showPhotoAlbums);
    $('#togglePhotoAlbums').css('color', isActiveColor(!config.showPhotoAlbums));
    window.dispatchEvent(new Event('scroll'));
}

function infiniteScrollAndLazyLoading() {
    if (!document.querySelector('.pagination')) return;

    const url = new URL(window.location.href);

    const nextPageUrl = () => {
        url.searchParams.set('page', nextPage);
        return url.href;
    }

    let nextPage = parseInt(url.searchParams.get('page')) || 2;
    const limit = parseInt($('.pagination li:last-child()').prev().text()) || 50;

    const infinite = $('#page').infiniteScroll({ path: nextPageUrl, append: '.page-content', scrollThreshold: 800 });

    $('#page').on('append.infiniteScroll', () => {
        hidePhotoOnlyAlbums();
        new LazyLoad();
        nextPage++;
        if (nextPage > limit) infinite.destroy();
    });
}

/******************************************* STATE ***********************************************/

const config = {
    showPhotos: true,
    showPhotoAlbums: false
}

function sync() {
    Object.assign(config, JSON.parse(localStorage.getItem("config")));
}

function save() {
    localStorage.setItem("config", JSON.stringify(config));
}

//=================================================================================================

const IS_ALBUM_PAGE = /^\/a\//.test(window.location.pathname);

function pageAction() {
    sync();
    if (IS_ALBUM_PAGE) {
        togglePhotoElements();
    } else {
        hidePhotoOnlyAlbums();
    }
}

if (IS_ALBUM_PAGE) {
    $('#user_name').parent().append('<button id="togglePhotos" class="btn btn-pink">show/hide photos</button>');
    $('#togglePhotos').on('click', () => {
        config.showPhotos = !config.showPhotos;
        togglePhotoElements();
        save();
    });
} else {
    infiniteScrollAndLazyLoading();
    $('.navbar-nav').append('<li><a href="#" id="togglePhotoAlbums">video only</span></a></li>');
    $('#togglePhotoAlbums').on('click', () => {
        config.showPhotoAlbums = !config.showPhotoAlbums;
        hidePhotoOnlyAlbums();
        save();
    });
}

window.addEventListener('focus', pageAction);
pageAction();
