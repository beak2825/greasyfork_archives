// ==UserScript==
// @name        YouTube Quick Actions (Hide, Not Interested, Don’t Recommend, Save to Playlist)
// @description Adds quick-action buttons like Hide, Save to Playlist, Not Interested, and Don’t Recommend
// @version     2.0.1.8
// @match       https://www.youtube.com/*
// @license     Unlicense
// @icon        https://www.youtube.com/s/desktop/c722ba88/img/logos/favicon_144x144.png
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @run-at      document-start
// @compatible  firefox
// @require     https://cdnjs.cloudflare.com/ajax/libs/loglevel/1.9.2/loglevel.min.js
// @namespace   https://greasyfork.org/users/1223791
// @downloadURL https://update.greasyfork.org/scripts/533514/YouTube%20Quick%20Actions%20%28Hide%2C%20Not%20Interested%2C%20Don%E2%80%99t%20Recommend%2C%20Save%20to%20Playlist%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533514/YouTube%20Quick%20Actions%20%28Hide%2C%20Not%20Interested%2C%20Don%E2%80%99t%20Recommend%2C%20Save%20to%20Playlist%29.meta.js
// ==/UserScript==

(function ()
{

    "use strict";
    console.log("🫡 [Youtube Quick Actions] Script initialized");

    const css = String.raw;
    const style = css`
:root {
    --color-primary: rgba(252, 146, 205, 1);
    --color-secondary: rgba(33, 225, 255, 1) ;
}

#quick-actions {
	position: absolute;
	display: none;
	flex-direction: column;
	gap: 0.2rem;
	align-items: flex-start;
}

#quick-actions.location-01 {
	top: 0.5rem;
	left: 0.5rem;
}

#quick-actions.location-02 {
	top: 0.4rem;
	left: 0.4rem;
}

.yt-lockup-view-model--collection-stack-2 ~ #quick-actions.location-02 {
    top: 1.4rem;
}

#content-attachment #quick-actions {
    top: 1.2rem;
    left: 1.2rem;
}

ytd-playlist-video-list-renderer #contents ytd-playlist-video-renderer #quick-actions {
    top: 1.4rem;
    left: 4rem;
}

#quick-actions.location-01 .qa-button {
	width: 3rem;
}

#quick-actions.location-02 .qa-button {
	width: 2.6rem;
}

#quick-actions .qa-button {
	background-color: rgba(0, 0, 0, 0.8);
	z-index: 1000;
	border: 1px solid rgba(255, 255, 255, 0.02);
	height: auto;
	display: flex;
	justify-content: center;
	align-items: center;
	color: white;
	font-size: 1.2rem;
	font-weight: bold;
	border-radius: 4px;
	cursor: pointer;
	flex-shrink: unset;
	padding: 0.5rem;
	pointer-events: auto !important;
}

#quick-actions .qa-button.circle {
	border-radius: 50%;
}

#quick-actions .qa-button:hover {
	border: 1px solid rgba(255, 255, 255, 0.02);
	background-color: rgba(0, 0, 0, 1);
}

#quick-actions .qa-icon {
	width: 100%;
	height: 100%;
	max-width: 100%;
	max-height: 100%;
}

:is(
    ytd-grid-video-renderer,
    ytd-video-renderer,
    ytd-rich-item-renderer,
    yt-lockup-view-model,
    ytm-shorts-lockup-view-model-v2,
    ytd-compact-video-renderer,
    ytd-rich-grid-media,
    ytm-shorts-lockup-view-model,
    ytd-compact-movie-renderer,
    ytd-playlist-video-renderer):has(.yt-spec-button-shape-next--enable-backdrop-filter-experiment:not([aria-label="Notify me"])) .qa-button.frosted {
        background-color: rgba(0, 0, 0, 0.3) !important;
        backdrop-filter: blur(4px);
        box-shadow: 0px 0px 1px 0px rgba(255, 255, 255, 0.1);
        border: 0px solid #ffffff;
}

:is(
    ytd-grid-video-renderer,
    ytd-video-renderer,
    ytd-rich-item-renderer,
    yt-lockup-view-model,
    ytm-shorts-lockup-view-model-v2,
    ytd-compact-video-renderer,
    ytd-rich-grid-media,
    ytm-shorts-lockup-view-model,
    ytd-compact-movie-renderer,
    ytd-playlist-video-renderer):has(.yt-spec-button-shape-next--enable-backdrop-filter-experiment:not([aria-label="Notify me"])) .qa-button.frosted:hover {
        opacity: 1;
        background: rgba(40, 40, 40, 0.6)!important;
        border: 0px solid #ffffff;
}

:is(ytd-grid-video-renderer,
    ytd-video-renderer,
    ytd-rich-item-renderer,
    yt-lockup-view-model,
    ytm-shorts-lockup-view-model-v2,
    ytd-compact-video-renderer,
    ytd-rich-grid-media,
    ytm-shorts-lockup-view-model,
    ytd-compact-movie-renderer,
    ytd-playlist-video-renderer):hover:has(ytd-menu-renderer, button-view-model, .yt-spec-button-shape-next__icon):not([is-dismissed]):not(:has(ytd-rich-grid-media[is-dismissed])):not(:has(.ytDismissibleItemReplacedContent)) #quick-actions {
        display: flex;
}

:is(yt-lockup-view-model,
    ytd-playlist-video-renderer):hover:has(#quick-actions) {
	position: relative;
}

.fancy {
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-image: linear-gradient(
        45deg,
        var(--color-primary) 17%,
        var(--color-secondary) 100%
    );
    background-size: 400% auto;
    background-position: 0% 50%;
    animation: animate-gradient 12s linear infinite;
    font-weight: bold!important;
    letter-spacing: .1rem;
}

@keyframes animate-gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
`;

    GM_addStyle(style);

    /* -------------------------------------------------------------------------- */
    /*                                  Variables                                 */
    /* -------------------------------------------------------------------------- */

    //Selectors to probe for prop
    const tags = ["ytd-video-renderer",
        "ytd-rich-item-renderer",
        "ytm-shorts-lockup-view-model-v2",
        "yt-lockup-view-model",
        "ytd-playlist-video-renderer",
        "ytd-grid-video-renderer",
        "ytd-compact-movie-renderer",
        "ytd-compact-video-renderer",
        "ytd-rich-grid-media",
        "ytm-shorts-lockup-view-model"];

    //"YTD-MEMBERSHIP-BADGE-RENDERER";


    //Available menu items obj from prop
    const menu_items_from_props = [
        "menu.menuRenderer.items",
        "content.listViewModel.listItems"
    ];

    //Individual menu items from obj
    const menu_items_1 = "listItemViewModel?.title?.content";
    const menu_items_2 = "menuServiceItemRenderer?.text?.runs?.[0]?.text";
    const menu_items_3 = "menuNavigationItemRenderer?.text?.runs?.[0]?.text";

    //Thumbnail size
    const thumbnail_elem_selector = "img.ytCoreImageHost";

    //Action Button selectors
    const action_button_selectors = ["button-view-model", ".shortsLockupViewModelHostOutsideMetadataMenu", "yt-icon-button"];

    //Action Button Label - Aria Label
    const action_menu_text = ['more actions', 'action menu'];

    //Dropdown Menu
    const dropdown_menu_tag_name = "TP-YT-IRON-DROPDOWN";

    //Dropdown Menu Items
    const popup_menu_items_selector = "yt-formatted-string.style-scope.ytd-menu-service-item-renderer, yt-list-item-view-model[role='menuitem'], yt-formatted-string.ytd-menu-navigation-item-renderer";

    // YT Event Names
    const yt_update_action_names = [
        //"ytd-update-grid-state-action",
        //"ytd-rich-item-index-update-action",
        "yt-reload-continuation-items-command"
    ];

    // Icons by Lucide - ISC License & The MIT License (MIT) (for portions derived from Feather) - Full license -> https://lucide.dev/license
    const icon_not_interested = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="qa-icon lucide lucide-frown-icon lucide-frown"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>`;
    const icon_hide = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off-icon lucide-eye-off qa-icon"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>`;
    const icon_save = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="qa-icon lucide lucide-list-plus-icon lucide-list-plus"><path d="M16 5H3"/><path d="M11 12H3"/><path d="M16 19H3"/><path d="M18 9v6"/><path d="M21 12h-6"/></svg>`;
    const icon_dont_recommend = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="qa-icon lucide lucide-user-x-icon lucide-user-x"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" x2="22" y1="8" y2="13"/><line x1="22" x2="17" y1="8" y2="13"/></svg>`;
    const downloadIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="qa-icon lucide lucide-download-icon lucide-download"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>`;
    const icon_trash = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="qa-icon lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
    const icon_edit = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="qa-icon lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>`;

    /* -------------------------------------------------------------------------- */
    /*                                  Functions                                 */
    /* -------------------------------------------------------------------------- */

    /* ----------------------------- Menu Commmands ----------------------------- */
    let is_logging_enabled = GM_getValue("is_logging_enabled", false);
    let use_frosted = GM_getValue("use_frosted", true);
    let use_circle = GM_getValue("use_circle", false);

    const menu_commands = [
        {
            label: () => `Frosted Button: ${use_frosted ? "✅ ON" : "❌ OFF"}`,
            toggle: () =>
            {
                use_frosted = !use_frosted;
                GM_setValue("use_frosted", use_frosted);
                window.location.reload(true);
            }
        },
        {
            label: () => `Circle Button: ${use_circle ? "✅ ON" : "❌ OFF"}`,
            toggle: () =>
            {
                use_circle = !use_circle;
                GM_setValue("use_circle", use_circle);
                window.location.reload(true);
            }
        },
        {
            label: () => `Logs: ${is_logging_enabled ? "✅ ON" : "❌ OFF"}`,
            toggle: () =>
            {
                is_logging_enabled = !is_logging_enabled;
                GM_setValue("is_logging_enabled", is_logging_enabled);
                window.location.reload(true);
            }
        }
    ];

    function registermenu_commands()
    {
        for (const command of menu_commands)
        {
            GM_registerMenuCommand(command.label(), command.toggle);
        }
    }

    registermenu_commands();

    is_logging_enabled ? log.enableAll() : log.disableAll();

    /* ---------------------------- Menu Commands End --------------------------- */

    function append_buttons(element, menulist_items, position)
    {
        const final_menulist_items = [...new Set(menulist_items)];
        const buttons_to_append = [];

        for (const item of final_menulist_items)
        {
            if (!item) continue;

            let class_name;
            let title_text;
            let icon;

            if (item.startsWith("Remove from "))
            {
                class_name = "remove";
                title_text = "Remove from playlist";
                icon = icon_trash;
            } else
            {
                switch (item)
                {
                    case "Not interested":
                        class_name = "not_interested";
                        title_text = "Not interested";
                        icon = icon_not_interested;
                        break;
                    case "Don't recommend channel":
                        class_name = "dont_recommend_channel";
                        title_text = "Don't recommend channel";
                        icon = icon_dont_recommend;
                        break;
                    case "Hide":
                        class_name = "hide";
                        title_text = "Hide video";
                        icon = icon_hide;
                        break;
                    case "Save to playlist":
                        class_name = "save";
                        title_text = "Save to playlist";
                        icon = icon_save;
                        break;
                    case "Delete":
                        class_name = "delete";
                        title_text = "Delete";
                        icon = icon_trash;
                        break;
                    case "Edit":
                        class_name = "edit";
                        title_text = "Edit";
                        icon = icon_edit;
                        break;
                    default:
                        continue;
                }
            }

            const set_frosted = use_frosted ? " frosted" : "";
            const set_circle = use_circle ? " circle" : "";

            buttons_to_append.push(
                `<button class="qa-button ${set_frosted} ${set_circle} ${class_name}" data-icon="${class_name}" title="${title_text}" data-text="${title_text}">${icon}</button>`,
            );
        }


        const buttons_container = document.createElement("div");
        buttons_container.id = "quick-actions";
        buttons_container.classList.add(position);
        buttons_container.innerHTML = buttons_to_append.join("");
        if (!element.querySelector("#quick-actions"))
        {
            element.insertAdjacentElement("beforeend", buttons_container);
        }
    }

    function get_prop(target, path)
    {
        try
        {
            return new Function('object', `return object.${path}`)(target) ?? [];
        } catch
        {
            return [];
        }
    }


    function get_menu_list(target)
    {
        if (!target) return;

        return target.map(item =>
        {
            const paths = [menu_items_1, menu_items_2, menu_items_3];

            for (const path of paths)
            {
                const result = get_prop(item, path);
                if (result.length) return result;
            }

            return null;
        }).filter(Boolean);
    }

    function enable_fallback_tooltip(selector)
    {
        let active_tooltip = null;
        let current_elem = null;

        const create_tooltip = (text) =>
        {
            const tooltip = document.createElement("div");
            tooltip.id = "quick-action-tooltip";
            Object.assign(tooltip.style, {
                position: "fixed",
                zIndex: "999999",
                background: "rgba(0,0,0,0.8)",
                color: "#fff",
                padding: ".6rem 1rem",
                borderRadius: ".8rem",
                fontSize: "1.5rem",
                pointerEvents: "none",
                top: "-1000px",
                left: "-1000px"
            });
            tooltip.textContent = text;
            document.body.appendChild(tooltip);
            return tooltip;
        };

        document.addEventListener("pointerenter", event =>
        {
            const target_elem = event.target.closest(selector);
            if (!target_elem) return;
            if (current_elem === target_elem) return;
            document.querySelectorAll("#quick-action-tooltip").forEach((element) => element.remove());

            const tooltip_text = target_elem.getAttribute("title") || target_elem.getAttribute("data-text");
            if (!tooltip_text) return;

            if (target_elem.hasAttribute("title"))
            {
                target_elem.setAttribute("data-original-title", tooltip_text);
                target_elem.removeAttribute("title");
            }

            current_elem = target_elem;
            active_tooltip = create_tooltip(tooltip_text);


            const update_position = e =>
            {
                if (!active_tooltip) return;
                active_tooltip.style.left = e.clientX + 8 + "px";
                active_tooltip.style.top = e.clientY + 8 + "px";
            };
            current_elem._tooltip_move = update_position;
            document.addEventListener("pointermove", update_position);
        }, true);

        document.addEventListener("pointerleave", event =>
        {
            const left_elem = event.target.closest(selector);
            if (!left_elem) return;

            if (event.relatedTarget && left_elem.contains(event.relatedTarget))
            {
                return;
            }

            if (active_tooltip)
            {
                document.removeEventListener("pointermove", left_elem._tooltip_move);
                active_tooltip.remove();
                active_tooltip = null;
                delete left_elem._tooltip_move;
            }

            if (left_elem.hasAttribute("data-original-title"))
            {
                left_elem.setAttribute("title", left_elem.getAttribute("data-original-title"));
                left_elem.removeAttribute("data-original-title");
            }

            current_elem = null;
        }, true);
    };

    function get_value_by_path(obj, path)
    {
        return path.split(".").reduce((acc, key) =>
        {
            if (acc && typeof acc === "object" && key in acc)
            {
                return acc[key];
            }
            return undefined;
        }, obj);
    }

    function find_target_path_value(obj)
    {
        if (obj == null || typeof obj !== "object") return null;

        for (const path of menu_items_from_props)
        {
            const value = get_value_by_path(obj, path);
            if (Array.isArray(value))
            {
                log.log(`🎉 Menu Obj Path Used: ${path}`);
                return value;
            }
        }

        for (const key in obj)
        {
            if (obj[key] && typeof obj[key] === "object")
            {
                const found = find_target_path_value(obj[key]);
                if (found !== null) return found;
            }
        }

        return null;
    }

    function find_first_menu_or_list_value(root_element = document)
    {
        const elements = root_element.querySelectorAll("*");
        for (const element of elements)
        {
            if (element.data && typeof element.data === "object")
            {
                const found_value = find_target_path_value(element.data);
                if (found_value !== null)
                {
                    return found_value;
                }
            }
        }
        return null;
    }

    function find_elem_in_parent_dom_tree(origin_elem, tag_names)
    {
        const svg_path_d =
            'M12 16.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM10.5 12c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5zm0-6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5z';

        let node = origin_elem;
        let depth = 0;

        while (node && depth <= 3)
        {
            const found_elems = node.querySelectorAll(tag_names.join(','));
            for (const elem of found_elems)
            {
                // const svg_match = elem.querySelector(`svg path[d='${svg_path_d}']`)
                // if (svg_match) {
                //     return elem
                // }

                const aria_labels = elem.querySelectorAll('[aria-label]');
                const action_button = Array.from(aria_labels).find(element =>
                {

                    if (element.hasAttribute('aria-label'))
                    {
                        const aria_label_text = element.getAttribute('aria-label').toLowerCase();
                        return action_menu_text.some(phrase => aria_label_text.includes(phrase));
                    }

                    return false;
                });
                if (action_button)
                {
                    return elem;
                }
            }

            node = node.parentElement;
            depth++;
        }

        return null;
    }


    async function wait_until(condition_func, { interval = 100, timeout = 3000 } = {})
    {
        const start_time = Date.now();
        while (Date.now() - start_time < timeout)
        {
            const result = condition_func();
            if (result) return result;
            await new Promise((resolve) => setTimeout(resolve, interval));
        }
        throw new Error("⏰ Timeout: Target element is not visible in time");
    }

    function retry_click(element, { max_attempts = 5, interval = 1000 } = {})
    {
        return new Promise((resolve) =>
        {
            let attempts = 0;

            function try_click()
            {
                if (!element || attempts >= max_attempts)
                {
                    log.log("⚠️ Retry failed or element missing.");
                    return resolve();
                }

                const rect = element.getBoundingClientRect();
                const is_visible = rect.width > 0 && rect.height > 0;

                if (is_visible)
                {
                    element.dispatchEvent(
                        new MouseEvent("click", {
                            view: document.defaultView,
                            bubbles: true,
                            cancelable: true,
                        }),
                    );
                    log.log("👇 Clicked matching menu item");
                    return resolve();
                } else
                {
                    attempts++;
                    log.log("👇 Clicking attempt: ", attempts);
                    setTimeout(try_click, interval);
                }
            }

            try_click();
        });
    }

    function get_visible_elem(target_selector, element = document.body)
    {
        const elements = element.querySelectorAll(target_selector);

        if (!elements || elements.length === 0)
        {
            return null;
        }

        for (const element of elements)
        {
            const rect = element.getBoundingClientRect();

            const has_dimensions_and_in_view = rect.width > 0 &&
                rect.height > 0 &&
                rect.bottom > 0 &&
                rect.right > 0 &&
                rect.top < (window.innerHeight || element.documentElement.clientHeight) &&
                rect.left < (window.innerWidth || element.documentElement.clientWidth);

            if (!has_dimensions_and_in_view)
            {
                continue;
            }

            const computed_style = window.getComputedStyle(element);

            const is_visible = computed_style.opacity !== '0' &&
                computed_style.visibility !== 'hidden' &&
                computed_style.display !== 'none';

            if (!is_visible)
            {
                continue;
            }

            log.log("👀 Found visible element:", element);
            return element;
        }

        log.log("⚠️ No visible menu found.");
        return null;
    }

    /* -------------------------------------------------------------------------- */
    /*                                  Listeners                                 */
    /* -------------------------------------------------------------------------- */

    document.addEventListener("mouseover", (event) =>
    {

        const path = event.composedPath();
        for (let element of path)
        {
            const tag = element?.tagName?.toLowerCase();
            if (tag && !element.querySelector("#quick-actions") && tags.includes(tag))
            {
                log.log("⭐ Video Elem: ", element.tagName, element);

                const data = find_first_menu_or_list_value(element);
                const thumbnail_elem = element.querySelector(thumbnail_elem_selector);
                const thumbnail_size =
                    thumbnail_elem?.getClientRects?.().length > 0
                        ? parseInt(thumbnail_elem.getClientRects()[0].width)
                        : 100;
                log.log("🖼️ Thumbnail Size: ", thumbnail_size);
                const container_position = thumbnail_size < 211 ? "location-02" : "location-01";

                if (!data)
                {
                    log.log("⚠️ No props data found.");
                    //NOTE - Observe
                    const liked_playlist = element.querySelectorAll('a[href*="list=LL"]');
                    if (liked_playlist.length > 0)
                    {
                        append_buttons(element, [], container_position);
                    }

                    continue;
                }

                log.log("🎥 Video Menu Props: ", data);

                const menulist_items = get_menu_list(data);
                log.log("📃 Menu items: ", menulist_items);
                append_buttons(element, menulist_items, container_position);
            } else
            {
                continue;
            }
        }
    }, true);

    document.addEventListener("click", async function (event)
    {
        document.querySelectorAll("#quick-action-tooltip").forEach((element) => element.remove());
        const button = event.target.closest(".qa-button");
        if (!button) return;

        event.stopPropagation();
        event.stopImmediatePropagation();
        event.preventDefault();

        const action_type = button.dataset.icon;
        let response;

        switch (action_type)
        {
            case "not_interested":
                response = "Not interested";
                log.log("😴 Marking as not interested");
                break;
            case "dont_recommend_channel":
                response = "Don't recommend channel";
                log.log("🚫 Don't recommend channel");
                break;
            case "hide":
                response = "Hide";
                log.log("🗑️ Hiding video");
                break;
            case "remove":
                response = "Remove from";
                log.log("🗑️ Remove from playlist");
                break;
            case "save":
                response = "Save to playlist";
                log.log("📂 Saving to playlist");
                break;
            case "edit":
                response = "Edit";
                log.log("✏️ Edit");
                break;
            case "delete":
                response = "Delete";
                log.log("🗑️ Delete");
                break;
            default:
                log.log("☠️ Unknown action");
        }

        const menus = find_elem_in_parent_dom_tree(
            button,
            action_button_selectors
        );
        if (!menus)
        {
            log.log("❌ Menu button not found.");
            return;
        }

        log.log("🎯 Menu button found:", menus);

        if (menus.id.toLowerCase() === "button")
        {
            menus.dispatchEvent(new MouseEvent("click", { bubbles: false }));
        } else
        {
            menus.querySelector("button").dispatchEvent(new MouseEvent("click", { bubbles: false }));
        }

        log.log("👇 Button clicked, waiting for menu...");

        try
        {
            const visible_menu = await wait_until(() => get_visible_elem(dropdown_menu_tag_name), {
                interval: 100,
                timeout: 3000,
            });

            if (visible_menu)
            {
                try
                {
                    const target_item = await wait_until(
                        () =>
                        {
                            const items = visible_menu.querySelectorAll(popup_menu_items_selector);
                            return items.length > 0 ? items : null;
                        },
                        {
                            interval: 100,
                            timeout: 5000,
                        },
                    );

                    if (target_item)
                    {
                        log.log("🎉 Target items found:", target_item);

                        for (const item of target_item)
                        {
                            const item_text = (item?.textContent || "").trim().toLowerCase();
                            const response_text = (response || "").trim().toLowerCase();

                            if (
                                item_text === response_text ||
                                (response_text === "remove from" && item_text.startsWith("remove from"))
                            )
                            {
                                log.log(`✅ Matched: (${response_text} = ${item_text})`);
                                log.log(`✅`, item);

                                const button = item;
                                await retry_click(button, { max_attempts: 3, interval: 1000 }).finally(() =>
                                {
                                    document.body.click();
                                });
                                break;
                            } else
                            {
                                log.log(`❌ Not a match: (${response_text} = ${item_text})`);
                            }
                        }
                    }
                } catch (error)
                {
                    log.log("🛑 !", error.message);
                }
            }

        } catch (error)
        {
            log.log("🛑 !!", error.message);
        }
    });

    document.addEventListener("yt-action", (event) =>
    {
        if (yt_update_action_names.includes(event.detail.actionName))
        {
            log.log("🐛 Page updated.");
            document.querySelectorAll("#quick-actions").forEach((element) => element.remove());
        }
    });

    enable_fallback_tooltip(".qa-button");

    /* -------------------------------------------------------------------------- */
    /*         This script is brought to you in support of FIFTY FIFTY 💖         */
    /* -------------------------------------------------------------------------- */

    if ("💖")
    {
        const selectors_to_watch = ['a', 'yt-formatted-string', '.yt-core-attributed-string'];
        const observed_elements = new WeakMap();
        const target_texts = [
            "FIFTY FIFTY Official",
            "FIFTY FIFTY",
            "@WE_FIFTYFIFTY"
        ];

        function has_matching_text(element)
        {
            const text = element.textContent.trim();
            return target_texts.includes(text);
        }

        function observe_text_content_changes(element)
        {
            if (observed_elements.has(element)) return;

            const element_observer = new MutationObserver(() =>
            {
                element.classList.toggle("fancy", has_matching_text(element));
            });

            observed_elements.set(element, element_observer);
            element_observer.observe(element, { characterData: true, childList: true, subtree: true });
        }

        function handle_removed_node(node)
        {
            if (node.nodeType !== 1) return;
            if (observed_elements.has(node))
            {
                observed_elements.get(node).disconnect();
                observed_elements.delete(node);
            }
            node.querySelectorAll(selectors_to_watch.join(',')).forEach(child =>
            {
                if (observed_elements.has(child))
                {
                    observed_elements.get(child).disconnect();
                    observed_elements.delete(child);
                }
            });
        }

        function init()
        {
            document.querySelectorAll(selectors_to_watch.join(',')).forEach(element =>
            {
                if (has_matching_text(element)) element.classList.add("fancy");
                observe_text_content_changes(element);
            });

            const observer = new MutationObserver(mutations =>
            {
                for (const mutation of mutations)
                {
                    for (const node of mutation.addedNodes)
                    {
                        if (node.nodeType !== 1) continue;
                        for (const selector of selectors_to_watch)
                        {
                            const elements = node.matches(selector) ? [node] : node.querySelectorAll(selector);
                            elements.forEach(element =>
                            {
                                if (has_matching_text(element)) element.classList.add("fancy");
                                observe_text_content_changes(element);
                            });
                        }
                    }
                    for (const node of mutation.removedNodes)
                    {
                        handle_removed_node(node);
                    }
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }

        if (document.body)
        {
            init();
        } else
        {
            new MutationObserver((_, obs) =>
            {
                if (document.body)
                {
                    obs.disconnect();
                    init();
                }
            }).observe(document.documentElement, { childList: true });
        }
    }
})();
