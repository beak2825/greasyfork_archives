// ==UserScript==
// @name        Footnotes on the side at paulgraham.com
// @namespace   Violentmonkey Scripts
// @match       https://www.paulgraham.com/*
// @grant       none
// @version     1.0
// @author      p-himik
// @description 3/29/2025, 9:06:28 AM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/531227/Footnotes%20on%20the%20side%20at%20paulgrahamcom.user.js
// @updateURL https://update.greasyfork.org/scripts/531227/Footnotes%20on%20the%20side%20at%20paulgrahamcom.meta.js
// ==/UserScript==


window.addEventListener('load', function () {
    const layout_table = document.querySelector('body > table');
    const text_table = layout_table.querySelector('table');
    const text_cell = text_table.querySelector('td');
    const default_width = '435px'
    const footnotes_margin = '-500px';

    const wrapper_div = document.createElement('div');

    const text_div = document.createElement('div');
    text_div.style.maxWidth = default_width;
    text_div.replaceChildren(...text_cell.childNodes);
    wrapper_div.append(text_div);
    text_table.replaceWith(wrapper_div);

    const convert_font_to_span = (font) => {
      const span = document.createElement('span');
      span.style.fontFamily = font.getAttribute('face');
      span.style.color = font.getAttribute('color');
      const size = font.getAttribute('size');
      if (size) {
        let size_num = parseInt(size);
        if (!(size.startsWith('+') || size.startsWith('-'))) {
          const default_size = 3;
          size_num = size_num - default_size;
        }
        const em_change = 0.2;
        const font_size = 1 + size_num * em_change;
        if (!isNaN(font_size)) {
          span.style.fontSize = font_size + 'rem';
        }
      }
      span.replaceChildren(...font.childNodes);
      font.replaceWith(span);
    }

    // noinspection JSDeprecatedSymbols
    text_div.querySelectorAll('font').forEach(font => {
      convert_font_to_span(font);
    });

    const footnotes_start = [...document.querySelectorAll('b')].filter(b => b.innerText === 'Notes')?.at(0);
    if (footnotes_start) {
      const get_new_footnote_span = (start_anchor, end_marker) => {
        const footnote_span = document.createElement('span');
        const prev = start_anchor.previousSibling;
        if (prev.nodeName === '#text' && prev.nodeValue.trim().endsWith('[')) {
          const text = prev.nodeValue;
          prev.nodeValue = text.substring(0, text.lastIndexOf('['));
        }
        footnote_span.append('[')
        footnote_span.append(start_anchor.cloneNode(true));

        let follower = start_anchor.nextSibling;
        while (follower && follower !== end_marker) {
          if (follower.nodeName === '#text' && follower.nodeValue.trim().endsWith('[')) {
            const text = follower.nodeValue;
            follower.nodeValue = text.substring(0, text.lastIndexOf('['));
          }
          const next_follower = follower.nextSibling;
          footnote_span.append(follower);
          follower = next_follower;
        }
        start_anchor.parentNode.replaceChild(footnote_span, start_anchor);
        return footnote_span;
      }
      const footnotes_anchors = document.querySelectorAll('a[name^="f"][name$="n"]');
      const last_anchor = footnotes_anchors[footnotes_anchors.length - 1];
      const last_footnote_end_marker = document.querySelector(`a[name="${last_anchor.name}"] ~ br + br + br`);
      const footnotes_div = document.createElement('div');
      footnotes_anchors.forEach((anchor, i) => {
        const font_size = getComputedStyle(anchor).fontSize;
        const next_marker = footnotes_anchors[i + 1] || last_footnote_end_marker;
        const footnote_span = get_new_footnote_span(anchor, next_marker);
        footnote_span.style.fontSize = font_size;
        footnote_span.style.maxWidth = default_width;
        const in_text_anchor = text_div.querySelector(`a[href="#${anchor.name}"]`);
        if (in_text_anchor) {
          const wrapper = document.createElement('span');
          in_text_anchor.after(wrapper);
          wrapper.append(in_text_anchor);
          wrapper.append(footnote_span);
          footnote_span.style.float = 'right';
          footnote_span.style.marginRight = footnotes_margin;
          footnote_span.style.position = 'relative';
          footnote_span.style.color = 'initial';
        } else {
          footnotes_div.append(footnote_span);
        }
      });

      const remove_children = (start_node, end_node) => {
        if (start_node.parentNode !== end_node.parentNode) {
          throw new Error('start_node and end_node must have the same parent');
        }
        let node = start_node;
        while (node && node !== end_node) {
          const next_node = node.nextSibling;
          node.remove();
          node = next_node;
        }
        end_node.remove();
      }

      remove_children(footnotes_start, last_footnote_end_marker);

      text_div.after(footnotes_div);
    }
  }
);
