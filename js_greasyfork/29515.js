// ==UserScript==
// @name        Sprytny scroll dla Wykop.pl
// @namespace   http://www.wykop.pl/ludzie/Deykun
// @description Płyne przewijanie klawiszami, wyłączanie materiałów które nie są już widoczne.
// @author      Deykun
// @version     2.00
// @include     htt*.wykop.pl/*
// @grant       none
// @run-at			document-end
// @downloadURL https://update.greasyfork.org/scripts/29515/Sprytny%20scroll%20dla%20Wykoppl.user.js
// @updateURL https://update.greasyfork.org/scripts/29515/Sprytny%20scroll%20dla%20Wykoppl.meta.js
// ==/UserScript==

// Możesz nieinwazynie zmienić klawisz przewijający stronę:
// - w konsoli wpisz localStorage.setItem('ssPrevious', 'k')
// - po odświeżeniu zmieni przewijanie z domyślnego b na k
// robiąc to w taki sposób zmiany nie zostaną stracone po aktualizacji dodatku :)

const keysActions = {
  previous: localStorage.getItem('ssPrevious') || 'b',
  next: localStorage.getItem('ssNext') || 'n',
}

const scrollSelectors = {
  newEntryForm: '#commentForm',
  link: '#itemsStream > .link', // znaleziska na liście
  entryAndLink: '#itemsStream.comments-stream > .iC', // komentarze w znaleziskach / wpisy na mikroblogu
  pages: '.pager',
};

const appendCSS = styles => {
  const style = document.createElement('style')
  style.innerHTML = styles
  document.head.append(style)
}

const getElementHeight = selector => {
  const el = document.querySelector(selector);

  return el ? parseFloat(getComputedStyle(el, null).height.replace('px', '')) : 0;
}

const domReady = fn => {
  document.addEventListener('DOMContentLoaded', fn);
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    fn();
  }
}

const debounce = (fn, time) => {
  let timeoutHandler;

  return (...args) => {
    clearTimeout(timeoutHandler);
    timeoutHandler = setTimeout(() => {
      fn(...args)
    }, time);
  }
}

const isElementVisibleInY = el => {
  const isVisibleEvenWhen = -20; // px
  const { top, bottom } = el.getBoundingClientRect();

  return top >= isVisibleEvenWhen || bottom >= isVisibleEvenWhen;
}

const muteExternalContent = () => {
  const embeds = Array.from(document.querySelectorAll('.closeEmbed')).map(closeEl => closeEl.parentNode.parentNode);
  const embedsToClose = embeds.filter(embed => !isElementVisibleInY(embed));

  if (embedsToClose.length === 0) {
    return;
  }

  embedsToClose.forEach(embedEl => {
    const closeButton = embedEl.querySelector('.closeEmbed');
    const event = document.createEvent('HTMLEvents');
    event.initEvent('click', true, false);
    closeButton.dispatchEvent(event);
  });
}

domReady(() => {
  let navHeight = getElementHeight('#nav'),
      bodyHeight = getElementHeight('body'),
      elements = [];

  appendCSS(`
    html {
      scroll-behavior: smooth;
    }
  `);

  function calcElementsY() {
    elementsY = [];
    navHeight = getElementHeight('#nav');
    bodyHeight = getElementHeight('body');

    const selectedElements = Object.values(scrollSelectors).reduce((stack, selector) => {
      const selectorElements = Array.from(document.querySelectorAll(selector));
      
      return [...stack, ...selectorElements];
    }, []);

    const bodyScrollY = window.scrollY;    
    elements = selectedElements.map(el => ({
      el: el,
      y: el.getBoundingClientRect().top + bodyScrollY,
    })).sort((a, b) => a.y - b.y);

    // Remove duplicated Ys
    elements = elements.filter((el1, index, els) => els.findIndex(el2 => el2.y === el1.y) === index);
  };
  calcElementsY();


  const smartScrollTo = direction => {
    const didBodyHeightChange = bodyHeight !== getElementHeight('body');
    if (didBodyHeightChange) {
      calcElementsY();
    }

    const y = window.pageYOffset;
    const nextIndex = elements.findIndex(el => el.y > y + navHeight + 1);

    if (direction === 'previous') {
      if (nextIndex > 1) {
        const previousElY = elements[nextIndex - 2].y;
        window.scrollTo(0, previousElY - navHeight);
      } else {
        // TOP
        window.scrollTo(0, 0);
      }

      return;
    }

    if (direction === 'next') {
      if (nextIndex <= elements.length) {
        const nextElY = elements[nextIndex].y;
        window.scrollTo(0, nextElY - navHeight);
      } else {
        // BOTTOM
      }

      return;
    }


  }

  document.addEventListener('keyup', event => {
    const tagName = event.target.tagName.toLowerCase();
    const key = event.key.toLowerCase();
    const userIsTyping = tagName === 'input' || tagName === 'textarea';

    if (!userIsTyping) {
      switch (key) {
        case keysActions.next:
          smartScrollTo('next');
          break;
        case keysActions.previous:
          smartScrollTo('previous');
          break;
      }
    }
  });

  document.addEventListener('scroll', debounce(() => {
      muteExternalContent();
  }, 150));
});
