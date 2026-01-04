// ==UserScript==
// @name         NotificationsNavigator
// @namespace    Empornium Scripts
// @version      1.2.0
// @description  Improves navigation to edit notification filters
// @author       vandenium
// @license      GPL3
// @match        https://www.empornium.is/torrents.php*
// @match        https://www.empornium.is/user.php?action=notify
// @icon         https://www.google.com/s2/favicons?sz=64&domain=empornium.is
// @grant        none
// Changelog:
// Version 1.2.0
// - Incorporate both the 'at least one of these tags' and 'none of these tags' in the 'Execute Search' functionality
// Version 1.1.0
// - Add Execute Search button in each filter.
// Version 1.0.3
// - Bug fix: Expand form when the textarea expands
// - Enhancement: Resize the tags textareas dynamically to always display all tags in the textarea.
// Version 1.0.2
// - Fix bug of not expanding filter section.
// Version 1.0.1
//  - Update downloadURL, updateURL
// Version 1.0.0
//  - Initial release
// @downloadURL https://update.greasyfork.org/scripts/536530/NotificationsNavigator.user.js
// @updateURL https://update.greasyfork.org/scripts/536530/NotificationsNavigator.meta.js
// ==/UserScript==


const curLoc = document.location.href;

if (curLoc.includes("torrents.php?action=notify")) {
  document.querySelectorAll("div.head").forEach(div => {
    if (div.firstChild.textContent.toLowerCase().includes('latest notifications')) return;
    const filterName = div.firstChild?.textContent?.trim().split('Matches for filter')[1].replace('(', '').trim();

    const el = document.createElement('a');
    el.innerText = `Edit ${filterName} filter`;
    el.href = "#";
    el.style.marginLeft = "10px";
    el.addEventListener("click", e => {
      e.preventDefault();
      localStorage.setItem("notify-filter-name", filterName);
      window.location.href = '/user.php?action=notify';
    });
    div.append(el);
  });
}

if (curLoc.includes("user.php?action=notify")) {
  const filterName = localStorage.getItem("notify-filter-name");

  const allWrappers = [];
  const toggleMap = new Map();

  // Create global expand/collapse control
  const controls = document.createElement('div');
  controls.style.margin = '1em 0';
  const toggleAllBtn = document.createElement('button');
  toggleAllBtn.textContent = 'Expand All';
  toggleAllBtn.style.margin = '10px';
  toggleAllBtn.style.padding = '4px 8px';
  toggleAllBtn.style.cursor = 'pointer';
  toggleAllBtn.style.border = '1px solid #ccc';
  toggleAllBtn.style.borderRadius = '4px';
  toggleAllBtn.style.background = '#f5f5f5';

  let allExpanded = false;

  toggleAllBtn.addEventListener('click', () => {
    allWrappers.forEach(({ wrapper, form, indicator }) => {
      const expand = !allExpanded;
      wrapper.style.maxHeight = expand ? form.scrollHeight + 'px' : '0';
      wrapper.style.pointerEvents = expand ? 'auto' : 'none';
      wrapper.dataset.expanded = expand ? 'true' : 'false';
      indicator.textContent = expand ? ' ▼' : ' ▶';
    });
    allExpanded = !allExpanded;
    toggleAllBtn.textContent = allExpanded ? 'Collapse All' : 'Expand All';
  });

  document.querySelector('#content').prepend(controls);
  controls.appendChild(toggleAllBtn);

  let targetToExpand = null;

  document.querySelectorAll('div.head').forEach(div => {
    const form = div.nextElementSibling;
    if (!form || form.tagName !== 'FORM') return;

    // Create wrapper
    const wrapper = document.createElement('div');
    form.parentNode.insertBefore(wrapper, form);
    wrapper.appendChild(form);
    wrapper.style.overflow = 'hidden';
    wrapper.style.transition = 'max-height 0.4s ease';
    wrapper.style.maxHeight = '0';
    wrapper.style.pointerEvents = 'none';
    wrapper.dataset.expanded = 'false';

    // Style header
    div.style.cursor = 'pointer';
    div.style.userSelect = 'none';
    div.style.borderRadius = '6px';
    div.style.padding = '6px 10px';
    div.style.marginBottom = '4px';
    div.style.transition = 'background-color 0.2s, color 0.2s';

    const originalTextColor = div.style.color || 'inherit';

    div.addEventListener('mouseenter', () => {
      div.style.backgroundColor = '#e0f0ff'; // light blue
      div.style.color = '#000'; // black text for contrast
    });
    div.addEventListener('mouseleave', () => {
      div.style.backgroundColor = '';
      div.style.color = originalTextColor;
    });

    // Indicator
    const indicator = document.createElement('span');
    indicator.textContent = ' ▶';
    indicator.style.marginLeft = '6px';
    div.appendChild(indicator);

    const toggle = (expand) => {
      wrapper.style.maxHeight = expand ? form.scrollHeight + 'px' : '0';
      wrapper.style.pointerEvents = expand ? 'auto' : 'none';
      wrapper.dataset.expanded = expand ? 'true' : 'false';
      indicator.textContent = expand ? ' ▼' : ' ▶';
    };

    div.addEventListener('click', () => {
      const isOpen = wrapper.dataset.expanded === 'true';
      toggle(!isOpen);
    });

    allWrappers.push({ wrapper, form, indicator });
    toggleMap.set(div, toggle);

    // Adjust wrapper height when textarea resizes
    const observer = new ResizeObserver(() => {
      if (wrapper.dataset.expanded === 'true') {
        wrapper.style.maxHeight = form.scrollHeight + 'px';
      }
    });

    // Observe resizing to auto-expand wrapper
    form.querySelectorAll('textarea').forEach(textarea => {
      observer.observe(textarea);

      // Dynamic initial sizing
      textarea.removeAttribute('rows');
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = (scrollHeight * 1.2) + 'px';
      textarea.style.resize = 'vertical';
    });

    if (filterName && div.querySelector(`[title="RSS Feed - ${filterName}"]`)) {
      targetToExpand = { div, form, toggle };
    }

    const textarea = form.querySelector('textarea[name="tags"]');

    const tagsTextarea = form.querySelector('textarea[name="tags"]');
    const notTagsTextarea = form.querySelector('textarea[name="nottags"]');

    const tags = tagsTextarea?.value.trim().split(/\s+/).filter(Boolean) || [];
    const notTags = notTagsTextarea?.value.trim().split(/\s+/).filter(Boolean) || [];

    let expression = '';

    if (tags.length > 0) {
      expression += `(${tags.join(' or ')})`;
    }

    if (notTags.length > 0) {
      const notPart = `not (${notTags.join(' or ')})`;
      expression += tags.length > 0 ? ` and ${notPart}` : notPart;
    }

    const taglist = encodeURIComponent(expression);
    const url = `https://www.empornium.is/torrents.php?taglist=${taglist}`;

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.textContent = 'Execute Search';
    anchor.target = '_blank';
    anchor.style.display = 'inline-block';
    anchor.style.padding = '4px 10px';
    anchor.style.border = '1px solid #007bff';
    anchor.style.borderRadius = '4px';
    anchor.style.backgroundColor = '#007bff';
    anchor.style.color = '#fff';
    anchor.style.textDecoration = 'none';
    anchor.style.cursor = 'pointer';
    anchor.style.transition = 'background-color 0.2s ease';

    textarea.insertAdjacentElement('afterend', anchor);
  });

  if (targetToExpand) {
    localStorage.removeItem("notify-filter-name");
    targetToExpand.toggle(true);
    setTimeout(() => {
      targetToExpand.div.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }
}