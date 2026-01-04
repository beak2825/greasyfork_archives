// ==UserScript==
// @name         PornPics Enhancer
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2.0.1
// @description  A framework to integrate various porn gallery sites - providing the ultimate porn gallery browsing experience.
// @match        https://www.pornpics.com/*
// @match        https://www.pichunter.com/*
// @match        https://yespornpics.com/*
// @match        https://babesource.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ncga.com
// @grant        GM_xmlhttpRequest
// @grant        GM.addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.3.7/umd/photoswipe.umd.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/masonry/4.2.2/masonry.pkgd.min.js
// @connect      pornpics.com
// @connect      pichunter.com
// @connect      yespornpics.com
// @connect      babesource.com
// @downloadURL https://update.greasyfork.org/scripts/464883/PornPics%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/464883/PornPics%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const cornpics_url = 'https://www.pornpics.com/cornpics/';
    if (location != cornpics_url) {
        location = cornpics_url;
    }

    GM.addStyle(`
@import url('https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.3.7/photoswipe.min.css');

html {
  scroll-behavior: smooth;
}

.next-button#fb-button {
  display: block;
}

.pswp img {
  object-fit: contain;
}

.site-select {
  padding: 0 3px;
  text-align: center;
}

.grid {
  margin: 0 auto;
}

.grid-item {
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 3px;
}

.gallery-title {
  color: #5a5a5a;
  flex-grow: 0;
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
  padding: 0 10px;
}

.dark .gallery-title {
  color: #cfcfcf;
}

.grid-item img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 5px;
  cursor: pointer;
}

.gallery-title-container {
  display: flex;
  justify-content: center;
}

.gallery-title {
  white-space: nowrap;
  overflow-x: auto;
}

.gallery-title::-webkit-scrollbar {
  display: none;
}

.info-row {
  display: flex;
  align-items: center;
  margin: 2px 0;
}

.info-title {
  white-space: nowrap;
  color: #5a5a5a;
  font-size: 20px;
  margin: 0 3px 0 5px;
}

.dark .info-title {
  color: #cfcfcf;
}

.info-button-container {
  display: flex;
  overflow-x: auto;
}

.info-button-container::-webkit-scrollbar {
  display: none;
}

.info-button {
  white-space: nowrap;
  background-color: #676767;
  border-radius: 3px;
  color: #fff;
  margin: 0 1px;
  padding: 3px;
  transition: background-color 0.3s ease;
}

.info-button:hover {
  background-color: #4d4d4d;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
`);

    class BaseSite {
        constructor() {
            $('base').remove();
            $('.site-var-container').remove();
        }
        get_inputs() {}
        get_url() {}
        parse_galleries(data, callback) {}
        get_thumb_info(element) {}
        get_title_str(data) {}
        get_info_dict(data) {}
        get_image_list(data) {}
        set_vars(element) {}
        set_first_page() {}
        set_next_page() {}
    };

    class PornPics extends BaseSite {
        constructor() {
            super();
            this.key = '';
            this.key_elem = $('<input>').addClass('search__text inpt-default');
            this.latest = false;
            this.limit = 20;
            this.offset = 0;
        }
        get_inputs() {
            return $('<div>').addClass('site-var-container').append(this.key_elem);
        }
        get_url() {
            this.key = this.key_elem.val();
            return `https://www.pornpics.com/search/srch.php` +
                `?q=${encodeURIComponent(this.key)}` +
                `${this.latest ? '&date=latest' : ''}` +
                `&limit=${this.limit}` +
                `&offset=${this.offset}`;
        }
        parse_galleries(data, callback) {
            const json_array = $.parseJSON(data);
            json_array.forEach(callback);
        }
        get_thumb_info(element) {
            return [element.g_url, element.t_url_460, element.desc];
        }
        get_title_str(data) {
            return $(data).find('.title-section h1').text();
        }
        get_info_dict(data) {
            return {
                '📺': $(data).find(".gallery-info__item").eq(0).find("a"),
                '👠': $(data).find(".gallery-info__item").eq(1).find("a"),
                '📚': $(data).find(".gallery-info__item.tags").eq(0).find("a"),
                '🏷️': $(data).find(".gallery-info__item.tags").eq(1).find("a")
            };
        }
        get_image_list(data) {
            const image_elements = $(data).find('#main ul li a');
            const image_list = [];
            image_elements.each(function() {
                const src = $(this).attr('href');
                const [width, height] = $(this).attr('data-size').split('x');
                image_list.push({src: src,
                                 width: width,
                                 height: height});
            });
            return image_list;
        }
        set_vars(element) {
            this.key_elem.val($(element).text());
        }
        set_first_page() {
            this.offset = 0;
        }
        set_next_page() {
            this.offset += this.limit;
        }
    };

    class PicHunter extends BaseSite {
        constructor() {
            super();
            this.base_url = 'http://pichunter.com';
            $('head').append($('<base>').attr('href', this.base_url));
            this.type = '';
            this.type_elem = $('<select>').addClass('search__submit btn-light')
                .append($('<option>').text('models'))
                .append($('<option>').text('sites'))
                .append($('<option>').text('tags'))
                .css('border-radius', '3px 0 0 3px')
                .css('text-align', 'center');
            this.key = '';
            this.key_elem = $('<input>').addClass('search__text inpt-default')
                .css('width', 'calc(100% - 140px)')
                .css('border-radius', '0')
                .css('border-left', 'none');
            this.page = 1;
        }
        get_inputs() {
            return $('<div>').addClass('site-var-container').append(this.type_elem).append(this.key_elem);
        }
        get_url() {
            // TODO: add support for 'search' type, add support for sorting
            this.type = this.type_elem.val();
            this.key = this.key_elem.val();
            return `https://www.pichunter.com/` +
                `${this.type}/` +
                `${this.type == 'models' ? '' : 'all/'}` +
                `${encodeURIComponent(this.key)}/` +
                `${this.type == 'models' ? 'photos/' : ''}` +
                `${this.page}/format/json`;
        }
        parse_galleries(data, callback) {
            const json_array = $.parseJSON(data).thumbs;
            json_array.forEach(callback);
        }
        get_thumb_info(element) {
            return [this.base_url + element.galUrl, element.src, element.title2];
        }
        get_title_str(data) {
            return $(data).find('h1').text();
        }
        get_info_dict(data) {
            const tags = $(data).find('.tagCloud');
            return {
                '📺': tags.find('li.g_site a'),
                '👠': tags.find('li.g_star a'),
                '📚': tags.find("li:not([class]) a"),
            };
        }
        get_image_elements(data) {
            return $(data).find('.flex-images figure a');
        }
        get_image_list(data) {
            const image_elements = $(data).find('.flex-images figure a');
            const image_list = [];
            image_elements.each(function() {
                image_list.push({src: $(this).attr('href'),
                                 width: $(this).find('img').attr('xow'),
                                 height: $(this).find('img').attr('xoh')});
            });
            return image_list;
        }
        set_vars(element) {
            const [type, key] = $(element).attr('href').substr(1).split('/');
            this.type_elem.val(type);
            this.key_elem.val(key.replaceAll('_', ' '));
        }
        set_first_page() {
            this.page = 1;
        }
        set_next_page() {
            ++this.page;
        }
    }

    class YesPornPics extends BaseSite {
        constructor() {
            super();
            this.base_url = 'https://yespornpics.com';
            $('head').append($('<base>').attr('href', this.base_url));
            this.key = '';
            this.key_elem = $('<input>').addClass('search__text inpt-default');
            this.page = 1;
        }
        get_inputs() {
            return $('<div>').addClass('site-var-container').append(this.key_elem);
        }
        get_url() {
            this.key = this.key_elem.val();
            return `https://yespornpics.com/sex/` +
                `${encodeURIComponent(this.key)}/` +
                `${this.page}`;
        }
        parse_galleries(data, callback) {
            const galleries = $(data).find('.gallery a');
            galleries.each(function () {
                callback(this);
            });
        }
        get_thumb_info(element) {
            return [this.base_url + $(element).attr('href'), $(element).find('img').attr('src'), $(element).find('img').attr('alt')];
        }
        get_title_str(data) {
            return $(data).find('.jpeg a img').attr('alt').slice(0, -5);
        }
        get_info_dict(data) {
            const tags = $(data).find('.gallerytags');
            return {
                '📺': tags.find('h4 a'),
                '👠': tags.find('h5 a'),
                '📚': tags.find('h6 a'),
            };
        }
        get_image_list(data) {
            const image_elements = $(data).find('.jpeg a');
            const image_list = [];
            image_elements.each(function() {
                image_list.push({src: $(this).attr('href')});
            });
            return image_list;
        }
        set_vars(element) {
            const key = $(element).attr('href').split('/')[2];
            this.key_elem.val(key);
        }
        set_first_page() {
            this.page = 1;
        }
        set_next_page() {
            ++this.page;
        }
    }

    class BabeSource extends BaseSite {
        constructor() {
            super();
            this.key = '';
            this.key_elem = $('<input>').addClass('search__text inpt-default');
            $('.input-container').append(this.key_elem);
            this.page = 1;
            this.search_mode = true;
            this.jump_url = '';
        }
        get_inputs() {
            return $('<div>').addClass('site-var-container').append(this.key_elem);
        }
        get_url() {
            // TODO: sort by views
            var res;
            if (this.search_mode) {
                this.key = this.key_elem.val();
                res = `https://babesource.com/search/photos/` +
                    `${encodeURIComponent(this.key)}/`;
            } else {
                this.search_mode = true;
                res = this.jump_url;
            }
            res += `page${this.page}.html`;
            return res;
        }
        parse_galleries(data, callback) {
            const galleries = $(data).find('.main-content__card-link');
            galleries.each(function () {
                callback(this);
            });
        }
        /*async get_thumb_info(element) {
            const thumbnail_url = $(element).find('picture img').attr('data-src');
            return [$(element).attr('href'),
                    await get_base64_image(thumbnail_url),
                    $(element).find('picture img').attr('alt')];
        }*/
        get_thumb_info(element) {
            return [$(element).attr('href'),
                    $(element).find('picture img').attr('data-src'),
                    $(element).find('picture img').attr('alt')];
        }
        get_title_str(data) {
            return '';
        }
        get_info_dict(data) {
            return {
                '📺': $(data).find('div.aside-setting__chapter:has(h4:contains("Paysite")) a'),
                '👠': $(data).find('div.aside-setting__chapter:has(h4:contains("Models")) a'),
                '📚': $(data).find('div.aside-setting__chapter:has(h4:contains("Categories")) a'),
                '🏷️': $(data).find('.aside-setting__category-link'),
            };
        }
        get_image_elements(data) {
            return $(data).find('.slideshowGalleryImage');
        }
        /*async get_image_list(data) {
            const image_elements = $(data).find('.slideshowGalleryImage');
            const image_list = [];
            const promises = [];
            image_elements.each(async function() {
                promises.push(get_base64_image($(this).attr('href')).then((encoded_src) => {
                    image_list.push({src: encoded_src});
                }));
            });
            await Promise.all(promises);
            return image_list;
        }*/
        get_image_list(data) {
            const image_elements = $(data).find('.slideshowGalleryImage');
            const image_list = [];
            image_elements.each(function() {
                image_list.push({src: $(this).attr('href')});
            });
            return image_list;
        }
        set_vars(element) {
            this.key_elem.val('');
            this.jump_url = $(element).attr('href');
            this.search_mode = false;
        }
        set_first_page() {
            this.page = 1;
        }
        set_next_page() {
            ++this.page;
        }
    }

    function get_responce(url, type) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: url,
                responseType: type,
                onload: function(response) {
                    resolve(response.response);
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    /*async function get_base64_image(url) {
        const blob = await get_responce(url, 'blob');
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }*/

    async function get_galleries(url) {
        const data = await get_responce(url, 'text');
        site.parse_galleries(data, async (element) => {
            const [gallery_url, thumbnail_src, thumbnail_alt] = site.get_thumb_info(element);
            const gallery_data = await get_responce(gallery_url, 'text');
            const title_str = site.get_title_str(gallery_data);
            const info_dict = site.get_info_dict(gallery_data);
            const title = $('<div>')
            .addClass('gallery-title-container')
            .append(
                $('<div>').addClass('gallery-title')
                .text(title_str)
            );
            const img = $('<img>')
            .attr('src', thumbnail_src)
            .attr('alt', thumbnail_alt)
            .on('click', function() {
                const image_list = site.get_image_list(gallery_data);
                const pswp = new PhotoSwipe({dataSource: image_list});
                pswp.init();
            })
            .on('load', () => {
                grid.masonry('layout');
            });
            const info = get_info(info_dict);
            const grid_item = $('<div>')
            .addClass('grid-item')
            .append(title)
            .append(img)
            .append(info);
            grid.append(grid_item).masonry('appended', grid_item);
        });
    }

    function get_info(info_dict) {
        const info = $('<div>').addClass('info');
        for (const [key, elements] of Object.entries(info_dict)) {
            if (elements.length === 0) {
                continue;
            }
            const info_title = $('<div>').addClass('info-title').text(key);
            const info_buttons = $('<div>').addClass('info-button-container');
            elements.each(function () {
                info_buttons.append(
                    $('<button>').addClass('info-button').text($(this).text().trim()).on('click', () => {
                        site.set_vars(this);
                        update_page();
                    })
                );
            });
            const info_row = $('<div>').addClass('info-row').append(info_title).append(info_buttons);
            info.append(info_row);
        }
        return info;
    }

    // next-button
    $('#fb-button').remove();
    const next_button = $('<span>').addClass('next-button').attr('id', 'fb-button').text('Next Page').on('click', function() {
        site.set_next_page();
        update_page();
    });
    next_button.insertBefore('footer').hide();

    // nav-section
    $('.nav-button-menu').remove();
    $('.left-side').remove();
    const url_display = $('<a>');
    $('.nav-section').prepend($('<div>').addClass('left-nav-menu').append($('<ul>').append($('<li>').append(url_display))));
    $('.right-side .item:not(.site-theme)').remove();

    // head
    $('head title').text('Corn Pics');
    $('head meta[name="referrer"]').attr('content', 'no-referrer');

    // footer
    $('footer').remove();

    function clear_galleries() {
        grid.masonry('remove', grid.find('.grid-item'));
        grid.empty();
        next_button.hide();
        url_display.text('');
    }

    function update_url() {
        const url = site.get_url();
        url_display.text(url);
        return url;
    }

    function update_page() {
        clear_galleries();
        get_galleries(update_url());
        window.scrollTo(0, 0);
        next_button.show();
    }

    $(window).on('resize', function() {
        grid.masonry('layout');
    });

    let site = new PornPics();
    const grid = $('<div>').addClass('grid').addClass('clearfix').masonry({
        itemSelector: '.grid-item',
        fitWidth: true
    });

    // header-section
    const go_button = $('<button>').addClass('search__submit btn-light').text('Go').on('click', function() {
        site.set_first_page();
        update_page();
    });
    const control_section = $('<div>').addClass('search-section').append(site.get_inputs()).append(go_button);
    const site_select = $('<select>').addClass('site-select btn-fill')
    .append($('<option>').text('PornPics'))
    .append($('<option>').text('PicHunter'))
    .append($('<option>').text('YesPornPics'))
    .append($('<option>').text('BabeSource'))
    .on('change', function() {
        switch ($(this).val()) {
            default:
            case 'PornPics':
                site = new PornPics();
                break;
            case 'PicHunter':
                site = new PicHunter();
                break;
            case 'YesPornPics':
                site = new YesPornPics();
                break;
            case 'BabeSource':
                site = new BabeSource();
                break;
        }
        clear_galleries();
        control_section.prepend(site.get_inputs());
    });
    $('.nav-button-search').remove();
    $('.search-section').remove();
    $('.user-section').remove();
    $('.login-section').remove();
    $('.header-section').append(control_section).append(
        $('<div>').addClass('login-section active').append(site_select)
    );

    $('#content').remove();
    grid.insertAfter('#wrapper nav');



})();