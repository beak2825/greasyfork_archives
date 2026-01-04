// ==UserScript==
// @name        Analvids/LegalPorno Enhancer
// @namespace   https://www.analvids.com/forum/viewtopic.php?f=96&t=24238
// @description Adds extra functionality to Analvids (formerly known as LegalPorno) and Pornbox. Easily filter out unwanted categories. Also adds tags on top of every scene.
// @match       http*://*.analvids.com/*
// @exclude     http*://account.analvids.com/*
// @match       http*://*pornbox.com/*
// @exclude     http*://forum.pornbox.com/*
// @version     1.2.20
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/395516/AnalvidsLegalPorno%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/395516/AnalvidsLegalPorno%20Enhancer.meta.js
// ==/UserScript==

const is_lp = !!window.location.href.match(/(analvids|pornworld)/);

let glo_filters = {
  studios: {
    'Giorgio Grandi': true,
    'Gonzo.com': true,
    'NRX-Studio': true,
    "Giorgio's Labs": true,
    'Yummy estudio': true,
    'Busted T-Girls': true,
    'VK Studio': true,
    'Black in White': true,
    'N F studio': true,
    XFREAXX: true,
    'Freax Anal Lesbian': true,
    'Interracial Vision': true,
    'Angelo Godshack Original': true,
    'Sineplex SOS': true,
    'Sineplex CZ': true,
    'PISSING E ANAL FANTASY': true,
    'LATIN TEENS productions': true,
    'Natasha Teen Productions': true,
    'Mambo Perv': true,
    'American Anal': true,
    'Rock Corp': true,
    'The Wonder Toys Anal Training': true,
    'Fisting-Fun': true,
    'Vira Gold Films': true,
    'Anal Maniacs by Lady Dee': true,
    'Eden does': true,
    'Pineapples Studio': true,
    'Studio PL': true,
    'Erika Korti Studio': true,
    'Nick Morris Studio': true,
    'Harsh Pleasure Machine': true,
    'Ferrero Anal Experience': true,
    'Fisting Lesson': true,
    'Alt Perversion': true,
    'Porn World': false,
    'Show Everything': false,
  },
  categories: {
    Piss: true,
    'Piss Drink': true,
    Fisting: true,
    Prolapse: true,
    Gay: false,
    Trans: true,
    Compilation: false
  },
};

const studio_colors = {

  'Gonzo.com': { bg: '#e90000a5', text: '#ffeeee' },
  'Giorgio Grandi': { bg: '#2313d3a5', text: '#EEE' },
  'Interracial Vision': { bg: '#242424a5', text: '#e6e6e6' },
  'American Anal': { bg: '#0C5326a5', text: '#d1f3e8' },
  "Giorgio's Labs": { bg: '#3DB8DCa5', text: '#EEEEEE' },
  'NRX-Studio': { bg: '#24f6d0a5', text: '#424d4b' },
  'N F studio': { bg: '#1091c4a5', text: '#EEEEEE' },
  'Yummy estudio': { bg: '#0a11e4a5', text: '#ffff25' },
  'Busted T-Girls': { bg: '#BDF619a5', text: '#3485A6' },
  'VK Studio': { bg: '#d7fbaaa5', text: '#3a531b' },
  'Black in White': { bg: '#EEEEEEa5', text: '#000000' },
  'N&F studio': { bg: '#8D15CAa5', text: '#EEEEEE' },
  XFREAXX: { bg: '#93076Aa5', text: '#EEEEEE' },
  'Freax Anal Lesbian': { bg: '#FD5E54', text: '#FFFFFF' },
  'Angelo Godshack Original': { bg: '#6ba2d4a5', text: '#EEEEEE' },
  'Sineplex SOS': { bg: '#9C44EEa5', text: '#EEEEEE' },
  'Sineplex CZ': { bg: '#8A0EB3a5', text: '#EEEEEE' },
  'PISSING E ANAL FANTASY': { bg: '#ff5e00a5', text: '#fbf275' },
  'LATIN TEENS productions': { bg: '#1AFB54a5', text: '#555555' },
  'Natasha Teen Productions': { bg: '#EE1788a5', text: '#EEEEEE' },
  'The Wonder Toys Anal Training': { bg: '#ACEACFa5', text: '#5F546A' },
  'Fisting-Fun': { bg: '#41B97F', text: '#EEEEEE' },
  'Mambo Perv': { bg: '#C729A5a5', text: '#EEEEEE' },
  'Rock Corp': { bg: '#6D1644a5', text: '#83C650' },
  'Vira Gold Films': { bg: '#F7AF7Ca5', text: '#662a35' },
  'Anal Maniacs by Lady Dee': { bg: '#4B7039a5', text: '#EEEEEE' },
  'Eden does': { bg: '#378B03a5', text: '#EEEEEE' },
  'Pineapples Studio': { bg: '#674ABAa5', text: '#EEEEEE' },
  'Porn World': { bg: '#C1015Aa5', text: '#E2E316' },
  'Studio PL': { bg: '#F84543', text: '#5BD02B' },
  'Erika Korti Studio': { bg: '#368C48', text: '#EEEEEE'},
  'Nick Morris Studio': { bg: '#07B78E', text: '#EEEEEE'},
  'Harsh Pleasure Machine': { bg: '#E8F191', text: '#3F1B31'},
  'Ferrero Anal Experience': { bg: '#570B04', text: '#EEEEEE'},
  'Fisting Lesson': { bg: '#67E815', text: '#EEEEEE'},
  'Alt Perversion': { bg: '#0BED4F', text: '#EEEEEE'},
};

// Uncomment the following line to reset global filters
// GM_setValue('user_filters', JSON.stringify(glo_filters));

validateUserFilters = filters => {
  if (!filters.studios || !filters.categories) return false;
  if (
    Object.keys(filters.studios).length !==
    Object.keys(glo_filters.studios).length
  )
    return false;
  if (
    Object.keys(filters.categories).length !==
    Object.keys(glo_filters.categories).length
  )
    return false;
  if (
    Object.keys(filters.categories)
      .sort()
      .some(
        (val, idx) => val !== Object.keys(glo_filters.categories).sort()[idx]
      )
  )
    return false;
  if (
    Object.keys(filters.studios)
      .sort()
      .some((val, idx) => val !== Object.keys(glo_filters.studios).sort()[idx])
  )
    return false;
  return true;
};

try {
  const user_config = GM_getValue('user_filters');
  if (!user_config)
    throw new Error('No user filters found. Using default ones.');
  user_filters = JSON.parse(user_config);
  if (!validateUserFilters(user_filters))
    throw new Error('Invalid user settings.');
  glo_filters = user_filters;
} catch (e) {}

const studios = {
  Interracial: 'Interracial Vision',
  'Hard Porn World': 'Porn World',
};

const icon_categories = {
  interracial: 'IR',
  'double anal (DAP)': 'DAP',
  fisting: 'Fisting',
  prolapse: 'Prolapse',
  transsexual: 'Trans',
  trans: 'Trans',
  'triple anal (TAP)': 'TAP',
  piss: 'Piss',
  squirting: 'Squirt',
  '3+ on 1': '3+on1',
  'double vaginal (DPP)': 'DPP',
  'first time': '1st',
  'triple penetration': 'TP',
  '0% pussy': '0% Pussy',
  'cum swallowing': 'Cum Swallow',
  'piss drinking': 'Piss Drink',
  'anal creampies': 'Anal Creampie',
  '1 on 1': '1on1',
  milf: 'Milf',
  'facial cumshot': 'Facial',
  gay: 'Gay',
  Compilation: 'Compilation'
};

GM_addStyle(`
.hiddenScene {
  display: none !important;
}

.hide_element {
  display: none !important;
}

.thumbnail-duration {
  top: 0 !important;
  right: 0 !important;
  left: unset !important;
  bottom: unset !important;
  margin: 5px !important;
}

.enhanced_categories_container {
  width: 100%;
  display: flex;
  flex-wrap: wrap-reverse;
  position: absolute;
  bottom:0; left: 0;
  z-index: 3;
  padding: 3px 5px;
}

.enchanced_icon {
  border-radius: 3px;
  background-color: #616161;
  color: #eee;
  opacity: 0.9;
  padding: 2px 7px;
  margin-right: 2px;
  margin-top: 2px;
  font-size: 13px;
}

.enhanced--studio {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  display: flex;
  margin: 4px 6px;
  font-family: sans-serif;
  font-weight: 600;
  font-size: 0.98em;
  background-color: #a76523c9;
  border-radius: 3px;
  padding: 2px 7px;
  color: white;
  // text-shadow: 1px 1px #00000080;
  margin-right: 4px;
}

.enhanced_views_label {
  position: absolute;
  top: 28px;
  right: 5px;
  font-size: 11px;
  display: flex;
}

.enhanced--views {
  background-color: rgba(102,102,102,0.6);
  padding: 2px 6px;
  border-radius: 3px;
  color: #fff;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.enhanced--views > i {
  margin-right: 5px;
}

.item__img:hover > div {
  display: none;
}

.item__img-labels-bottom {
  top: 3px;
  right: 3px;
  left: unset;
  bottom: unset;
  display: flex
}

.img-label {
  margin-top: unset;
  margin-left: 2px;
}

.item__img-labels {
  display: flex;
  flex-direction: row-reverse;
  left: unset;
  right: 3px;
  top: 23px;
}

/* Filter Css Begin */
.filters_container_lp {
  margin-left: -15px;
  margin-right: -15px;
}

.filters_container--main {
  width: 100%;
  display: flex;
  justify-content: center;
  background: linear-gradient(
    0deg,
    #babcbc 0%,
    #dfe1e1 2%,
    #dfe1e1 98%,
    #babcbc 100%
  );
}

.filters_card {
  margin: 0 25px;
  padding-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.filters_selections {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 10px;
}

.filters--divider {
  width: 1px;
  background-color: rgb(0, 0, 0, 0.25);
  height: 50px;
  margin-top: 15px;
  align-self: center;
}

.filters--selection {
  padding: 1px 10px 0 0;
  min-width: 140px;
  display: flex;
  align-items: center;
}

.filters--selection > label,
.filters--selection > input[type="checkbox"] {
  margin: 0 2px 0 0;
  font-weight: bold;
}

.fitlers--header {
  padding: 5px 0 5px 0;
  align-self: center;
  font-weight: bold;
}

.enhanced_toggle {
  background: -webkit-linear-gradient(
    top,
    #a9a9a9 0%,
    #d97575 5%,
    #563434 100%
  ) !important;
  // height: 100%;
  border: 1px solid #722424 !important;
  color: white;
  padding: 7px 11px;
  font-weight: 700;
  border: none !important;
  }

.enhanced_toggle_pb {
  height: 100%;
  padding: 7px 11px;
  border-radius: 300px;
  position: absolute;
  margin-left: 4px;
}

.enhanced_toggle_lp {
  border-radius: 200px;
  margin-left: 4px;
}

.enhanced_toggle:hover {
  cursor: pointer;
}

.enhanced_toggle > i {
  font-size: 12px;
}
/* Filter Css End */

.enhanced--sort {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  grid-gap: 2px;
  position: absolute;

  top: -4px;
  right: 210px;
}

.enhanced--sort--navbar {
  right: 25px;
  top: 6px;
}

.enhanced--sort > span {
  grid-column-end: span 2;
  color: #fff;

}

.enhanced--sort > button {
  width: 70px;
  height: 23px;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0;
  margin: 0;
}

.page-section {
  position: relative !important;
}
`);

const getSceneInfo = scene => {
  const info = {
    studio: null,
    categories: null,
    date: null,
    views: null,
  };

  info.studio = scene.querySelector(
    '.rating-studio-name, a[href^="/application/studio/"]'
  );
  info.studio = info.studio ? info.studio.innerText : null;
  if (studios[info.studio]) {
    info.studio = studios[info.studio];
  }
  info.categories = [...scene.querySelectorAll('a[href*="niche/"]')]
    .filter(cat => cat.innerText && icon_categories[cat.innerText])
    .map(cat => icon_categories[cat.innerText])
    .sort();
  // info.categories = info.categories.filter(
  //   cat => !(cat === 'Piss' && info.categories.includes('Piss Drink'))
  // );
  info.categories = Array.from(new Set(info.categories));

  const views = scene.querySelector('.rating-views');
  const date = scene.querySelector('.glyphicon-calendar');

  if (views) {
    info.views = parseInt(views.innerText.replace('VIEWS:', '').trim(), 10);
  }
  if (date) {
    try {
      info.date = new Date(
        date.parentElement.innerText.replace('RELEASE:', '').trim()
      );
    } catch (e) {}
  }

  return info;
};

const formatViews = n => {
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(0) + 'k';
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(0) + 'm';
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(0) + 'b';
  // if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
  return n;
};

const enhanceScene = scene => {
  // Remove icons from thumnail. ("4k" and "new")
  const icons = scene.querySelectorAll('.icon, .thumbnail-price');
  for (const icon of icons) {
    icon.classList.add('hide_element');
  }

  const { studio, categories, views, date } = getSceneInfo(scene);

  if (studio) {
    const studioLabel = document.createElement('div');
    studioLabel.classList.add('enhanced--studio');
    studioLabel.innerHTML = studio;

    if (studio_colors[studio]) {
      studioLabel.style = `
      background-color: ${studio_colors[studio]['bg']}; color: ${studio_colors[studio]['text']};
      `;
    }

    if (views) {
      const viewsLabel = document.createElement('div');
      viewsLabel.innerHTML = `
      <div class='enhanced--views'><i class='fa fa-eye'></i>${formatViews(
        views
      )}</div>`;
      viewsLabel.classList.add('enhanced_views_label');
      if (scene.querySelector('.thumbnail-image')) {
        scene.querySelector('.thumbnail-image').appendChild(viewsLabel);
      }
    }

    // studioLabel.classList.add('enhanced_title_tags');
    scene
      .querySelector('.thumbnail-image, .item__img')
      .appendChild(studioLabel);
  }
  if (categories.length) {
    const cat_div = document.createElement('div');
    cat_div.classList.add('enhanced_categories_container');
    for (const cat of categories) {
      const icon = document.createElement('div');
      icon.classList.add('enchanced_icon');
      icon.innerHTML = cat;
      cat_div.appendChild(icon);
    }

    if (scene.querySelector('.thumbnail-image, .item__img')) {
      scene.querySelector('.thumbnail-image, .item__img').appendChild(cat_div);
    }
  }
};

const isStudioFiltered = studio => {
  for (const key of Object.keys(glo_filters.studios)) {
    if (studio && studio.includes(key) && glo_filters.studios[key])
      return false;
  }
  return true;
};

const isSceneFiltered = scene => {
  const { studio, categories, views, date } = getSceneInfo(scene);

  if (!glo_filters.studios['Show Everything']) {
    if (isStudioFiltered(studio)) return true;
  }

  for (const key of Object.keys(glo_filters.categories)) {
    if (categories && categories.includes(key) && !glo_filters.categories[key])
      return true;
  }

  return false;
};

const filterScene = scene => {
  if (isSceneFiltered(scene)) {
    scene.classList.add('hiddenScene');
  }
};

const updateFilters = () => {
  GM_setValue('user_filters', JSON.stringify(glo_filters));
  const scenes = document.querySelectorAll('.thumbnail, .block-item');
  for (const scene of scenes) {
    if (scene.classList.contains('hiddenScene'))
      scene.classList.remove('hiddenScene');
    filterScene(scene);
  }
};

const getStudiosCheckboxes = () => {
  return [
    ...document.querySelectorAll(
      'input[name="studios"]:not(input[id="Show Everything"])'
    ),
  ];
};

const createFilterElement = () => {
  const { studios, categories } = glo_filters;

  const studioHtml = Object.keys(studios).reduce(
    (acc, studio) =>
      (acc += `<div class="filters--selection">
      <input type="checkbox" name="studios" id="${studio}"
      ${studios[studio] ? 'checked="checked"' : ''}
      ${
        studios['Show Everything'] && studio !== 'Show Everything'
          ? 'disabled=true"'
          : ''
      }
      />
      <label for="${studio}"
      ${studio == 'Show Everything' ? 'style= "color:#f83600;"' : ''}>
      ${studio}</label>
    </div>`),
    ''
  );

  const categoriesHtml = Object.keys(categories).reduce(
    (acc, cat) =>
      (acc += `<div class="filters--selection">
      <input type="checkbox" name="categories" id="${cat}"
      ${categories[cat] ? 'checked="checked"' : ''}
      />
      <label for="${cat}">${cat}</label>
    </div>`),
    ''
  );

  const form = document.createElement('form');
  form.classList.add('filters_container', 'hide_element');
  if (is_lp) form.classList.add('filters_container_lp');
  form.innerHTML = `<div class="filters_container--main">
    <div class="filters_card">
      <div class="fitlers--header">Studios:</div>
      <div class="filters_selections">
        ${studioHtml}
      </div>
      <div>
          <input type="button" value="Select All">
          <input type="button" value="Clear">
        </div>
    </div>
    <!--  -->
    <div class="filters--divider"></div>
    <!--  -->
    <div class="filters_card">
      <div class="fitlers--header">Categories:</div>
      <div class="filters_selections">
        ${categoriesHtml}
      </div>
    </div>
    </div>`;

  form.addEventListener('click', e => {
    if (!e.target.type) return;

    if (e.target.type == 'button') {
      if (e.target.value === 'Select All') {
        getStudiosCheckboxes().forEach(n => {
          n.checked = true;
        });

        Object.keys(glo_filters.studios).forEach(studio => {
          if (studio === 'Show Everything') return;
          glo_filters.studios[studio] = true;
        });
      }
      if (e.target.value === 'Clear') {
        getStudiosCheckboxes().forEach(n => {
          n.checked = false;
        });
        Object.keys(glo_filters.studios).forEach(studio => {
          glo_filters.studios[studio] = false;
        });
      }
      // glo_filters[e.target.name][e.target.id] = e.target.checked;
    }

    if (e.target.type == 'checkbox') {
      glo_filters[e.target.name][e.target.id] = e.target.checked;
    }

    if (e.target.id === 'Show Everything') {
      getStudiosCheckboxes().forEach(el => {
        el.disabled = !el.disabled;
      });
    }

    updateFilters();
  });

  const lp_header = document.querySelector('.header');
  const pb_header = document.querySelector('#wrap-container');

  if (lp_header) lp_header.insertBefore(form, lp_header.childNodes[2]);
  if (pb_header) pb_header.insertBefore(form, pb_header.childNodes[0]);
  createFilterToggle();
};

const createFilterToggle = () => {
  const toggleFilterBtn = document.createElement('button');
  toggleFilterBtn.classList.add('enhanced_toggle');
  toggleFilterBtn.classList.add(`enhanced_toggle_${is_lp ? 'lp' : 'pb'}`);

  toggleFilterBtn.innerHTML = `<i class="fa fa-filter"></i>`;

  toggleFilterBtn.addEventListener('click', () => {
    const filters_container = document.querySelector('.filters_container');
    if (filters_container) {
      filters_container.classList.toggle('hide_element');
    }
  });

  const search_container = document.querySelector(
    '.nav-search-container, .header-block:nth-of-type(3)'
  );
  is_lp ? (search_container.style = 'display: flex;') : null;
  search_container.appendChild(toggleFilterBtn);
};

const callback = mutationsList => {
  for (let mutation of mutationsList) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === 1) {
        if (node.nodeName === 'DIV') {
          if (
            node.classList.contains('block-item') ||
            node.classList.contains('thumbnail')
          ) {
            enhanceScene(node);
            filterScene(node);
          }
        }
      }
    }
  }
};

const config = { childList: true, subtree: true, attributes: true };
const observer = new MutationObserver(callback);
observer.observe(window.document, config);

const sortScenes = ({ date = false, views = false, asc = true } = {}) => {
  const node = document.querySelector('.thumbnails');
  [...node.children]
    .sort((a, b) => {
      const infoA = getSceneInfo(a);
      const infoB = getSceneInfo(b);

      let order = -1;

      if (date) {
        order = infoA.date > infoB.date ? -1 : 1;
      } else if (views) {
        order = infoA.views > infoB.views ? -1 : 1;
      } else {
        order = 0;
      }

      if (a.classList.contains('button--load-more')) return 0;
      if (b.classList.contains('button--load-more')) return 0;

      return !asc ? order : order * -1;
    })
    .map(scene => {
      node.appendChild(scene);
      node.appendChild(document.createTextNode(' '));
    });
};

const sortBtns = () => {
  const sortDiv = document.createElement('div');
  sortDiv.classList.add('enhanced--sort');
  sortDiv.innerHTML = `
  <span>Sort By:</span>
  <button asc="false">Date</button>
  <button asc="false">Views</button>
  `;

  sortDiv.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
      const asc = e.target.getAttribute('asc') === 'true';
      e.target.setAttribute('asc', !asc);
      const sortObj = { asc };
      sortObj[e.target.innerText.toLowerCase()] = true;
      sortScenes(sortObj);
    }
  });

  const navbar = document.querySelectorAll('.navbar > .container-fluid');
  if (navbar.length) {
    navbar[navbar.length - 1].appendChild(sortDiv);
    sortDiv.classList.add('enhanced--sort--navbar');
    return;
  }

  const cont = document.querySelector('.page-section');
  if (cont) {
    sortDiv.children[0].style = 'color: #000;';
    cont.appendChild(sortDiv);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (!is_lp && !document.querySelector('.nav-search-container')) return;
  createFilterElement();
  sortBtns();

  const nodes = document.querySelectorAll('.block-item, .thumbnail');
  [...nodes].map(node => {
    enhanceScene(node);
    filterScene(node);
  });
});
