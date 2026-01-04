// ==UserScript==
// @name         Astronomy Journal to ADS
// @namespace    niu541412
// @version      0.96
// @description  Add direct link to NASA/ADS on iop.org webpage for astronomy papers.
// @author       niu541412@gmail.com
// @match        *://iopscience.iop.org/article/*
// @match        *://www.nature.com/articles/*
// @match        *://science.sciencemag.org/*
// @match        *://www.science.org/*
// @match        *://www.annualreviews.org/*
// @match        *://link.springer.com/article/*
// @match        *://www.sciencedirect.com/science/*
// @grant        none
// @icon         data:image/gif;base64,R0lGODdhPAA8ANUAAAAAAAAAUgAAYwAQQggQWhAQYwAYUhAYShAYYxgYUgAhWhAhcwApYzEpaxAxYxAxayExazkxhDE5aylCczlCc0pCe0JKe0JKhEpKhClSe0JShEpSjDlajEpahFJae0pjlGNjnDlrhEp7nFp7nHN7rXt7pXOUrZyctYylvZy1xpy91r291s7O1sbW3tbW5+/v7/f39////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAADIALAAAAAA8ADwAAAb/QIZQqCAyYoRkssgowpRLIxLKLE6VVcZTGWMKoQQYYjwGi8kIcAydhp7JavQ1ye4q7go2DH8vyPl5f3x+ZHt4MQwFfgwGUmBZW0qNTUePjlCTTlBdQwxtSTCdnpuiaqKfYaWbcgRwWXZ4bC+AdWB1tGgvBAq7iGi2YJRFvGCraMKjUMioXQhDbKKUwo0GeX6KCLB3xcAEioFjSHCZo2lt563pfAgKcwTR8EO7h56eZXSEbPpjxLsEiJ0ACaS1iYkzaKLuUGqESAE2V3gMcAMTAMuvdK2QTdzIsaPHes4WHdxHcow9kiBBljzmTEjLeDBjDhmGbOBAjzhz6iyGJt/K/58kFSUaWoAogqJjfBaVyVSmSZpNaCq0iQrjzo4u1lz1RycpoZNAVyoKgOgaUrEIm0Z759RAjGqU2A2bK1CurXtbuQ240o9bXyj6UoZdyYDs4JJqE59yCzeLVEDC/uLtepgNgb1YlFTlyvPn0MpkCq8BnRZeiBioUXNQLIQx1LkMMqRO7YCPZigVUq9YsdfdRAUeUHvAbHVJ1hguWgxYPuAAYJ8CUK8QgCb6gp8wZqfedwF1g5D2iuYT9QG1S1ExJsRE3eKdM9SNKcFXYMDZO5r8oASfsjmGc72oDaCGO+3wRUVm3hwkwHTXhBbOAj6NQdZobGTFRgTiHEWIAhug9v/AUfUElJAII6SmXjSoBQAPfI0UwYIdTbCjXQwowEXHI7nNmEAx2R3IhTstIMFLjjEImAQJb/XBUocxqBDASDEsoBJZD1WIWitkkAXCC6k9OZQnMYAAInrmGSFEemTG0w4Kb51nAJcx8DbPNEXmcWOBRqKT247pBGckGHvxJuQSxfR1xwpX5JNiIg8VMKGUSZk3koSoIRBdgiAqgpRS2VA4RJkoxpACmp+qEE2BRbhVxEvSOHZEkk0ksdefSvQmYAx8XoZrGsT0VgZx/rQzDx5LoJZrglfmM2EMT2Zz3RjRQdAgCKKOdGlSaTTT4ANIxgBBIqG9SoQJqYV4xIlnwuL/IVKtcTJEAamVoAC5qKnQojBJnDBjnrvslUIrd/SW2p9llLArHATQmxoK5qDjkCcVBaAiiEclRV3FigggMXXgXuNJhAcVoDHHGJf8jEmsPRUTq/CwUxM7hIp81IG2EXOHXXnkDDM47PS86k3DJmiBBRpggIEFFEjAqKYYa4pNg2YVQPTQF1R9gQVWW1Ay1M4sUIHRFXxtwdcVsAyT2c4QXfTYYZP9tTM51yT10RoMPXTYdcsl0LC82PR1Bx0YfbTYGJTN6zZ8FG40218LfjQD3jgtOdOEYBO24BoUnfnRFoAbGAJGaxD22KLXPfTRZp9yXicWYJB50ZeDXcEwLuus8sDgbRdeAdGxWzAP33Wx0TjgoRe+tk14ON640YE7XnjUk2eKxu6NZ97B5plXLJgnRSvfPODN726u6ue11HrmbrcddupDGJ+53VjXjT3qevNj50CxY45BBxZ0MDvytxsc7L7WPcddjwIa8kqmJrc812lOc1qbnNOYpzjADQ8DHhhd29jykpZ0kAFjU5vuyFa4TiylEw6U3+vs5rgH6g2AdyCh/lwnvlgIpALdq1voHri5FF7AAU+jnOQaiD0XhoaBl2Nc6y7XQMVpLUQmQZkQhvY6xQmuAhf42PiEkMPmFdB1KQTj2uyHvOVdTgP+K11UbBIEADs=
// @license      MIT License
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/400529/Astronomy%20Journal%20to%20ADS.user.js
// @updateURL https://update.greasyfork.org/scripts/400529/Astronomy%20Journal%20to%20ADS.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (window.top !== window.self) {
    return;
  }

  const currentUrl = window.location.href;
  const currentHost = window.location.host;

  const createLinkElement = (href, text, className) => {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    if (className) {
      link.classList.add(className);
    }
    return link;
  };

  const insertLink = (container, linkElement, prepend = true) => {
    if (prepend === true) {
      container.prepend(linkElement);
    } else {
      container.append(linkElement);
    }
  };

  let doiMeta;
  let doi;
  let container;
  const adsFavicon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAFKADAAQAAAABAAAAFAAAAACy3fD9AAAESklEQVQ4EXVUW2xURRj+5pw55+yy1oArxYpdur0AIfRCgxZjIjY8+EC8NbEaEkWRaCLwZho0PJlG8dEoRIOQ+GIRA6jPJSb4oIZetE3qUuuySzXbFum2dLu75zIz/nOWlsXLJHsmO/P/3/99/2UY/me1HUslmVzTowTrBUNbaKYwxkx1Thnywlh/w7X/cmX/POw4mmtQwGEY2Adm1EEKKCVCM8ZMwKCfkjk6+EJK7+T48U3paoy7ANvfyXSDRT9lhtUiAhd+4EPKO+YUCCZ5WBaHaUWgAn8K8F//5b2HvluxWgVs7yMwK3KWKNR6XhkRy0BbvY3NdRZqIgY02FJZ4rcZH2PXPZR9Cdt26FT+xU30Dr9bF4KGgK1Hs42M8UHDtJKeW0ZjrY1jz65FxyYbjrUaMyThBgo/Zz30f51Hes6H7UTg5uevl27mnswMdKcMbWUY9puGFUkGvouaqIH+3nXoanZCMEXU5gsCS6WKdoczdDU56Nu7FpyolRfyKOULCWbEDmss3vZWJkn7PhV4lDOFR7dH0Z6w9R1uEcj73y5gKO1SChhe3V2Dnodj4V1rIoI4L1MK5qh+AOPmi1sOXPmIM4s/p6uphAeboo9kPOz/ZA5bH7RDZuevLFMhGLTUgR8K2LsjBodTod08osVZBEFAfgQpeVwo1sNJ0vNMBmFU8gtBcvkAl1NlxByD8mmh/j6OVmL9+NYoOJPI5WZwY3YWLGynMGvUSdQRPjtEsdCq1J3ekFKhPm7i6c4YntgWRSLOsS5WcRJeAVNTaRQKBZiGQcKqC6YgPH+jJh+y059AKCSJ0Ycvx9FEu14e9fREtoihiRlMZvJ4aidIMgUgOUppQO1/G5g2zXCcJmCXngYih4Pd966CjWeW8fbpLFK/z2Oh4GNHUwzPPKILtqKomiGjZrf/INLsnB4nRVFiERPNGzjKxWXM/JnFN4O/4vLwLMquDmZg03pQtRUxu82pCo+mi2DMk5wG7KItWJ9w/QeKi8u4NnULLF6C7wtsT9CrkHQwMx+gs9lGzy5Oo1hJEQnWM01saTFKgaFucpuf56njyUzTgZGvRFkeKS0v4aeJKFp22/DIKFkLfPBSBEUXiNcwRElt2dcIpIfYraEu0IuZES1yIHWqYzI8kZ44QTWfth0HF3708P2EgEEeeuziNUBiPSNQhdOXfAynFSIEZNOsP7bNISBbt880DfbHIXgYgj6b94/scT3vrAjk/QYC7Gy20LiBqkbPy2JRYWhKIDMXYMtGC83U9JrlYsnEaNqbN2ynN/1556W7APWfxtdG9siS/5mUrMH3XMqXIGm6PTQwPV2kR1AOhaQeJJnMFNl7Ys7ByTOdg9pfr6o6VQ4aXxltUSI4ogLxglKqVgmdtEohtDkzLe10g3H+pU0yr55pv1rxrHz/Bbhy2fjGaAtKqkcp75D0/Hp9btj2NGPWCTj+xfSprskV2+r9b8fIwc8OtmmdAAAAAElFTkSuQmCC"

  switch (currentHost) {
    case 'iopscience.iop.org':
      doiMeta = document.querySelector("meta[name='citation_doi']");
      doi = doiMeta.content;
      container = document.querySelector(".content-nav-ul.wd-content-nav");
      if (container) {
        const linkElement = createLinkElement(`http://adsabs.harvard.edu/abs/${doi}`, 'NASA/ADS');
        const listItem = document.createElement('li');
        listItem.append(linkElement);
        insertLink(container, listItem);
      }
      break;

    case 'www.nature.com':
      doiMeta = document.querySelector("meta[name='citation_doi']");
      doi = doiMeta.content;
      container = document.querySelector(".c-article-info-details");
      if (container) {
        const linkElement = createLinkElement(`http://adsabs.harvard.edu/abs/${doi}`, 'NASA/ADS', 'c-article-info-details__cite-as');
        insertLink(container, linkElement, false);
      }
      break;

    case 'science.sciencemag.org':
      doiMeta = document.querySelector("meta[name='citation_doi']");
      doi = doiMeta.content;
      container = document.querySelector(".article__tools");
      if (container) {
        const linkElement = document.createElement('div');
        const anchor = createLinkElement(`http://adsabs.harvard.edu/abs/${doi}`, ' NASA/ADS');
        const icon = document.createElement('img');
        icon.src = adsFavicon;
        icon.style = 'display:inline-block;vertical-align: middle;';
        linkElement.append(icon, anchor);
        const listItem = document.createElement('li');
        listItem.append(linkElement);
        insertLink(container, listItem);
      }
      break;

    case 'www.science.org':
      doiMeta = document.querySelector("meta[scheme='doi']");
      doi = doiMeta.content;
      container = document.querySelector(".info-panel__right-content");
      if (container) {
        const linkElement = createLinkElement(`http://adsabs.harvard.edu/abs/${doi}`, '');
        const icon = document.createElement('img');
        icon.src = adsFavicon;
        icon.style = 'display:inline-block;vertical-align: middle;';
        const listItem = document.createElement('li');
        linkElement.append(icon);
        listItem.append(linkElement);
        insertLink(container, listItem);
      }
      break;

    case 'www.annualreviews.org':
      doiMeta = document.querySelector("meta[name='dc.identifier']");
      doi = doiMeta.content;
      container = document.querySelector(".navbar-nav--article-nav-right");
      if (container) {
        const linkElement = createLinkElement(`http://adsabs.harvard.edu/abs/${doi}`, 'NASA/ADS');
        linkElement.style = 'color: inherit;';
        const icon = document.createElement('img');
        icon.src = adsFavicon;
        icon.style = 'display:inline-block;vertical-align: middle;';
        const listItem = document.createElement('li');
        linkElement.prepend(icon);
        listItem.append(linkElement);
        insertLink(container, listItem);
      }
      break;

    case 'link.springer.com':
      doiMeta = document.querySelector("meta[name='citation_doi']");
      doi = doiMeta.content;
      container = document.querySelector(".c-article-identifiers--cite-list");
      if (container) {
        const linkElement = createLinkElement(`http://adsabs.harvard.edu/abs/${doi}`, 'NASA/ADS', 'c-article-identifiers__item');
        insertLink(container, linkElement, false);
      }
      break;

    // currently not work!!
    // case 'www.sciencedirect.com':
    //     doiMeta = document.querySelector("meta[name='citation_doi']");
    //     doi = doiMeta.content;
    //     container = document.querySelector(".banner-options");
    //     if (container) {
    //         const linkElement = createLinkElement(`http://adsabs.harvard.edu/abs/${doi}`, 'NASA/ADS');
    //         insertLink(container, linkElement, false);
    //     }
    //     break;

    // default:
    //   console.warn('Unsupported website host:', currentHost);
  }
})();