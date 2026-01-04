
// ==UserScript==
// @name         github-file-icon
// @namespace    github-file-icon
// @description  change github file icon
// @version      1.0.0
// @author       roojay <roojay520@gmail.com>
// @homepage     https://github.com/roojay520/github-file-icon
// @license      MIT

// @include      https://github.com/*
// @run-at       document-start

// @require      https://cdn.jsdelivr.net/npm/file-icons-js@1.0.3/index.min.js
// @noframes
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/407891/github-file-icon.user.js
// @updateURL https://update.greasyfork.org/scripts/407891/github-file-icon.meta.js
// ==/UserScript==

(function (FileIcons) {
	'use strict';

	FileIcons = FileIcons && Object.prototype.hasOwnProperty.call(FileIcons, 'default') ? FileIcons['default'] : FileIcons;

	const hasLoaded = () => document.readyState === 'interactive' || document.readyState === 'complete';

	const domLoaded = new Promise(resolve => {
		if (hasLoaded()) {
			resolve();
		} else {
			document.addEventListener('DOMContentLoaded', () => {
				resolve();
			}, {
				capture: true,
				once: true,
				passive: true
			});
		}
	});

	Object.defineProperty(domLoaded, 'hasLoaded', {
		get: () => hasLoaded()
	});

	var domLoaded_1 = domLoaded;

	// Types inspired by
	// https://github.com/Microsoft/TypeScript/blob/9d3707d/src/lib/dom.generated.d.ts#L10581
	// Type predicate for TypeScript
	function isQueryable(object) {
	    return typeof object.querySelectorAll === 'function';
	}
	function select(selectors, baseElement) {
	    // Shortcut with specified-but-null baseElement
	    if (arguments.length === 2 && !baseElement) {
	        return null;
	    }
	    return (baseElement !== null && baseElement !== void 0 ? baseElement : document).querySelector(String(selectors));
	}
	function selectLast(selectors, baseElement) {
	    // Shortcut with specified-but-null baseElement
	    if (arguments.length === 2 && !baseElement) {
	        return null;
	    }
	    const all = (baseElement !== null && baseElement !== void 0 ? baseElement : document).querySelectorAll(String(selectors));
	    return all[all.length - 1];
	}
	/**
	 * @param selectors      One or more CSS selectors separated by commas
	 * @param [baseElement]  The element to look inside of
	 * @return               Whether it's been found
	 */
	function selectExists(selectors, baseElement) {
	    if (arguments.length === 2) {
	        return Boolean(select(selectors, baseElement));
	    }
	    return Boolean(select(selectors));
	}
	function selectAll(selectors, baseElements) {
	    // Shortcut with specified-but-null baseElements
	    if (arguments.length === 2 && !baseElements) {
	        return [];
	    }
	    // Can be: select.all('selectors') or select.all('selectors', singleElementOrDocument)
	    if (!baseElements || isQueryable(baseElements)) {
	        const elements = (baseElements !== null && baseElements !== void 0 ? baseElements : document).querySelectorAll(String(selectors));
	        return Array.apply(null, elements);
	    }
	    const all = [];
	    for (let i = 0; i < baseElements.length; i++) {
	        const current = baseElements[i].querySelectorAll(String(selectors));
	        for (let ii = 0; ii < current.length; ii++) {
	            all.push(current[ii]);
	        }
	    }
	    // Preserves IE11 support and performs 3x better than `...all` in Safari
	    const array = [];
	    all.forEach(function (v) {
	        array.push(v);
	    });
	    return array;
	}
	select.last = selectLast;
	select.exists = selectExists;
	select.all = selectAll;

	var __async = (__this, __arguments, generator) => {
	  return new Promise((resolve, reject) => {
	    var fulfilled = (value) => {
	      try {
	        step(generator.next(value));
	      } catch (e) {
	        reject(e);
	      }
	    };
	    var rejected = (value) => {
	      try {
	        step(generator.throw(value));
	      } catch (e) {
	        reject(e);
	      }
	    };
	    var step = (result) => {
	      return result.done ? resolve(result.value) : Promise.resolve(result.value).then(fulfilled, rejected);
	    };
	    step((generator = generator.apply(__this, __arguments)).next());
	  });
	};
	const FILE_NAME_SELECTOR = 'div.js-navigation-item > div[role="rowheader"] > span';
	const FILE_ICON_SELECTOR = 'div.js-navigation-item > div[role="gridcell"]:first-child';
	const FILE_LIST_WRAPPER = ".repository-content .Box.mb-3";
	const update = () => {
	  const filenameDoms = select.all(FILE_NAME_SELECTOR);
	  const iconDoms = select.all(FILE_ICON_SELECTOR);
	  for (let i = 0; i < filenameDoms.length; i += 1) {
	    const filename = filenameDoms[i].innerText.trim();
	    const iconDom = iconDoms[i].querySelector(".octicon");
	    const isDirectory = iconDom.classList.contains("octicon-file-directory");
	    const className =  FileIcons.getClassWithColor(filename);
	    if (className && !isDirectory) {
	      const icon = document.createElement("span");
	      icon.className = `icon octicon ${className}`;
	      iconDom.parentNode.replaceChild(icon, iconDom);
	    }
	  }
	};
	const observer = new MutationObserver(update);
	const observeFragment = () => {
	  const ajaxFiles = select(FILE_LIST_WRAPPER);
	  if (ajaxFiles) {
	    observer.observe(ajaxFiles, {
	      childList: true
	    });
	  }
	};
	const init = () => __async(undefined, [], function* () {
	  observeFragment();
	  yield domLoaded_1;
	  update();
	  document.addEventListener("pjax:end", update);
	  document.addEventListener("pjax:end", observeFragment);
	});
	init();

}(FileIcons));
