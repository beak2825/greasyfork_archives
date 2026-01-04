// ==UserScript==
// @name         YouTube - Non-Rounded Design (Fix) + Other Improvements.
// @version      6.3.0
// @description  This script disables YouTube's new rounded corners (reverts back to the previous layout from 2021.)
// @author       Magma_Craft (Original author) + Eterve Nalle (some fix´s)
// @license      MIT
// @match        https://www.youtube.com/*
// @namespace    https://greasyfork.org/en/users/933798
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526935/YouTube%20-%20Non-Rounded%20Design%20%28Fix%29%20%2B%20Other%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/526935/YouTube%20-%20Non-Rounded%20Design%20%28Fix%29%20%2B%20Other%20Improvements.meta.js
// ==/UserScript==

// Attributes to remove from <html>
const ATTRS = [
    "darker-dark-theme",
    "darker-dark-theme-deprecate",
    "refresh"
];

// Regular config keys.
const CONFIGS = {
    BUTTON_REWORK: false
}

// Experiment flags.
const EXPFLAGS = {
    enable_channel_page_header_profile_section: false,
    enable_header_channel_handler_ui: false,
    kevlar_unavailable_video_error_ui_client: false,
    kevlar_refresh_on_theme_change: false,
    kevlar_modern_sd_v2: false,
    kevlar_watch_cinematics: false,
    kevlar_watch_comments_panel_button: false,
    kevlar_watch_grid: false,
    kevlar_watch_grid_hide_chips: false,
    kevlar_watch_metadata_refresh_no_old_secondary_data: false,
    kevlar_watch_modern_panels: false,
    kevlar_watch_panel_height_matches_player: false,
    smartimation_background: false,
    web_amsterdam_playlists: false,
    web_animated_actions: false,
    web_animated_like: false,
    web_animated_like_lazy_load: false,
    web_button_rework: true,
    web_button_rework_with_live: true,
    web_darker_dark_theme: false,
    web_enable_youtab: false,
    web_guide_ui_refresh: false,
    web_modern_ads: false,
    web_modern_buttons: true,
    web_modern_chips: false,
    web_modern_collections_v2: false,
    web_modern_dialogs: false,
    web_modern_playlists: false,
    web_modern_subscribe: true,
    web_modern_tabs: false,
    web_modern_typography: false,
    web_rounded_containers: false,
    web_rounded_thumbnails: false,
    web_searchbar_style: "default",
    web_segmented_like_dislike_button: false,
    web_sheets_ui_refresh: false,
    web_snackbar_ui_refresh: false,
    web_watch_rounded_player_large: false,
    // Extra additions to remove the watch grid UI
    web_player_enable_featured_product_banner_exclusives_on_desktop: false,
    kevlar_watch_comments_panel_button: false,
    fill_view_models_on_web_vod: true,
    kevlar_watch_flexy_metadata_height: "136",
    kevlar_watch_max_player_width: "1280",
    live_chat_over_engagement_panels: false,
    live_chat_scaled_height: false,
    live_chat_smaller_min_height: false,
    main_app_controller_extraction_batch_18: false,
    main_app_controller_extraction_batch_19: false,
    no_iframe_for_web_stickiness: false,
    optimal_reading_width_comments_ep: false,
    remove_masthead_channel_banner_on_refresh: false,
    small_avatars_for_comments: false,
    small_avatars_for_comments_ep: false,
    web_watch_compact_comments: false,
    web_watch_compact_comments_header: false,
    web_watch_log_theater_mode: false,
    web_watch_theater_chat: false,
    web_watch_theater_fixed_chat: false,
    wn_grid_max_item_width: 0,
    wn_grid_min_item_width: 0
}

// Player flags
// !!! USE STRINGS FOR VALUES !!!
// For example: "true" instead of true
const PLYRFLAGS = {
    web_rounded_containers: "false",
    web_rounded_thumbnails: "false"
}

class YTP {
    static observer = new MutationObserver(this.onNewScript);

    static _config = {};

    static isObject(item) {
        return (item && typeof item === "object" && !Array.isArray(item));
    }

static mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
        Object.keys(source).forEach(key => {
            if (this.isObject(source[key])) {
                if (!target[key]) target[key] = {};
                this.mergeDeep(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        });
    }

    return this.mergeDeep(target, ...sources);
}


static onNewScript(mutations) {
    mutations.forEach(mut => {
        mut.addedNodes.forEach(() => YTP.bruteforce());
    });
}

    static start() {
        this.observer.observe(document, {childList: true, subtree: true});
    }

    static stop() {
        this.observer.disconnect();
    }

    static bruteforce() {
        if (!window.yt) return;
        if (!window.yt.config_) return;

        this.mergeDeep(window.yt.config_, this._config);
    }

    static setCfg(name, value) {
        this._config[name] = value;
    }

    static setCfgMulti(configs) {
        this.mergeDeep(this._config, configs);
    }

    static setExp(name, value) {
        if (!("EXPERIMENT_FLAGS" in this._config)) this._config.EXPERIMENT_FLAGS = {};

        this._config.EXPERIMENT_FLAGS[name] = value;
    }

    static setExpMulti(exps) {
        if (!("EXPERIMENT_FLAGS" in this._config)) this._config.EXPERIMENT_FLAGS = {};

        this.mergeDeep(this._config.EXPERIMENT_FLAGS, exps);
    }

static decodePlyrFlags(flags) {
    return flags.split("&").reduce((obj, flag) => {
        const [key, value] = flag.split("=");
        obj[key] = value;
        return obj;
    }, {});
}

static encodePlyrFlags(flags) {
    return Object.keys(flags).map(key => `${key}=${flags[key]}`).join("&");
}

static setPlyrFlags(flags) {
    if (!window.yt?.config_?.WEB_PLAYER_CONTEXT_CONFIGS) return;

    const conCfgs = window.yt.config_.WEB_PLAYER_CONTEXT_CONFIGS;
    if (!("WEB_PLAYER_CONTEXT_CONFIGS" in this._config)) this._config.WEB_PLAYER_CONTEXT_CONFIGS = {};

    Object.entries(conCfgs).forEach(([cfg, config]) => {
        const dflags = this.decodePlyrFlags(config.serializedExperimentFlags);
        this.mergeDeep(dflags, flags);
        this._config.WEB_PLAYER_CONTEXT_CONFIGS[cfg] = {
            serializedExperimentFlags: this.encodePlyrFlags(dflags)
        };
    });
}
}

window.addEventListener("yt-page-data-updated", function tmp() {
    YTP.stop();
    ATTRS.forEach(attr => document.documentElement.removeAttribute(attr));
    window.removeEventListener("yt-page-data-updated", tmp);
});

YTP.start();

YTP.setCfgMulti(CONFIGS);
YTP.setExpMulti(EXPFLAGS);
YTP.setPlyrFlags(PLYRFLAGS);

const $ = q => document.querySelector(q);

(function() {
let css = `

/*Agrega bordes a la compilacion de videos "Mi mix" que aparecen en recomendados*/
div.yt-spec-touch-feedback-shape.yt-spec-touch-feedback-shape--touch-response.yt-spec-touch-feedback-shape--is-extended.yt-spec-touch-feedback-shape--trigger-events { margin-top: 0px !important }
div.yt-lockup-view-model-wiz.yt-lockup-view-model-wiz--horizontal.yt-lockup-view-model-wiz--collection-stack-2.yt-lockup-view-model-wiz--compact { border-radius: 8px !important; border: 0.01px solid rgb(255 255 255 / 10%) !important; padding-top: 10px !important }
ytd-watch-flexy[flexy] #player-container-inner.ytd-watch-flexy { padding-top: 397px !important }

/*Oculta el botón unirse al reproducir un video*/
#sponsor-button ytd-button-renderer button { display: none !important; transform: translate(230px, -4px) !important; height: 37px !important; border-radius: 2px !important; text-transform: uppercase !important }

/*Poner a la derecha al botón suscribirse*/
#owner.ytd-watch-metadata { justify-content: space-between !important }

/*centra los botones que estan debajo del reproductor (no los que estan dentro)*/
ytd-watch-metadata:not([flex-menu-enabled]) #top-row.ytd-watch-metadata, ytd-watch-metadata[skinny-mode] #top-row.ytd-watch-metadata { justify-content: center !important }

/*evita que el precionar en la imagen del autor del video en los comentarios respondidos se habra los comentarios*/
div#creator-thumbnail.creator-thumbnail.style-scope.ytd-comment-replies-renderer { pointer-events: none !important }

/*ocultar punto molesto entre la imagen del autor con el botón "respuestas"*/
span.dot.style-scope.ytd-comment-replies-renderer { display: none !important }

/*Menu "..." en los videos recomendados*/
#queue-button.ytd-compact-video-renderer ytd-button-renderer .ytd-button-renderer[style-target=button], ytd-compact-video-renderer ytd-menu-renderer .ytd-menu-renderer[style-target=button] { --yt-icon-button-icon-height: 20px !important; --yt-icon-button-icon-width: 20px !important; width: 20px !important; height: 20px !important; transform: translate(-3px, 5px) !important }

/*modifica el tamaño del cuadro del texto*/
ytd-watch-metadata[modern-metapanel] #description-inner.ytd-watch-metadata, #description-inner.ytd-watch-metadata { margin: 0px !important; border: 0.01px solid rgb(255 255 255 / 20%) !important ; border-radius: 8px !important ; padding: 10px !important }

/*modifica el tamaño del texto interno de la descripción del video,adectando al tamaño del cuadro general*/
ytd-text-inline-expander { min-height: 35px !important }

/*Modifica el cuadro de "Mostrar Menos" en al descripción del video*/
#collapse.ytd-text-inline-expander { border: 0.01px solid rgb(255 255 255 / 10%) !important; padding: 5px !important; border-radius: 8px !important }

/*Cambia la apariencia del botón de "respuesta en los comentario que el autor halla respondido"*/
#expander.ytd-comment-replies-renderer .expander-header.ytd-comment-replies-renderer[teaser] #less-replies.ytd-comment-replies-renderer, #expander.ytd-comment-replies-renderer .expander-header.ytd-comment-replies-renderer[teaser] #more-replies.ytd-comment-replies-renderer { border-radius: 8px !important; margin: 0px 0px 15px 0px !important; border: 0.01px solid rgb(255 255 255 / 10%) !important; padding: 10px 0px 0px 0px !important; transform: translate(-55px, 4.5px) !important; max-height: 25px !important; padding-left: 55px !important }
#channel-name.ytd-video-owner-renderer { font-size: 1.4rem !important; line-height: 2rem !important }
#info.ytd-video-primary-info-renderer { height: 40px !important }


/* Cambia la apariencia del botón de "respuestas" en los comentarios*/
button.yt-spec-button-shape-next.yt-spec-button-shape-next--text.yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading { border-radius: 8px !important; margin: 5px 0px 5px 0px !important; border: 0.01px solid rgb(255 255 255 / 10%) !important }

/*Modifica el botón "Mostrar transcripción"*/
.yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--outline { height: 37px !important; padding: 0 11px 0 11px !important; background: transparent !important; border: 0.01px solid rgb(255 255 255 / 10%); border-radius: 8px !important; text-transform: uppercase !important; letter-spacing: 0.5px !important }



/*Centra toda la columna debajo del reproductor cuando entras en el modo "cine" dejando un borde izquierdo al lado de la columna*/
ytd-watch-flexy[full-bleed-player] #columns.ytd-watch-flexy { margin-left: 70px !important }

/*Modifica la ventana que "video siguiente" en el reproductor de video al poner el mouse sobre el botón "siguiente"*/
.ytp-tooltip.ytp-text-detail.ytp-preview { width: auto !important; height: auto !important; transform: translateY(-6px) !important }

/*Mueve toda la columna donde está el reproductor un poco al izquierda*/
div#primary-inner.style-scope.ytd-watch-flexy { transform: translateX(-15px) !important }

/*Mueve la columna entera de videos recomendados cuando reproduces un video*/
ytd-watch-flexy[flexy] #secondary.ytd-watch-flexy { padding-right: var(--ytd-margin-6x) !important; width: var(--ytd-watch-flexy-sidebar-width) !important; min-width: var(--ytd-watch-flexy-sidebar-min-width) !important; transform: translateX(40px) !important }

/*Aumenta la distancia entre el botón "respuesta" con los comentarios debajo de ella al precionrlo*/
.yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--text { margin-bottom: 10px !important }

/*Evita el la aparicion del scroll lateral en pantalla completa al ver un short*/
ytd-app[scrolling] { overflow-x: unset !important }

/*Modifica el borde de la seccion de videos recomendados al reproducir un video*/
/*ytd-compact-video-renderer.style-scope.ytd-item-section-renderer, ytd-compact-playlist-renderer, ytd-compact-radio-renderer, ytd-compact-movie-renderer { margin-top: 8px !important; border: 0.01px solid rgb(255 255 255 / 10%) !important; padding: 5px !important; border-radius: 8px !important }*/
ytd-compact-video-renderer { border: 0.01px solid rgb(255 255 255 / 10%) !important; padding: 5px !important; border-radius: 8px !important }


/*Configura solo la ventana que aparece al poner el mouse sobre la fecha y cantidad de visitas en la descripción*/
/*#tooltip.tp-yt-paper-tooltip { position: relative !important; border-radius: 20px !important; transform: translate(-233px, -77px) }*/ /*border-radius: 2px origin*/
tp-yt-paper-tooltip.style-scope.ytd-watch-info-text #tooltip { border-radius: 20px !important; transform: translate(-225px, -77px) !important; max-width: 18vw !important; white-space: nowrap !important; text-overflow: ellipsis !important; overflow: hidden !important }


/*Modifica el border en los comentarios*/
ytd-comment-view-model { border: 0.01px solid rgb(255 255 255 / 10%) !important; padding: 5px !important; border-radius: 10px !important }

/*Ajusta el tamaño del reproductor (videos de tamaños muy grandes a tamaño estandar-normal)*/
div#primary.style-scope.ytd-watch-flexy, ytd-watch-flexy[flexy] #player-container-outer.ytd-watch-flexy {
  max-width: 709px !important;
  min-width: auto !important;
  max-height: 397px !important;
  min-height: auto !important;
}

ytd-watch-flexy[flexy] #player-container-outer.ytd-watch-flexy {
  background-color: #000000 !important;
}

div#player-container-inner.style-scope.ytd-watch-flexy { position: unset !important }

/*Configura solo la ventana que aparece al poner el mouse sobre la fecha y cantidad de visitas en la descripción*/

/*#tooltip.tp-yt-paper-tooltip { position: relative !important; border-radius: 20px !important; transform: translate(-233px, -75px) }*/ /*border-radius: 2px origin*/
tp-yt-paper-tooltip.style-scope.ytd-watch-info-text #tooltip { border-radius: 20px !important; transform: translate(-225px, -75px) !important; max-width: 18vw !important; white-space: nowrap !important; text-overflow: ellipsis !important; overflow: hidden !important }


/* Revert old background color and buttons */

html[dark] { --yt-spec-general-background-a: #181818 !important; --yt-spec-general-background-b: #0f0f0f !important; --yt-spec-brand-background-primary: rgba(33, 33, 33, 0.98) !important; --yt-spec-10-percent-layer: rgba(255, 255, 255, 0.1) !important }
html:not([dark]) { --yt-spec-general-background-a: #f9f9f9 !important; --yt-spec-general-background-b: #f1f1f1 !important; --yt-spec-brand-background-primary: rgba(255, 255, 255, 0.98) !important; --yt-spec-10-percent-layer: rgba(0, 0, 0, 0.1) !important }

ytd-masthead { background: var(--yt-spec-brand-background-solid) !important }
ytd-app { background: var(--yt-spec-general-background-a) !important }
ytd-browse[page-subtype="channels"] { background: var(--yt-spec-general-background-b) !important }
ytd-c4-tabbed-header-renderer { --yt-lightsource-section1-color: var(--yt-spec-general-background-a) !important }
#page-header.ytd-tabbed-page-header, #tabs-inner-container.ytd-tabbed-page-header { background: var(--yt-spec-general-background-a) !important }
#tabs-divider.ytd-c4-tabbed-header-renderer, #tabs-divider.ytd-tabbed-page-header { border-bottom: 0 !important }
ytd-mini-guide-renderer, ytd-mini-guide-entry-renderer { background-color: var(--yt-spec-brand-background-solid) !important }
#cinematics.ytd-watch-flexy { display: none !important }
#header.ytd-rich-grid-renderer { width: 100% !important }
[page-subtype="home"] #chips-wrapper.ytd-feed-filter-chip-bar-renderer { background-color: var(--yt-spec-brand-background-primary) !important; border-top: 1px solid var(--yt-spec-10-percent-layer) !important; border-bottom: 1px solid var(--yt-spec-10-percent-layer) !important }
ytd-feed-filter-chip-bar-renderer[is-dark-theme] #left-arrow.ytd-feed-filter-chip-bar-renderer::after { background: linear-gradient(to right, var(--yt-spec-brand-background-primary) 20%, rgba(33, 33, 33, 0) 80%) !important }
ytd-feed-filter-chip-bar-renderer[is-dark-theme] #right-arrow.ytd-feed-filter-chip-bar-renderer::before { background: linear-gradient(to left, var(--yt-spec-brand-background-primary) 20%, rgba(33, 33, 33, 0) 80%) !important }
ytd-feed-filter-chip-bar-renderer #left-arrow-button.ytd-feed-filter-chip-bar-renderer, ytd-feed-filter-chip-bar-renderer #right-arrow-button.ytd-feed-filter-chip-bar-renderer { background-color: var(--yt-spec-brand-background-primary) !important }
yt-chip-cloud-renderer[is-dark-theme] #right-arrow.yt-chip-cloud-renderer::before { background: linear-gradient(to left, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(24, 24, 24, 0) 90%) !important }
yt-chip-cloud-renderer #left-arrow-button.yt-chip-cloud-renderer, yt-chip-cloud-renderer #right-arrow-button.yt-chip-cloud-renderer { background: var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) !important }
yt-chip-cloud-renderer[is-dark-theme] #left-arrow.yt-chip-cloud-renderer::after { background: linear-gradient(to right, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(24, 24, 24, 0) 90%) !important }
yt-chip-cloud-renderer #left-arrow.yt-chip-cloud-renderer::after { background: linear-gradient(to right, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(249, 249, 249, 0) 90%) !important }
yt-chip-cloud-renderer #right-arrow.yt-chip-cloud-renderer::before { background: linear-gradient(to left, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(249, 249, 249, 0) 90%) !important }
ytd-feed-filter-chip-bar-renderer[component-style="FEED_FILTER_CHIP_BAR_STYLE_TYPE_HASHTAG_LANDING_PAGE"] #chips-wrapper.ytd-feed-filter-chip-bar-renderer, ytd-feed-filter-chip-bar-renderer[component-style="FEED_FILTER_CHIP_BAR_STYLE_TYPE_CHANNEL_PAGE_GRID"] #chips-wrapper.ytd-feed-filter-chip-bar-renderer { background-color: var(--yt-spec-general-background-b) !important }
yt-chip-cloud-chip-renderer { height: 32px !important; border: 1px solid var(--yt-spec-10-percent-layer) !important; border-radius: 16px !important; box-sizing: border-box !important }
yt-chip-cloud-chip-renderer[chip-style=STYLE_DEFAULT] #chip-container.yt-chip-cloud-chip-renderer, yt-chip-cloud-chip-renderer[chip-style=STYLE_HOME_FILTER] #chip-container.yt-chip-cloud-chip-renderer { height: 32px; border-radius: 16px !important }
/* Remove rounded corners on buttons and boxes */
#container.ytd-searchbox, .ytSearchboxComponentInputBox { background-color: var(--ytd-searchbox-background) !important; border-radius: 2px 0 0 2px !important; box-shadow: inset 0 1px 2px var(--ytd-searchbox-legacy-border-shadow-color) !important; color: var(--ytd-searchbox-text-color) !important; padding: 2px 6px !important }
ytd-searchbox[desktop-searchbar-style="rounded_corner_dark_btn"] #searchbox-button.ytd-searchbox { display: none !important }
ytd-searchbox[desktop-searchbar-style="rounded_corner_light_btn"] #searchbox-button.ytd-searchbox { display: none !important }
#search[has-focus] #search-input, .ytSearchboxComponentInputBoxHasFocus input { margin-left: 32px !important }
#search-icon-legacy.ytd-searchbox, .ytSearchboxComponentSearchButton { display: block !important; border-radius: 0 2px 2px 0 !important }
.sbsb_a, .ytSearchboxComponentSuggestionsContainer { border-radius: 2px !important }
.sbsb_c, .ytSearchboxComponentInnerSearchIcon { padding-left: 10px !important }
.ytSuggestionComponentIcon { margin-left: -4px !important; margin-right: 8px !important }
div.sbqs_c::before { margin-right: 10px !important }
ytd-searchbox[has-focus] #search-icon.ytd-searchbox { padding-left: 10px !important; padding-right: 10px !important }
#voice-search-button.ytd-masthead { background-color: var(--yt-spec-general-background-a) !important; margin-left: 4px !important }
button.yt-spec-button-shape-next.yt-spec-button-shape-next--text.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-only-default[aria-label="Clear search query"] > div.yt-spec-button-shape-next__icon > yt-icon { width: 20px !important; height: 20px !important; margin-top: 2px !important; margin-left: 2px !important }
.ytSearchboxComponentDesktop .ytSearchboxComponentClearButtonIcon { width: 20px !important; height: 20px !important }
#guide-content.ytd-app { background: var(--yt-spec-brand-background-solid) !important }
yt-interaction.ytd-guide-entry-renderer, ytd-guide-entry-renderer, ytd-guide-entry-renderer[guide-refresh], ytd-mini-guide-entry-renderer, ytd-guide-entry-renderer[active], .style-scope.ytd-guide-entry-renderer:hover, tp-yt-paper-item.style-scope.ytd-guide-entry-renderer { border-radius: 0 !important }
ytd-guide-entry-renderer[guide-refresh] { width: 100% !important }
ytd-mini-guide-renderer[guide-refresh] { padding: 0 !important }
a#endpoint.yt-simple-endpoint.style-scope.ytd-mini-guide-entry-renderer { margin: 0 !important }
tp-yt-paper-item.ytd-guide-entry-renderer { --paper-item-focused-before-border-radius: 0 !important }
ytd-guide-section-renderer.style-scope.ytd-guide-renderer { padding-left: 0 !important }
tp-yt-paper-item.style-scope.ytd-guide-entry-renderer { padding-left: 24px !important }
#guide-section-title.ytd-guide-section-renderer { color: var(--yt-spec-text-secondary) !important; padding: 8px 24px !important; font-size: var(--ytd-tab-system-font-size) !important; font-weight: var(--ytd-tab-system-font-weight) !important; letter-spacing: var(--ytd-tab-system-letter-spacing) !important; text-transform: var(--ytd-tab-system-text-transform) !important }
.style-scope.ytd-rich-item-renderer { border-radius: 2px !important }
/*.style-scope.ytd-item-section-renderer { border-radius: 0 !important } (afecta al borde de los videos sugeridos)*/
#tooltip.tp-yt-paper-tooltip { border-radius: 2px !important }
div.style-scope.yt-tooltip-renderer { border-radius: 0 !important }
.style-scope.ytd-topic-link-renderer { border-radius: 2px !important }
.style-scope.yt-formatted-string, .bold.style-scope.yt-formatted-string { font-family: Roboto !important }
#bar { border-radius: 2px !important }
ytd-multi-page-menu-renderer { border-radius: 0 !important; border: 1px solid var(--yt-spec-10-percent-layer) !important; border-top: none !important; box-shadow: none !important }
yt-dropdown-menu { --paper-menu-button-content-border-radius: 2px !important }
ytd-menu-popup-renderer { border-radius: 2px !important }
.style-scope.ytd-shared-post-renderer, div#repost-context.style-scope.ytd-shared-post-renderer, ytd-post-renderer.style-scope.ytd-shared-post-renderer { border-radius: 0 !important }
/*div#dismissed.style-scope.ytd-compact-video-renderer { border-radius: 0 !important }*/
.style-scope.ytd-feed-nudge-renderer, .style-scope.ytd-inline-survey-renderer { border-radius: 2px !important }
.style-scope.ytd-brand-video-shelf-renderer, div#dismissible.style-scope.ytd-brand-video-singleton-renderer, #inline-survey-compact-video-renderer { border-radius: 0 !important }
tp-yt-paper-button#button.style-scope.ytd-button-renderer.style-inactive-outline.size-default { border-radius: 2px !important }
div#dismissed.style-scope.ytd-rich-grid-media { border-radius: 0 !important }
ytd-thumbnail[size="large"] a.ytd-thumbnail, ytd-thumbnail[size="large"]::before, ytd-thumbnail[size="medium"] a.ytd-thumbnail, ytd-thumbnail[size="medium"]::before, .ShortsLockupViewModelHostThumbnailContainerRounded { border-radius: 0 !important }
ytd-playlist-thumbnail[size="medium"] a.ytd-playlist-thumbnail, ytd-playlist-thumbnail[size="medium"]::before, ytd-playlist-thumbnail[size="large"] a.ytd-playlist-thumbnail, ytd-playlist-thumbnail[size="large"]::before { border-radius: 0 !important }
.collections-stack-wiz__collection-stack1--medium, .collections-stack-wiz__collection-stack2, .yt-thumbnail-view-model--medium { border-radius: 0 !important }
ytd-playlist-panel-renderer[modern-panels]:not([within-miniplayer]) #container.ytd-playlist-panel-renderer { border-radius: 0 !important }
ytd-thumbnail-overlay-toggle-button-renderer.style-scope.ytd-thumbnail { border-radius: 2px !important }
#title.ytd-settings-sidebar-renderer { font-family: Roboto !important; font-weight: 500 !important; font-size: 1.6rem !important; text-transform: uppercase !important }
ytd-compact-link-renderer.ytd-settings-sidebar-renderer { margin: 0 !important; border-radius: 0 !important }
ytd-compact-link-renderer[compact-link-style=compact-link-style-type-settings-sidebar][active] { border-radius: 0 !important }
tp-yt-paper-item.style-scope.ytd-compact-link-renderer::before { border-radius: 0 !important }
ytd-compact-link-renderer[compact-link-style=compact-link-style-type-settings-sidebar] tp-yt-paper-item.ytd-compact-link-renderer { padding-left: 24px !important; padding-right: 24px !important }
img#img.style-scope.yt-image-shadow { border-radius: 50px !important }
#title.style-scope.ytd-feed-nudge-renderer { font-family: Roboto !important }
yt-chip-cloud-chip-renderer.style-scope.ytd-feed-nudge-renderer { border-radius: 50px !important }
div#label-container.style-scope.ytd-thumbnail-overlay-toggle-button-renderer { border: 2px !important; text-transform: uppercase !important }
ytd-thumbnail-overlay-time-status-renderer.style-scope.ytd-thumbnail { border-radius: 2px !important }
ytd-backstage-post-dialog-renderer { border-radius: 2px !important }
yt-bubble-hint-renderer { border-radius: 2px !important }
div#title.text-shell.skeleton-bg-color, div#count.text-shell.skeleton-bg-color, div#owner-name.text-shell.skeleton-bg-color, div#published-date.text-shell.skeleton-bg-color, div.rich-video-title.text-shell.skeleton-bg-color, div.rich-video-meta.text-shell.skeleton-bg-color { border-radius: 2px !important }
div#subscribe-button.skeleton-bg-color { border-radius: 4px !important }
div.rich-thumbnail.skeleton-bg-color { border-radius: 0 !important }
.yt-spec-button-shape-next--icon-only-default {background-color: transparent !important }
.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-start::after { width: 0 !important; margin-left: 8px !important }
dislike-button-view-model { padding-left: 8px !important }
ytd-watch-metadata ytd-video-owner-renderer ytd-button-renderer a, ytd-watch-metadata ytd-video-owner-renderer ytd-button-renderer button, #channel-header-container #meta ~ #buttons ytd-button-renderer a, #channel-header-container #meta ~ #buttons ytd-button-renderer button { height: 37px !important; border-radius: 2px !important; text-transform: uppercase !important; letter-spacing: 0.5px; background: var(--yt-spec-call-to-action) !important; border: 1px solid #075cd3 !important; color: #fff !important }
[dark] #subscribe-button ytd-button-renderer a, [dark] ytd-watch-metadata ytd-video-owner-renderer ytd-button-renderer a, [dark] ytd-watch-metadata ytd-video-owner-renderer ytd-button-renderer button, [dark] #channel-header-container #meta ~ #buttons ytd-button-renderer a, [dark] #channel-header-container #meta ~ #buttons ytd-button-renderer button { height: 37px !important; background: var(--yt-spec-call-to-action) !important; border: 1px solid #3ea6ff !important; color: #fff !important }
#subscribe-button ytd-button-renderer a, ytd-watch-metadata ytd-video-owner-renderer ytd-button-renderer a, ytd-watch-metadata ytd-video-owner-renderer ytd-button-renderer button, #channel-header-container #meta ~ #buttons ytd-button-renderer a, #channel-header-container #meta ~ #buttons ytd-button-renderer button { height: 37px !important; border-radius: 2px !important; text-transform: uppercase !important; letter-spacing: 0.5px; background: var(--yt-spec-call-to-action) !important; border: 0 !important; color: #fff !important }
#edit-buttons ytd-button-renderer a, #edit-buttons ytd-button-renderer button { height: 37px !important; letter-spacing: 0.5px; background: var(--yt-spec-call-to-action) !important; border: 1px solid #075cd3 !important; color: #fff !important }
[dark] #edit-buttons ytd-button-renderer a, [dark] #edit-buttons ytd-button-renderer button { height: 37px !important; background: var(--yt-spec-call-to-action) !important; border: 1px solid #3ea6ff !important; color: #fff !important }
yt-button-shape.style-scope.ytd-subscribe-button-renderer { display: flex !important }
#subscribe-button ytd-subscribe-button-renderer button { height: 37px !important; letter-spacing: 0.5px !important; border-radius: 2px !important; text-transform: uppercase !important }
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled { color: #fff !important; background: var(--yt-spec-brand-button-background) !important; border-radius: 2px !important; text-transform: uppercase !important; letter-spacing: 0.5px !important }
button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m { height: 37px !important; letter-spacing: 0.5px !important; border-radius: 2px !important; text-transform: uppercase !important }
#subscribe-button ytd-subscribe-button-renderer button.yt-spec-button-shape-next--tonal { background-color: var(--yt-spec-badge-chip-background) !important; color: var(--yt-spec-text-secondary) !important }
button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-s { background-color: var(--yt-spec-badge-chip-background) !important; color: var(--yt-spec-text-secondary) !important; height: 25px !important; letter-spacing: 0.5px !important; border-radius: 2px !important; text-transform: uppercase !important }
div#notification-preference-button.style-scope.ytd-subscribe-button-renderer > ytd-subscription-notification-toggle-button-renderer-next.style-scope.ytd-subscribe-button-renderer > yt-button-shape > .yt-spec-button-shape-next--size-m { background-color: transparent !important; border-radius: 16px !important; padding-left: 14px !important; padding-right: 2px !important; margin-left: 4px !important }
#subscribe-button.ytd-channel-renderer a.yt-spec-button-shape-next.yt-spec-button-shape-next--filled.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m { background: var(--yt-spec-brand-button-background) !important }
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Subscribe"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="ติดตาม"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Pratite kanal"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Teken in"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="kanalına abunə olun"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Langgan"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Pretplatite se na kanal"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Subscriu-te al canal"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="se k"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Abonner på"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="abonnieren."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Telli"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Suscribirse"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Suscribirme"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Harpidetu"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Mag-subscribe sa"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="S'abonner à"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Subscribirse"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Bhalisesla"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Prihlásiť sa na odber kanála"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Hefja áskrift að"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Iscriviti"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Fuatilia"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Abonēt kanālu"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Prenumeruoti"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Feliratkozás"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Abonneren op"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Obuna qiling"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Abonohu në"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Đăng ký"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="alına abone ol."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Падпісацца на канал"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Абониране"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="каналына жазылыңыз."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="арнасына жазылу"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Претплатете се на"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="захиалах."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Оформить подписку на канал"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Пратите канал"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Підписатися на канал"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Subscrever"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Inscreva-se em"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Abonează-te la"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Prenumerera på"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Հետևել"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="הרשמה למינוי לערוץ"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="کو سبسکرائب کریں۔"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="يمكنك الاشتراك في قناة"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="مشترک شدن در"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="को सदस्यता लिनुहोस्।"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="चे सदस्यत्व घ्या."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="के सदस्य बनें."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="ৰ সদস্য হওক।"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="এ সাবস্ক্রাইব করুন।"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="ਨੂੰ ਸਬਸਕ੍ਰਾਈਬ ਕਰੋ।"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="પર સબ્સ્ક્રાઇબ કરો."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="ସବ୍‍ସ୍କ୍ରାଇବ୍‍ କରିବେ।"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="சேனலில் குழுசேர்க."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="సబ్‌స్క్రయిబ్ చేయండి."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="ಗೆ ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಿ."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="എന്ന ചാനലിന്‍റെ വരിക്കാരാവുക."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="වෙත දායක වන්න."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="ຕິດຕາມ"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="တွင် စာရင်းသွင်းရန်။"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="გამოწერა."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="订阅"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="訂閱"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="ይመዝገቡ።"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="をチャンネル登録"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="을(를) 구독합니다."],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Tilaa"],
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Subskrybuj kanał"] { border-color: var(--yt-spec-brand-button-background) !important; background: var(--yt-spec-brand-button-background) !important; color: #ffffff !important}
div#notification-preference-button.style-scope.ytd-subscribe-button-renderer > ytd-subscription-notification-toggle-button-renderer-next.style-scope.ytd-subscribe-button-renderer > yt-button-shape > .yt-spec-button-shape-next--size-m > div.cbox.yt-spec-button-shape-next--button-text-content, div#notification-preference-button.style-scope.ytd-subscribe-button-renderer > ytd-subscription-notification-toggle-button-renderer-next.style-scope.ytd-subscribe-button-renderer > yt-button-shape > .yt-spec-button-shape-next--size-m > div.yt-spec-button-shape-next__secondary-icon, button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading-trailing > div.yt-spec-button-shape-next__button-text-content { display: none !important }
#notification-preference-toggle-button:not([hidden]) + yt-animated-action #notification-preference-button.ytd-subscribe-button-renderer[invisible], #subscribe-button-shape.ytd-subscribe-button-renderer[invisible] { pointer-events: auto !important; visibility: visible !important; position: static !important }
yt-smartimation.ytd-subscribe-button-renderer, .smartimation__content > __slot-el { display: flex !important }
/*join/joined button */
#sponsor-button ytd-button-renderer button.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal, #channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Join this channel"], button.yt-spec-button-shape-next.yt-spec-button-shape-next--outline.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m[aria-label="Join this channel"] { height: 37px !important; background: /*rgb(7,92,211,0.1)*/ transparent !important; color: var(--yt-spec-call-to-action) !important; border: 1px solid var(--yt-spec-call-to-action) !important; padding-left: 18px !important; padding-right: 18px !important }
#channel-header-container #meta ~ #buttons ytd-button-renderer button[aria-label="Join this channel"], button.yt-spec-button-shape-next.yt-spec-button-shape-next--outline.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m[aria-label="Join this channel"] { padding-left: 18px !important; padding-right: 18px !important }
div#sponsor-button.channel-action.style-scope.ytd-c4-tabbed-header-renderer { margin-left: 0 !important; margin-right: 8px !important }

.yt-spec-button-shape-next--size-m { border-radius: 2px !important }

ytd-watch-metadata ytd-video-owner-renderer #sponsor-button ytd-button-renderer a.yt-spec-button-shape-next--tonal,
#channel-header-container #meta ~ #buttons #sponsor-button ytd-button-renderer a.yt-spec-button-shape-next--tonal
{ background: rgba(0,0,0,0.1) !important; color: #000 !important; border: none !important }

[dark] ytd-watch-metadata ytd-video-owner-renderer #sponsor-button ytd-button-renderer a.yt-spec-button-shape-next--tonal,
[dark] #channel-header-container #meta ~ #buttons #sponsor-button ytd-button-renderer a.yt-spec-button-shape-next--tonal
{ background: rgba(255,255,255,0.1) !important; color: #aaa !important; border: none !important }

/**/

/**/
ytd-watch-metadata .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal { background: transparent !important; color: var(--yt-spec-icon-inactive) !important }
ytd-watch-metadata .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal:hover, #info .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal:hover { /*background: rgba(0,0,0,0.1) !important;*/ }
[dark] ytd-watch-metadata .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal:hover, [dark] #info .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal:hover { /*background: rgba(255,255,255,0.1) !important;*/ }
/**/
ytd-watch-metadata ytd-menu-renderer button, ytd-button-renderer yt-button-shape button { border-radius: 0 !important }
ytd-watch-metadata ytd-toggle-button-renderer tp-yt-paper-tooltip #tooltip, #info ytd-button-renderer tp-yt-paper-tooltip #tooltip { width: max-content }
ytd-watch-metadata #top-level-buttons-computed  button { padding: 0 12px; text-transform: uppercase }
ytd-watch-metadata #top-level-buttons-computed ytd-button-renderer button { padding: 0 8px; text-transform: uppercase }
ytd-watch-metadata #top-level-buttons-computed > *:not(:first-child) { margin: 0 0 0 8px }
ytd-watch-metadata #flexible-item-buttons > * { margin-left: 8px }
ytd-watch-metadata #flexible-item-buttons  button { padding: 0 8px; text-transform: uppercase }
ytd-segmented-like-dislike-button-renderer button { padding: 0 12px !important }
ytd-watch-metadata ytd-menu-renderer > #button-shape { margin-left: 8px !important }
.yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--outline .yt-spec-button-shape-next__icon { margin-left: 0 !important; margin-right: 0 !important }
.yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--outline div.yt-spec-button-shape-next__button-text-content { height: 34px !important; margin-left: 0px !important }
.yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--outline { height: 37px !important; border-color: var(--yt-spec-call-to-action) !important; color: #3ea6ff !important; border-radius: 2px !important; text-transform: uppercase !important; letter-spacing: 0.5px !important }
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--filled { height: 37px !important; color: #fff; background: var(--yt-spec-brand-button-background) !important; border-radius: 2px !important; text-transform: uppercase !important; letter-spacing: 0.5px !important }
.yt-spec-button-shape-next--call-to-action.yt-spec-button-shape-next--filled { border-radius: 2px !important; text-transform: uppercase !important }
.yt-spec-button-shape-next--size-s.yt-spec-button-shape-next--icon-button > div.yt-spec-button-shape-next__icon, .yt-spec-button-shape-next--size-s.yt-spec-button-shape-next--icon-button > div.yt-spec-button-shape-next__icon > yt-icon { width: 18px !important; height: 18px !important; color: var(--yt-spec-icon-inactive) !important }
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal { background: var(--yt-spec-badge-chip-background) !important; text-transform: uppercase !important }
ytd-comments .yt-core-attributed-string--white-space-no-wrap, ytd-comments yt-dropdown-menu[modern-buttons] #label.yt-dropdown-menu, ytd-comments yt-dropdown-menu[modern-buttons] #icon-label.yt-dropdown-menu { letter-spacing: 0.5px !important; text-transform: uppercase !important }
ytd-comments#comments #replies #expander .more-button button > .yt-spec-button-shape-next__button-text-content > span.yt-core-attributed-string.yt-core-attributed-string--white-space-no-wrap, ytd-comments#comments #replies #expander .less-button button > .yt-spec-button-shape-next__button-text-content > span.yt-core-attributed-string.yt-core-attributed-string--white-space-no-wrap { text-transform: none !important }
#channel-name.ytd-video-owner-renderer { font-size: 1.4rem !important; line-height: 2rem !important }
#info.ytd-video-primary-info-renderer { height: 40px !important }
ytd-merch-shelf-renderer { background-color: transparent !important }
div#clarify-box.attached-message.style-scope.ytd-watch-flexy { margin-top: 0 !important }
ytd-clarification-renderer.style-scope.ytd-item-section-renderer, ytd-clarification-renderer.style-scope.ytd-watch-flexy, ytd-info-panel-container-renderer[rounded-container] { border: 1px solid !important; border-color: #0000001a !important; border-radius: 0 !important }
ytd-info-panel-container-renderer[rounded-container][has-title] .header.ytd-info-panel-container-renderer, ytd-info-panel-content-renderer[rounded-container] { border-radius: 0 !important }
yt-formatted-string.description.style-scope.ytd-clarification-renderer { font-size: 1.4rem !important }
div.content-title.style-scope.ytd-clarification-renderer { padding-bottom: 4px !important }
ytd-watch-flexy[rounded-player-large]:not([fullscreen]):not([theater]) #ytd-player.ytd-watch-flexy { border-radius: 0 !important }
ytd-rich-metadata-renderer[rounded] { border-radius: 0 !important }
ytd-live-chat-frame[rounded-container], ytd-live-chat-frame[rounded-container] #show-hide-button.ytd-live-chat-frame ytd-toggle-button-renderer.ytd-live-chat-frame, iframe.style-scope.ytd-live-chat-frame { border-radius: 0 !important }
ytd-toggle-button-renderer.style-scope.ytd-live-chat-frame, yt-live-chat-header-renderer.style-scope.yt-live-chat-renderer { background: var(--yt-spec-brand-background-solid) !important }
ytd-toggle-button-renderer.style-scope.ytd-live-chat-frame > a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer > tp-yt-paper-button.style-scope.ytd-toggle-button-renderer { padding-top: 4px !important; padding-bottom: 4px !important }
ytd-live-chat-frame #show-hide-button.ytd-live-chat-frame>ytd-button-renderer.ytd-live-chat-frame { margin: 0 !important }
ytd-live-chat-frame button { height: 31px !important }
ytd-live-chat-frame .yt-spec-button-shape-next--size-m { color: var(--yt-live-chat-secondary-text-color) !important; font-size: 11px !important }
ytd-playlist-panel-renderer[modern-panels]:not([within-miniplayer]) #container.ytd-playlist-panel-renderer, ytd-tvfilm-offer-module-renderer[modern-panels], ytd-donation-shelf-renderer.style-scope.ytd-watch-flexy, ytd-engagement-panel-section-list-renderer[modern-panels]:not([live-chat-engagement-panel]) { border-radius: 0 !important }
ytd-playlist-panel-renderer[modern-panels]:not([hide-header-text]) .title.ytd-playlist-panel-renderer { font-family: Roboto !important; font-size: 1.4rem !important; line-height: 2rem !important; font-weight: 500 !important }
ytd-tvfilm-offer-module-renderer[modern-panels] #header.ytd-tvfilm-offer-module-renderer, ytd-engagement-panel-title-header-renderer[modern-panels]:not([ads-semantic-text]) #title-text.ytd-engagement-panel-title-header-renderer { border-radius: 0 !important; font-family: Roboto !important; font-size: 1.6rem !important; line-height: 2.2rem !important; font-weight: 400 !important }
ytd-donation-shelf-renderer[modern-panels] #header-text.ytd-donation-shelf-renderer { font-family: Roboto !important; font-size: 1.6rem !important; font-weight: 500 !important }
ytd-universal-watch-card-renderer[rounded] #header.ytd-universal-watch-card-renderer, ytd-universal-watch-card-renderer[rounded] #hero.ytd-universal-watch-card-renderer { border-radius: 0 !important }
ytd-video-view-count-renderer { font-size: 1.4rem !important }
#upload-info.ytd-video-owner-renderer { margin-left: 4px !important }
div#actions.item.style-scope.ytd-watch-metadata { height: 40px !important }
ytd-segmented-like-dislike-button-renderer { height: 36px !important }
ytd-post-renderer[rounded-container] { border-radius: 0 !important }
/* Remove rounded corners from the video player (Thanks to oldbutgoldyt for the code) */
.ytp-ad-player-overlay-flyout-cta-rounded { border-radius: 2px !important }
.ytp-flyout-cta .ytp-flyout-cta-action-button.ytp-flyout-cta-action-button-rounded { font-family: Arial !important; background: #167ac6 !important; border: solid 1px transparent !important; border-color: #167ac6 !important; border-radius: 2px !important; box-shadow: 0 1px 0 rgba(0,0,0,.05) !important; font-size: 11px !important; font-weight: 500 !important; height: 28px !important; margin: 0 8px 0 0 !important; max-width: 140px !important; padding: 0 10px !important }
.ytp-ad-action-interstitial-action-button.ytp-ad-action-interstitial-action-button-rounded { background-color: #167ac6 !important; border: none !important; border-radius: 2px; font-family: Roboto !important; font-size: 23px !important; height: 46px !important; line-height: 46px !important; min-width: 164px !important; padding: 0 20px !important }
.ytp-settings-menu { border-radius: 2px !important }
.ytp-sb-subscribe { border-radius: 2px !important; background-color: #f00 !important; color: #fff !important; text-transform: uppercase !important }
.ytp-sb-unsubscribe { border-radius: 2px !important; background-color: #eee !important; color: #606060 !important; text-transform: uppercase !important }
.ytp-sb-subscribe.ytp-sb-disabled { background-color: #f3908b !important }
.branding-context-container-inner.ytp-rounded-branding-context { border-radius: 2px !important }
.ytp-tooltip.ytp-rounded-tooltip:not(.ytp-preview) .ytp-tooltip-text { border-radius: 2px !important }
.ytp-autonav-endscreen-upnext-button.ytp-autonav-endscreen-upnext-button-rounded { border-radius: 2px !important }
.ytp-ad-overlay-container.ytp-rounded-overlay-ad .ytp-ad-overlay-image img, .ytp-ad-overlay-container.ytp-rounded-overlay-ad .ytp-ad-text-overlay, .ytp-ad-overlay-container.ytp-rounded-overlay-ad .ytp-ad-enhanced-overlay { border-radius: 0 !important }
.ytp-videowall-still-image { border-radius: 0 !important }
div.iv-card.iv-card-video.ytp-rounded-info { border-radius: 0 !important }
div.iv-card.iv-card-playlist.ytp-rounded-info { border-radius: 0 !important }
div.iv-card.iv-card-channel.ytp-rounded-info { border-radius: 0 !important }
div.iv-card.ytp-rounded-info { border-radius: 0 !important }
.ytp-tooltip.ytp-rounded-tooltip.ytp-text-detail.ytp-preview, .ytp-tooltip.ytp-rounded-tooltip.ytp-text-detail.ytp-preview .ytp-tooltip-bg { border-radius: 2px !important }
.ytp-ce-video.ytp-ce-medium-round, .ytp-ce-playlist.ytp-ce-medium-round, .ytp-ce-medium-round .ytp-ce-expanding-overlay-background { border-radius: 0 !important }
.ytp-autonav-endscreen-upnext-thumbnail { border-radius: 0 !important }
@font-face { font-family: no-parens; src: url("data:application/x-font-woff;base64,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"); unicode-range: U+0028, U+0029 }
span.ytp-menu-label-secondary { font-family: "no-parens", "Roboto", sans-serif }
.ytp-swatch-color-white { color: #f00 !important }
.iv-card { border-radius: 0 !important }
.iv-branding .branding-context-container-inner { border-radius: 2px !important }
.ytp-offline-slate-bar { border-radius: 2px !important }
.ytp-offline-slate-button { border-radius: 2px !important }
.ytp-ce-video.ytp-ce-large-round, .ytp-ce-playlist.ytp-ce-large-round, .ytp-ce-large-round .ytp-ce-expanding-overlay-background { border-radius: 0 !important }
.ytp-flyout-cta .ytp-flyout-cta-icon.ytp-flyout-cta-icon-rounded { border-radius: 0 !important }
.ytp-player-minimized .html5-main-video, .ytp-player-minimized .ytp-miniplayer-scrim, .ytp-player-minimized.html5-video-player { border-radius: 0 !important }
ytd-miniplayer #player-container.ytd-miniplayer, ytd-miniplayer #video-container.ytd-miniplayer .video.ytd-miniplayer, ytd-miniplayer #card.ytd-miniplayer, ytd-miniplayer { border-radius: 0 !important }
ytd-channel-video-player-renderer[rounded] #player.ytd-channel-video-player-renderer { border-radius: 0 !important }
.ytp-tooltip.ytp-rounded-tooltip.ytp-preview:not(.ytp-text-detail), .ytp-tooltip.ytp-rounded-tooltip.ytp-preview:not(.ytp-text-detail) .ytp-tooltip-bg { border-radius: 2px !important }
#movie_player > div.ytp-promotooltip-wrapper > div.ytp-promotooltip-container { border-radius: 2px !important }
.ytp-fine-scrubbing-container { display: none !important }
.ytp-progress-bar, .ytp-heat-map-container, .ytp-fine-scrubbing-container { transform: translateY(0) !important }
.ytp-chrome-bottom { height: auto !important }
.ytp-tooltip-edu { display: none !important }
.ytp-xs-mono-button-style .ytp-time-wrapper { background: none !important; border-radius: 0 !important; padding: 0 !important }
/* Modifing the watch page, compact channel header UI and pre-amsterdam playlists UI */
ytd-watch-metadata[title-headline-xs] h1.ytd-watch-metadata, ytd-watch-metadata[title-headline-m] h1.ytd-watch-metadata { font-family: "YouTube Sans","Roboto",sans-serif !important; font-weight: 600 !important; font-size: 2rem !important; line-height: 2.8rem !important }
ytd-watch-metadata.watch-active-metadata.style-scope.ytd-watch-flexy.style-scope.ytd-watch-flexy { margin-top: var(--ytd-margin-3x) !important }
#top-row.ytd-watch-metadata #top-level-buttons-computed button, #top-row.ytd-watch-metadata #flexible-item-buttons button { text-transform: none !important }
ytd-watch-metadata[modern-metapanel] #description.ytd-watch-metadata, #description.ytd-watch-metadata, .YtVideoMetadataCarouselViewModelHost { background-color: transparent !important }
ytd-watch-metadata[modern-metapanel] #description-inner.ytd-watch-metadata, #description-inner.ytd-watch-metadata { margin: 0px !important }
ytd-watch-metadata[modern-metapanel-order] #comment-teaser.ytd-watch-metadata {border: 1px solid var(--yt-spec-10-percent-layer) !important; border-radius: 4px !important }
ytd-comments-entry-point-header-renderer[modern-metapanel] { background-color: transparent !important }
.YtVideoMetadataCarouselViewModelHost { padding: 0 !important }
#teaser-carousel.ytd-watch-metadata, div#expandable-metadata.ytd-watch-flexy { display: none !important }
lottie-component.smartimation__border-gradient.lottie-component, smartimation__background-lottie lottie-component, .smartimation__border { display: none !important }
.smartimation--active-border .smartimation__overlay { opacity: 0; z-index: 0 }
#return-youtube-dislike-bar, #ryd-bar, .yt-spec-touch-feedback-shape--touch-response .yt-spec-touch-feedback-shape__fill { background: var(--yt-spec-icon-inactive) !important }
#actions.ytd-watch-metadata { min-width: auto !important }
ytd-comments-header-renderer[compact-header] #title.ytd-comments-header-renderer { margin-bottom: 24px !important }
ytd-watch-flexy ytd-rich-item-renderer[rendered-from-rich-grid] { --ytd-rich-item-row-usable-width: 100% !important }
ytd-watch-flexy ytd-rich-item-renderer[rendered-from-rich-grid][is-in-first-column] { margin-left: 0 }
ytd-watch-flexy #dismissible.ytd-rich-grid-media { flex-direction: row; }
ytd-watch-flexy #attached-survey.ytd-rich-grid-media, ytd-watch-flexy #avatar-link.ytd-rich-grid-media, ytd-watch-flexy #avatar-container.ytd-rich-grid-media { display: none; }
ytd-watch-flexy ytd-thumbnail.ytd-rich-grid-media, ytd-watch-flexy ytd-playlist-thumbnail.ytd-rich-grid-media { margin-right: 8px; height: 94px; width: 168px; }
ytd-thumbnail[size=large][large-margin] ytd-thumbnail-overlay-time-status-renderer.ytd-thumbnail, ytd-thumbnail[size=large][large-margin] ytd-thumbnail-overlay-button-renderer.ytd-thumbnail, ytd-thumbnail[size=large][large-margin] ytd-thumbnail-overlay-toggle-button-renderer.ytd-thumbnail, ytd-thumbnail[size=large] ytd-thumbnail-overlay-time-status-renderer.ytd-thumbnail, ytd-thumbnail[size=large] ytd-thumbnail-overlay-button-renderer.ytd-thumbnail, ytd-thumbnail[size=large] ytd-thumbnail-overlay-toggle-button-renderer.ytd-thumbnail { margin: 4px; }
ytd-watch-flexy ytd-rich-item-renderer, ytd-watch-flexy ytd-rich-grid-row #contents.ytd-rich-grid-row { margin: 0; }
ytd-watch-flexy ytd-rich-item-renderer[reduced-bottom-margin] { margin-top: 8px; margin-bottom: 0; }
ytd-watch-flexy ytd-rich-grid-renderer[reduced-top-margin] #contents.ytd-rich-grid-renderer { padding-top: 0; }
ytd-watch-flexy ytd-rich-grid-media { margin-bottom: 8px; }
ytd-watch-flexy #details.ytd-rich-grid-media { width: 100%; min-width: 0; }
ytd-watch-flexy ytd-video-meta-block[rich-meta] #metadata-line.ytd-video-meta-block, ytd-watch-flexy #channel-name.ytd-video-meta-block { font-family: "Roboto", "Arial", sans-serif; font-size: 1.2rem; line-height: 1.8rem; font-weight: 400; }
ytd-watch-flexy #video-title.ytd-rich-grid-media { margin: 0 0 4px 0; display: block; font-family: "Roboto", "Arial", sans-serif; font-size: 1.4rem; line-height: 2rem; font-weight: 500; overflow: hidden; display: block; max-height: 4rem; -webkit-line-clamp: 2; display: box; display: -webkit-box; -webkit-box-orient: vertical; text-overflow: ellipsis; white-space: normal; }
ytd-watch-flexy h3.ytd-rich-grid-media { margin: 0; }
ytd-watch-flexy .title-badge.ytd-rich-grid-media, ytd-watch-flexy .video-badge.ytd-rich-grid-media { margin-top: 0; }
ytd-watch-flexy ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer { display: none; }
ytd-watch-flexy ytd-rich-grid-renderer[hide-chips-bar] ytd-feed-filter-chip-bar-renderer.ytd-rich-grid-renderer, ytd-watch-flexy ytd-rich-grid-renderer[hide-chips-bar-on-watch] ytd-feed-filter-chip-bar-renderer.ytd-rich-grid-renderer, ytd-watch-flexy ytd-rich-grid-renderer[hide-chips-bar-on-home] #header.ytd-rich-grid-renderer ytd-feed-filter-chip-bar-renderer.ytd-rich-grid-renderer { display: flex; height: 51px; margin-bottom: 8px; }
ytd-watch-flexy #chips-wrapper.ytd-feed-filter-chip-bar-renderer, ytd-watch-flexy ytd-feed-filter-chip-bar-renderer #left-arrow-button.ytd-feed-filter-chip-bar-renderer, ytd-watch-flexy ytd-feed-filter-chip-bar-renderer #right-arrow-button.ytd-feed-filter-chip-bar-renderer { background: var(--yt-spec-general-background-a) !important; }
ytd-watch-flexy #left-arrow.ytd-feed-filter-chip-bar-renderer:after { background: linear-gradient(to right, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(249, 249, 249, 0) 90%) !important; }
ytd-watch-flexy #right-arrow.ytd-feed-filter-chip-bar-renderer:before { background: linear-gradient(to left, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(249, 249, 249, 0) 90%) !important; }
ytd-watch-flexy ytd-feed-filter-chip-bar-renderer[is-dark-theme] #left-arrow.ytd-feed-filter-chip-bar-renderer:after { background: linear-gradient(to right, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(24, 24, 24, 0) 90%) !important; }
ytd-watch-flexy ytd-feed-filter-chip-bar-renderer[is-dark-theme] #right-arrow.ytd-feed-filter-chip-bar-renderer:before { background: linear-gradient(to left, var(--ytd-chip-cloud-background, var(--yt-spec-general-background-a)) 10%, rgba(24, 24, 24, 0) 90%) !important; }
ytd-watch-flexy #chips-wrapper.ytd-feed-filter-chip-bar-renderer { position: relative; top: 0; }
ytd-watch-flexy ytd-feed-filter-chip-bar-renderer[fluid-width] #chips-content.ytd-feed-filter-chip-bar-renderer { padding: 0; }
ytd-watch-flexy yt-chip-cloud-chip-renderer.ytd-feed-filter-chip-bar-renderer, ytd-watch-flexy yt-chip-cloud-chip-renderer.ytd-feed-filter-chip-bar-renderer:first-of-type { margin: 8px; margin-left: 0; }
ytd-watch-flexy ytd-button-renderer.ytd-feed-filter-chip-bar-renderer { margin: 0; padding: 0 8px; }
ytd-watch-flexy[default-layout][reduced-top-margin] #primary.ytd-watch-flexy, ytd-watch-flexy[default-layout][reduced-top-margin] #secondary.ytd-watch-flexy { padding-top: var(--ytd-margin-6x) !important }
ytd-watch-metadata[title-headline-m] h1.ytd-watch-metadata { font-size: 2rem !important; font-weight: 400 !important; line-height: 2.8rem !important }
#meta #avatar { width: 48px; height: 48px; margin-right: 12px; }
#meta #avatar img { width: 100%; }
div#info-skeleton.watch-skeleton.style-scope.ytd-watch-flexy, div#meta-skeleton.watch-skeleton.style-scope.ytd-watch-flexy { display: none !important }
#buttons.ytd-c4-tabbed-header-renderer { flex-direction: row-reverse !important }
ytd-channel-tagline-renderer { display: block !important; padding: 0 !important }
#content.ytd-channel-tagline-renderer::before { content: "More about this channel"; font-weight: 500 !important }
#content.ytd-channel-tagline-renderer { max-width: 162px !important }
.page-header-view-model-wiz__page-header-description { margin-top: 0px !important; max-width: 236px !important }
ytd-browse[page-subtype="channels"] yt-description-preview-view-model .truncated-text-wiz__truncated-text-content:before { content: "More about this channel >   "; font-weight: 500 !important }
ytd-browse[page-subtype="channels"] button.truncated-text-wiz__absolute-button { display: none !important }
#avatar.ytd-c4-tabbed-header-renderer, .yt-spec-avatar-shape__button--button-giant { width: 80px !important; height: 80px !important; margin: 0 24px 0 0 !important; flex: none !important; overflow: hidden !important }
.yt-spec-avatar-shape__button--button-giant, .yt-spec-avatar-shape--avatar-size-giant, .yt-spec-avatar-shape__button--button-extra-extra-large, .yt-spec-avatar-shape--avatar-size-extra-extra-large { width: 80px !important; height: 80px !important; margin-right: 0px !important }
#avatar-editor.ytd-c4-tabbed-header-renderer { --ytd-channel-avatar-editor-size: 80px !important }
#channel-name.ytd-c4-tabbed-header-renderer { margin-bottom: 0 !important }
#channel-header-container.ytd-c4-tabbed-header-renderer { padding-top: 0 !important; align-items: center !important }
#inner-header-container.ytd-c4-tabbed-header-renderer { margin-top: 0 !important; align-items: center !important }
.yt-content-metadata-view-model-wiz--inline .yt-content-metadata-view-model-wiz__metadata-row { margin-top: 0 !important }
yt-formatted-string#channel-pronouns.style-scope.ytd-c4-tabbed-header-renderer, #videos-count { display: none !important }
.meta-item.ytd-c4-tabbed-header-renderer { display: block !important }
div#channel-header-links.style-scope.ytd-c4-tabbed-header-renderer, .page-header-view-model-wiz__page-header-attribution { display: none !important }
ytd-c4-tabbed-header-renderer[use-page-header-style] #channel-name.ytd-c4-tabbed-header-renderer, [page-subtype="channels"] .page-header-view-model-wiz__page-header-title--page-header-title-large { font-size: 2.4em !important; font-weight: 400 !important; line-height: var(--yt-channel-title-line-height, 3rem) !important; margin: 0 !important }
span.delimiter.style-scope.ytd-c4-tabbed-header-renderer, .yt-content-metadata-view-model-wiz__delimiter { display: none !important }
div#meta.style-scope.ytd-c4-tabbed-header-renderer { width: auto !important }
ytd-c4-tabbed-header-renderer[use-page-header-style] #inner-header-container.ytd-c4-tabbed-header-renderer { flex-direction: row !important }
div.page-header-banner.style-scope.ytd-c4-tabbed-header-renderer { margin-left: 0px !important; margin-right: 8px !important; border-radius: 0px !important }
[has-inset-banner] #page-header-banner.ytd-tabbed-page-header { padding-left: 0 !important; padding-right: 0 !important }
ytd-c4-tabbed-header-renderer[use-page-header-style] .page-header-banner.ytd-c4-tabbed-header-renderer, .yt-image-banner-view-model-wiz--inset { border-radius: 0px !important }
.yt-content-metadata-view-model-wiz__metadata-text { margin-right: 8px !important }
.yt-content-metadata-view-model-wiz__metadata-text, .truncated-text-wiz, .truncated-text-wiz__absolute-button { font-size: 1.4rem !important }
.yt-tab-shape-wiz { padding: 0 32px !important; margin-right: 0 !important }
.yt-tab-shape-wiz__tab { font-size: 14px !important; font-weight: 500 !important; letter-spacing: var(--ytd-tab-system-letter-spacing) !important; text-transform: uppercase !important }
.yt-tab-group-shape-wiz__slider { display: none !important }
ytd-browse[page-subtype="channels"] ytd-tabbed-page-header .yt-content-metadata-view-model-wiz__metadata-row--metadata-row-inline { display: flex }
ytd-browse[page-subtype="channels"] ytd-tabbed-page-header .yt-content-metadata-view-model-wiz__metadata-text:last-of-type { display: none }
ytd-browse[page-subtype="channels"] ytd-tabbed-page-header .yt-content-metadata-view-model-wiz__metadata-text:first-of-type { display: flex }
ytd-browse[page-subtype="channels"] .yt-flexible-actions-view-model-wiz--inline { flex-direction: row-reverse }
ytd-browse[page-subtype="channels"] .page-header-view-model-wiz__page-header-flexible-actions { margin-top: -68px }
ytd-browse[page-subtype="channels"] .yt-flexible-actions-view-model-wiz__action-row { margin-top: 60px }
ytd-browse[page-subtype="channels"] .yt-flexible-actions-view-model-wiz__action { padding-right: 8px }
ytd-browse[page-subtype="channels"] span.yt-core-attributed-string--link-inherit-color { font-weight: 400 !important }
ytd-browse[page-subtype="channels"] .page-header-view-model-wiz__page-header-headline-info { margin-bottom: 8px }
ytd-browse[darker-dark-theme][page-subtype="playlist"], ytd-browse[darker-dark-theme][page-subtype="show"] { background-color: var(--yt-spec-general-background-b) !important; padding-top: 0 !important }
ytd-two-column-browse-results-renderer.ytd-browse[background-refresh] { background-color: var(--yt-spec-general-background-b) !important }
ytd-browse[page-subtype=playlist] .page-header-view-model-wiz__page-header-title--page-header-title-medium, ytd-browse[page-subtype=playlist] .page-header-view-model-wiz__page-header-title--page-header-title-large, .yt-sans-20.yt-dynamic-sizing-formatted-string, .yt-sans-22.yt-dynamic-sizing-formatted-string, .yt-sans-24.yt-dynamic-sizing-formatted-string, .yt-sans-28.yt-dynamic-sizing-formatted-string, yt-text-input-form-field-renderer[component-style="INLINE_FORM_STYLE_TITLE"][amsterdam] tp-yt-paper-input.yt-text-input-form-field-renderer .input-content.tp-yt-paper-input-container > input { font-family: "Roboto", "Arial", sans-serif !important; font-size: 2.4rem !important; line-height: 3.2rem !important; font-weight: 400 !important }
ytd-browse[page-subtype=playlist][amsterdam] { padding-top: 0 !important }
ytd-browse[page-subtype=playlist] ytd-playlist-header-renderer.ytd-browse, ytd-browse[page-subtype=playlist] .page-header-sidebar.ytd-browse, ytd-browse[has-page-header-sidebar] ytd-playlist-header-renderer.ytd-browse, ytd-browse[has-page-header-sidebar] .page-header-sidebar.ytd-browse { background: var(--yt-spec-general-background-a) !important; margin-left: 0 !important; height: calc(100vh - var(--ytd-toolbar-height)) !important }
.immersive-header-container.ytd-playlist-header-renderer { margin-bottom: 0 !important; border-radius: 0 !important }
.image-wrapper.ytd-hero-playlist-thumbnail-renderer { border-radius: 0 !important }
ytd-playlist-header-renderer, yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string:visited, .metadata-stats.ytd-playlist-byline-renderer, .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--text, ytd-text-inline-expander.ytd-playlist-header-renderer { color: var(--yt-spec-text-primary) !important; --ytd-text-inline-expander-button-color: var(--yt-spec-text-primary) !important }
ytd-dropdown-renderer[no-underline] tp-yt-paper-dropdown-menu-light .tp-yt-paper-dropdown-menu-light[style-target=input], tp-yt-iron-icon.tp-yt-paper-dropdown-menu-light { color: var(--yt-spec-text-primary) !important }
.yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--tonal, .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--filled { background: transparent !important; color: var(--yt-spec-text-primary) !important; border-radius: 2px !important; text-transform: uppercase }
.metadata-text-wrapper.ytd-playlist-header-renderer { --yt-endpoint-color: var(--yt-spec-text-primary) !important; --yt-endpoint-hover-color: var(--yt-spec-text-primary) !important }
div.immersive-header-background-wrapper.style-scope.ytd-playlist-header-renderer > div { background: var(--yt-spec-general-background-a) !important }
#contents > ytd-playlist-video-list-renderer { background: var(--yt-spec-general-background-b) !important; margin-right: 0 !important }
ytd-browse[page-subtype=playlist] ytd-two-column-browse-results-renderer.ytd-browse, ytd-browse[has-page-header-sidebar] ytd-two-column-browse-results-renderer.ytd-browse, ytd-browse[page-subtype=playlist][amsterdam] #alerts.ytd-browse, ytd-browse[page-subtype=playlist] #alerts.ytd-browse, ytd-browse[has-page-header-sidebar] #alerts.ytd-browse { padding-left: 360px !important; padding-right: 0 !important; margin-bottom: 0 !important }
ytd-alert-with-button-renderer[type=INFO], ytd-alert-with-button-renderer[type=SUCCESS] { background: var(--yt-spec-general-background-a) !important }
ytd-item-section-renderer.style-scope.ytd-section-list-renderer[page-subtype="playlist"] > #header.ytd-item-section-renderer > ytd-feed-filter-chip-bar-renderer { display: none !important }
.yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--tonal { background: var(--yt-spec-base-background) }
iron-input.tp-yt-paper-input > input.tp-yt-paper-input, textarea.tp-yt-iron-autogrow-textarea { color: var(--yt-spec-text-primary) !important }
#labelAndInputContainer.tp-yt-paper-input-container > label, #labelAndInputContainer.tp-yt-paper-input-container > .paper-input-label { color: var(--yt-spec-text-secondary) }
.unfocused-line.tp-yt-paper-input-container, .focused-line.tp-yt-paper-input-container { border-bottom-color: var(--yt-spec-text-primary) !important }
[page-subtype="history"] #page-header.ytd-tabbed-page-header { background-color: var(--yt-spec-general-background-a) !important; padding-top: 0 !important; padding-bottom: 0 !important }
.page-header-view-model-wiz__page-header-title--page-header-title-large { margin-top: 24px !important; margin-bottom: 8px !important; color: var(--yt-spec-text-primary) !important; font-size: 1.6em !important; line-height: 1.4em !important; font-weight: 500 !important }
.yt-content-metadata-view-model-wiz__metadata-text { margin-right: 8px !important }
.yt-content-metadata-view-model-wiz__metadata-text, .truncated-text-wiz, .truncated-text-wiz__absolute-button { font-size: 1.4rem !important }
ytd-browse[page-subtype=playlist], ytd-browse[has-page-header-sidebar] { padding-top: 0 !important }
ytd-browse[page-subtype=playlist] .page-header-sidebar.ytd-browse, ytd-browse[has-page-header-sidebar] .page-header-sidebar.ytd-browse { padding-bottom: 0 !important; border-radius: 0 !important }
.page-header-view-model-wiz--display-as-sidebar .page-header-view-model-wiz__page-header-background { border-radius: 0 !important }
div.page-header-view-model-wiz__page-header-background { display: none !important }
.yt-content-preview-image-view-model-wiz--large-rounded-image { border-radius: 0 !important }
ytd-browse[page-subtype=playlist] .page-header-view-model-wiz__page-header-content-metadata--page-header-content-metadata-overlay, ytd-browse[page-subtype=playlist] .yt-avatar-stack-view-model-wiz__avatar-stack-text { color: var(--yt-spec-text-secondary) !important; font-size: 1.4rem !important; line-height: 2rem !important }
ytd-browse[page-subtype=playlist] .yt-core-attributed-string--link-inherit-color .yt-core-attributed-string__link--call-to-action-color { font-weight: 400 !important }
yt-dynamic-text-view-model, ytd-browse[page-subtype=playlist] .yt-core-attributed-string--link-inherit-color .yt-core-attributed-string__link--call-to-action-color { color: var(--yt-endpoint-color, var(--yt-spec-text-primary)) !important }
ytd-playlist-video-renderer #content.ytd-playlist-video-renderer { padding: 16px 0 !important; border-bottom: 1px solid var(--yt-spec-10-percent-layer) !important }
ytd-playlist-video-renderer .style-scope.yt-formatted-string, ytd-playlist-video-renderer .bold.style-scope.yt-formatted-string { display: none }
ytd-playlist-video-renderer div#separator.style-scope.ytd-video-meta-block { display: none !important }
ytd-playlist-video-renderer[amsterdam-post-mvp] ytd-thumbnail.ytd-playlist-video-renderer, ytd-playlist-video-renderer[cairo-collab-playlist-post-mvp] ytd-thumbnail.ytd-playlist-video-renderer { height: 68px !important; width: 120px !important }
/* Remove Shorts, Trending, Podcasts, Shopping and more stuff in the left sidebar menus + Other elements to be fixed, modified and removed */
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope[title="Shorts"],
#endpoint.yt-simple-endpoint.ytd-mini-guide-entry-renderer.style-scope[title="Shorts"] { display: none !important }
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope[title="Your channel"] { display: none !important }
ytd-guide-entry-renderer > a[href*="/playlist?list=LL"] { display: none !important }
ytd-guide-entry-renderer > a[href*="/feed/trending"] { display: none !important }
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer.style-scope[title="Podcasts"], ytd-guide-entry-renderer > a[href*="/feed/podcasts"] { display: none !important }
ytd-guide-entry-renderer > a[href*="/channel/UCkYQyvc_i9hXEo4xic9Hh2g"] { display: none !important }
ytd-guide-entry-renderer > a[href*="/channel/UCrpQ4p1Ql_hG8rKXIKM1MOQ"] { display: none !important }
ytd-guide-entry-renderer > a[href*="/feed/courses_destination"] { display: none !important }
ytd-guide-entry-renderer > a[href*="/playables"] { display: none !important }
.yt-tab-shape-wiz { padding: 0 32px !important; margin-right: 0 !important }
.yt-tab-shape-wiz__tab { font-size: 14px !important; font-weight: 500 !important; letter-spacing: var(--ytd-tab-system-letter-spacing) !important; text-transform: uppercase !important }
.yt-tab-group-shape-wiz__slider { display: none !important }
yt-formatted-string.style-scope.yt-chip-cloud-chip-renderer, span.style-scope.ytd-rich-shelf-renderer { font-weight: 400 !important }
span.style-scope.ytd-shelf-renderer, ytd-reel-shelf-renderer[modern-typography] #title.ytd-reel-shelf-renderer { font-size: 1.6rem !important; font-weight: 500 !important }
.count-text.ytd-comments-header-renderer { font-size: 1.6rem !important; line-height: 2.2rem !important; font-weight: 400 !important }
ytd-item-section-renderer.style-scope.ytd-watch-next-secondary-results-renderer > div#contents.style-scope.ytd-item-section-renderer > ytd-reel-shelf-renderer.style-scope.ytd-item-section-renderer, ytd-reel-shelf-renderer.ytd-structured-description-content-renderer { display: none !important }
ytd-video-description-infocards-section-renderer.style-scope.ytd-structured-description-content-renderer > #header.ytd-video-description-infocards-section-renderer, ytd-video-description-infocards-section-renderer.style-scope.ytd-structured-description-content-renderer > #action-buttons.ytd-video-description-infocards-section-renderer, #social-links.ytd-video-description-infocards-section-renderer { display: none !important }
ytd-video-description-infocards-section-renderer.style-scope.ytd-structured-description-content-renderer { border-top: 0 !important }
button.ytp-button.ytp-jump-button.ytp-jump-button-enabled { display: none !important }
ytd-player#ytd-player.style-scope.ytd-watch-flexy > div#container.style-scope.ytd-player > .html5-video-player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > a.ytp-next-button.ytp-button { display: block !important }
div#chip-bar.style-scope.ytd-search-header-renderer { display: none !important }
ytd-search-header-renderer .yt-spec-button-shape-next--size-m { flex-direction: row-reverse }
ytd-search-header-renderer .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-trailing .yt-spec-button-shape-next__icon { margin-left: -6px; margin-right: 6px }
#play.ytd-moving-thumbnail-renderer { color: #fff !important }
ytd-button-renderer.style-scope.yt-chip-cloud-renderer div.yt-spec-button-shape-next__icon, ytd-button-renderer.style-scope.yt-chip-cloud-renderer yt-icon, ytd-button-renderer.ytd-feed-filter-chip-bar-renderer div.yt-spec-button-shape-next__icon, ytd-button-renderer.ytd-feed-filter-chip-bar-renderer yt-icon { width: 20px !important; height: 20px !important }
ytd-video-primary-info-renderer div#flexible-item-buttons.style-scope.ytd-menu-renderer > yt-button-view-model > button-view-model > button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading,
ytd-video-primary-info-renderer div#top-level-buttons-computed.top-level-buttons.style-scope.ytd-menu-renderer > yt-button-view-model > button-view-model > button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading,
ytd-video-primary-info-renderer button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-end.yt-spec-button-shape-next--icon-leading { padding-left: 12px !important; padding-right: 6px !important; background-color: transparent !important }
ytd-video-primary-info-renderer button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading, button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading.yt-spec-button-shape-next--segmented-start { padding-left: 12px !important; padding-right: 6px !important; background-color: transparent !important }
ytd-video-primary-info-renderer button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading.yt-spec-button-shape-next--segmented-start { padding-right: 16px !important }
ytd-video-primary-info-renderer dislike-button-view-model.YtDislikeButtonViewModelHost > toggle-button-view-model > button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m, ytd-menu-renderer[has-items] yt-button-shape.ytd-menu-renderer > button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button, .yt-spec-button-shape-next--disabled.yt-spec-button-shape-next--tonal { background-color: transparent !important }
ytd-video-primary-info-renderer .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-start::after { width: 0 !important }
ytd-video-primary-info-renderer button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--segmented-end { background: transparent !important }
ytd-video-primary-info-renderer button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--segmented-end[aria-label="Dislike this video"] { width: 92px !important }
ytd-video-primary-info-renderer button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--segmented-end[aria-label="Dislike this video"]::after { padding-left: 6px; content: "Dislike" }
ytd-video-primary-info-renderer button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--segmented-end[aria-label="Marcar “No me gusta” en el video"] { width: 134px !important }
ytd-video-primary-info-renderer button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--segmented-end[aria-label="Marcar “No me gusta” en el video"]::after { padding-left: 6px; content: "No me gusta" }
ytd-video-primary-info-renderer button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--segmented-end[aria-label="Je n'aime pas cette vidéo"] { width: 106px !important }
ytd-video-primary-info-renderer button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button.yt-spec-button-shape-next--segmented-end[aria-label="Je n'aime pas cette vidéo"]::after { padding-left: 6px; content: "Je n'aime" }
#less-replies > yt-button-shape > button > div.yt-spec-button-shape-next__icon [d*="M18.4 14.6 12 8.3l-6.4 6.3.8.8L12 9.7l5.6 5.7z"] { d: path("m7 14 5-5 5 5z") !important }
#more-replies > yt-button-shape > button > div.yt-spec-button-shape-next__icon [d*="m18 9.28-6.35 6.35-6.37-6.35.72-.71 5.64 5.65 5.65-5.65z"] { d: path("m7 10 5 5 5-5z") !important }
#less-replies-icon > yt-button-shape > button > div [d*="M18.4 14.6 12 8.3l-6.4 6.3.8.8L12 9.7l5.6 5.7z"] { d: path("m7 14 5-5 5 5z") !important }
#more-replies-icon > yt-button-shape > button > div [d*="m18 9.28-6.35 6.35-6.37-6.35.72-.71 5.64 5.65 5.65-5.65z"] { d: path("m7 10 5 5 5-5z") !important }
#pinned-comment-badge > ytd-pinned-comment-badge-renderer > yt-icon > yt-icon-shape { color: var(--yt-spec-text-primary) !important }
#creator-heart-button.ytd-creator-heart-renderer { width: 32px !important; height: 32px !important }
#hearted-thumbnail.ytd-creator-heart-renderer { width: 16px !important; height: 16px !important }
[d*="M16.296 16.996a8 8 0 11.707-.708l3.909 3.91-.707.707-3.909-3.909zM18 11a7 7 0 00-14 0 7 7 0 1014 0z"] { d: path("m20.87 20.17-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z") }
[d*="m12.71 12 8.15 8.15-.71.71L12 12.71l-8.15 8.15-.71-.71L11.29 12 3.15 3.85l.71-.71L12 11.29l8.15-8.15.71.71L12.71 12z"] { d: path("M12.7,12l6.6,6.6l-0.7,0.7L12,12.7l-6.6,6.6l-0.7-0.7l6.6-6.6L4.6,5.4l0.7-0.7l6.6,6.6l6.6-6.6l0.7,0.7L12.7,12z") }
[d*="M12 20.5c1.894 0 3.643-.62 5.055-1.666a5.5 5.5 0 00-10.064-.105.755.755 0 01-.054.099A8.462 8.462 0 0012 20.5Zm4.079-5.189a7 7 0 012.142 2.48 8.5 8.5 0 10-12.443 0 7 7 0 0110.3-2.48ZM12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm2-12.5a2 2 0 11-4 0 2 2 0 014 0Zm1.5 0a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0Z"] { d: path("m11 7 6 3.5-6 3.5V7zm7 13H4V6H3v15h15v-1zm3-2H6V3h15v15zM7 17h13V4H7v13z") }
[d*="M18.37 19.709A9.98 9.98 0 0022 12c0-5.523-4.477-10-10-10S2 6.477 2 12a9.98 9.98 0 003.63 7.709A9.96 9.96 0 0012 22a9.96 9.96 0 006.37-2.291ZM6.15 18.167a6.499 6.499 0 0111.7 0A8.47 8.47 0 0112 20.5a8.47 8.47 0 01-5.85-2.333ZM15.5 9.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0Z"] { d: path("M4 20h14v1H3V6h1v14zM21 3v15H6V3h15zm-4 7.5L11 7v7l6-3.5z") }
[d*="M13.053 5.906a2.1 2.1 0 01.002 4.188 2.1 2.1 0 01-2.963 2.961 2.1 2.1 0 01-4.189.003 2.1 2.1 0 01-2.96-2.964 2.1 2.1 0 01-.002-4.188 2.1 2.1 0 012.962-2.961 2.1 2.1 0 014.189-.001 2.1 2.1 0 012.961 2.962ZM7.999 4v4.668a1.75 1.75 0 101 1.582V6h2V4h-3Z"] { d: path("M8 8.764V2h5v3H9v6a3 3 0 11-1-2.236Z") }
[d*="M10.334 4.205a1.8 1.8 0 010 3.59 1.8 1.8 0 01-2.539 2.54 1.8 1.8 0 01-3.59-.001 1.8 1.8 0 01-2.538-2.539 1.8 1.8 0 010-3.59 1.8 1.8 0 012.538-2.539 1.8 1.8 0 013.59 0 1.8 1.8 0 012.539 2.539ZM6 3v2.668A1.75 1.75 0 107 7.25V4h1V3H6Z"] { d: path("M8 8.764V2h5v3H9v6a3 3 0 11-1-2.236Z") }
ytd-comments-header-renderer[use-space-between] #title.ytd-comments-header-renderer { justify-content: start !important }
#panel-button.ytd-comments-header-renderer { margin-left: 32px; margin-right: 8px }
#panel-button .yt-spec-button-shape-next__icon { margin-right: 0 }
#panel-button .yt-spec-button-shape-next--size-m { padding-left: 12px; padding-right: 6px }
#panel-button .yt-spec-button-shape-next__button-text-content { display: none !important }
#panel-button .yt-spec-button-shape-next__icon path { d: path("M10 3H17V7H10V3ZM20 0H0V14H20V0ZM1 1H19V13H1V1Z") !important; transform: scale(1.20) !important }
ytd-search ytd-video-renderer, ytd-search ytd-channel-renderer, ytd-search ytd-playlist-renderer, ytd-search ytd-radio-renderer, ytd-search ytd-movie-renderer, ytd-video-renderer.style-scope.ytd-item-section-renderer, ytd-playlist-renderer.style-scope.ytd-item-section-renderer { margin-top: 16px !important }
.yt-lockup-view-model-wiz--horizontal.yt-lockup-view-model-wiz--collection-stack-2 { margin-top: 0 !important }
yt-lockup-view-model .yt-content-metadata-view-model-wiz__metadata-text { font-size: 1.2rem !important }
.yt-spec-button-shape-next--size-m { text-transform: uppercase !important }
/* Undoing UI changes after 2024 redesign */
.ytp-cairo-refresh-signature-moments .ytp-play-progress, ytd-thumbnail-overlay-resume-playback-renderer[enable-refresh-signature-moments-web] #progress.ytd-thumbnail-overlay-resume-playback-renderer, .YtThumbnailOverlayProgressBarHostWatchedProgressBarSegmentModern, .YtChapteredProgressBarChapteredPlayerBarChapterRefresh, .YtChapteredProgressBarChapteredPlayerBarFillRefresh, .YtProgressBarLineProgressBarPlayedRefresh, yt-page-navigation-progress[enable-refresh-signature-moments-web] #progress.yt-page-navigation-progress, ytd-progress-bar-line[enable-refresh-signature-moments-web] .progress-bar-played.ytd-progress-bar-line, #logo-icon > .yt-spec-icon-shape.yt-icon.style-scope.yt-icon-shape > div > svg > g:first-of-type > path:first-of-type { background: #ff0000 !important }
div#end.style-scope.ytd-masthead .yt-spec-button-shape-next--size-m[aria-label="Create"] { height: 40px !important; border-radius: 50px !important; color: var(--yt-spec-icon-active-other) !important; background-color: transparent !important }
div#end.style-scope.ytd-masthead .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading[aria-label="Create"] .yt-spec-button-shape-next__button-text-content { display: none !important }
div#end.style-scope.ytd-masthead .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading[aria-label="Create"] .yt-spec-button-shape-next__icon { margin-left: -8px !important; margin-right: -8px !important }
div#end.style-scope.ytd-masthead .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading[aria-label="Create"] path { d: path("M14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2zm3-7H3v12h14v-6.39l4 1.83V8.56l-4 1.83V6m1-1v3.83L22 7v8l-4-1.83V19H2V5h16z") }
div#end.style-scope.ytd-masthead .yt-spec-icon-badge-shape--style-overlay.yt-spec-icon-badge-shape--type-cart-refresh .yt-spec-icon-badge-shape__badge { color: #fff !important }
[d*="M18 4v15.06l-5.42-3.87-.58-.42-.58.42L6 19.06V4h12m1-1H5v18l7-5 7 5V3z"] { d: path("M22 13h-4v4h-2v-4h-4v-2h4V7h2v4h4v2zm-8-6H2v1h12V7zM2 12h8v-1H2v1zm0 4h8v-1H2v1z") }
button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-leading[aria-label="Save to playlist"] path, button.yt-spec-button-shape-next.yt-spec-button-shape-next--tonal.yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--icon-button[aria-label="Save playlist"] path { d: path("M22 13h-4v4h-2v-4h-4v-2h4V7h2v4h4v2zm-8-6H2v1h12V7zM2 12h8v-1H2v1zm0 4h8v-1H2v1z") }
[d*="M22.146 11.146a.5.5 0 01-.353.854H20v7.5a1.5 1.5 0 01-1.5 1.5h-5v-7h-3v7h-5A1.5 1.5 0 014 19.5V12H2.207a.5.5 0 01-.353-.854L12 1l10.146 10.146ZM18.5 9.621l-6.5-6.5-6.5 6.5V19.5H9V13a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v6.5h3.5V9.621Z"] { d: path("m12 4.44 7 6.09V20h-4v-6H9v6H5v-9.47l7-6.09m0-1.32-8 6.96V21h6v-6h4v6h6V10.08l-8-6.96z") }
[d*="M22.146 11.146a.5.5 0 01-.353.854H20v7.5a1.5 1.5 0 01-1.5 1.5H14v-8h-4v8H5.5A1.5 1.5 0 014 19.5V12H2.207a.5.5 0 01-.353-.854L12 1l10.146 10.146Z"] { d: path("M4 21V10.08l8-6.96 8 6.96V21h-6v-6h-4v6H4z") }
[d*="m7.61 15.719.392-.22v-2.24l-.534-.228-.942-.404c-.869-.372-1.4-1.15-1.446-1.974-.047-.823.39-1.642 1.203-2.097h.001L15.13 3.59c1.231-.689 2.785-.27 3.466.833.652 1.058.313 2.452-.879 3.118l-1.327.743-.388.217v2.243l.53.227.942.404c.869.372 1.4 1.15 1.446 1.974.047.823-.39 1.642-1.203 2.097l-.002.001-8.845 4.964-.001.001c-1.231.688-2.784.269-3.465-.834-.652-1.058-.313-2.451.879-3.118l1.327-.742Zm1.993 6.002c-1.905 1.066-4.356.46-5.475-1.355-1.057-1.713-.548-3.89 1.117-5.025a4.14 4.14 0 01.305-.189l1.327-.742-.942-.404a4.055 4.055 0 01-.709-.391c-.963-.666-1.578-1.718-1.644-2.877-.08-1.422.679-2.77 1.968-3.49l8.847-4.966c1.905-1.066 4.356-.46 5.475 1.355 1.057 1.713.548 3.89-1.117 5.025a4.074 4.074 0 01-.305.19l-1.327.742.942.403c.253.109.49.24.709.392.963.666 1.578 1.717 1.644 2.876.08 1.423-.679 2.77-1.968 3.491l-8.847 4.965ZM10 14.567a.25.25 0 00.374.217l4.45-2.567a.25.25 0 000-.433l-4.45-2.567a.25.25 0 00-.374.216v5.134Z"] { d: path("M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zm-.23 5.86-8.5 4.5c-1.34.71-3.01.2-3.72-1.14-.71-1.34-.2-3.01 1.14-3.72l2.04-1.08v-1.21l-.69-.28-1.11-.46c-.99-.41-1.65-1.35-1.7-2.41-.05-1.06.52-2.06 1.46-2.56l8.5-4.5c1.34-.71 3.01-.2 3.72 1.14.71 1.34.2 3.01-1.14 3.72L15.5 9.26v1.21l1.8.74c.99.41 1.65 1.35 1.7 2.41.05 1.06-.52 2.06-1.46 2.56z") }
[d*="M18.45 8.851c1.904-1.066 2.541-3.4 1.422-5.214-1.119-1.814-3.57-2.42-5.475-1.355L5.55 7.247c-1.29.722-2.049 2.069-1.968 3.491.081 1.423.989 2.683 2.353 3.268l.942.404-1.327.742c-1.904 1.066-2.541 3.4-1.422 5.214 1.119 1.814 3.57 2.421 5.475 1.355l8.847-4.965c1.29-.722 2.049-2.068 1.968-3.49-.081-1.423-.989-2.684-2.353-3.269l-.942-.403 1.327-.743ZM10 14.567a.25.25 0 00.374.217l4.45-2.567a.25.25 0 000-.433l-4.45-2.567a.25.25 0 00-.374.216v5.134Z"] { d: path("m17.77 10.32-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zM10 14.65v-5.3L15 12l-5 2.65z") }
[d*="M4 4.5A1.5 1.5 0 015.5 3h13A1.5 1.5 0 0120 4.5H4Zm16.5 3h-17v11h17v-11ZM3.5 6A1.5 1.5 0 002 7.5v11A1.5 1.5 0 003.5 20h17a1.5 1.5 0 001.5-1.5v-11A1.5 1.5 0 0020.5 6h-17Zm7.257 4.454a.5.5 0 00-.757.43v4.233a.5.5 0 00.757.429L15 13l-4.243-2.546Z"] { d: path("M10 18v-6l5 3-5 3zm7-15H7v1h10V3zm3 3H4v1h16V6zm2 3H2v12h20V9zM3 10h18v10H3V10z") }
[d*="M5.5 3A1.5 1.5 0 004 4.5h16A1.5 1.5 0 0018.5 3h-13ZM2 7.5A1.5 1.5 0 013.5 6h17A1.5 1.5 0 0122 7.5v11a1.5 1.5 0 01-1.5 1.5h-17A1.5 1.5 0 012 18.5v-11Zm8 2.87a.5.5 0 01.752-.431L16 13l-5.248 3.061A.5.5 0 0110 15.63v-5.26Z"] { d: path("M20 7H4V6h16v1zm2 2v12H2V9h20zm-7 6-5-3v6l5-3zm2-12H7v1h10V3z") }
[d*="M14.203 4.83c-1.74-.534-3.614-.418-5.274.327-1.354.608-2.49 1.6-3.273 2.843H8.25c.414 0 .75.336.75.75s-.336.75-.75.75H3V4.25c0-.414.336-.75.75-.75s.75.336.75.75v2.775c.935-1.41 2.254-2.536 3.815-3.236 1.992-.894 4.241-1.033 6.328-.392 2.088.641 3.87 2.02 5.017 3.878 1.146 1.858 1.578 4.07 1.215 6.223-.364 2.153-1.498 4.1-3.19 5.48-1.693 1.379-3.83 2.095-6.012 2.016-2.182-.08-4.26-.949-5.849-2.447-1.588-1.499-2.578-3.523-2.784-5.697-.039-.412.264-.778.676-.817.412-.04.778.263.818.675.171 1.812.996 3.499 2.32 4.748 1.323 1.248 3.055 1.973 4.874 2.04 1.818.065 3.598-.532 5.01-1.681 1.41-1.15 2.355-2.773 2.657-4.567.303-1.794-.056-3.637-1.012-5.186-.955-1.548-2.44-2.697-4.18-3.231ZM12.75 7.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75v4.886l.314.224 3.5 2.5c.337.241.806.163 1.046-.174.241-.337.163-.806-.174-1.046l-3.186-2.276V7.5Z"] { d: path("M14.97 16.95 10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM22 12c0 5.51-4.49 10-10 10S2 17.51 2 12h1c0 4.96 4.04 9 9 9s9-4.04 9-9-4.04-9-9-9C8.81 3 5.92 4.64 4.28 7.38c-.11.18-.22.37-.31.56L3.94 8H8v1H1.96V3h1v4.74c.04-.09.07-.17.11-.25.11-.22.23-.42.35-.63C5.22 3.86 8.51 2 12 2c5.51 0 10 4.49 10 10z") }
[d*="M3.75 5c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75S20.664 5 20.25 5H3.75Zm0 4c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75S20.664 9 20.25 9H3.75Zm0 4c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-8.5Zm8.5 4c.414 0 .75.336.75.75s-.336.75-.75.75h-8.5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h8.5Zm3.498-3.572c-.333-.191-.748.05-.748.434v6.276c0 .384.415.625.748.434L22 17l-6.252-3.572Z"] { d: path("M22 7H2v1h20V7zm-9 5H2v-1h11v1zm0 4H2v-1h11v1zm2 3v-8l7 4-7 4z") }
[d*="M4 5c-.552 0-1 .448-1 1s.448 1 1 1h16c.552 0 1-.448 1-1s-.448-1-1-1H4Zm-1 5c0-.552.448-1 1-1h16c.552 0 1 .448 1 1s-.448 1-1 1H4c-.552 0-1-.448-1-1Zm11 3.862c0-.384.415-.625.748-.434L21 17l-6.252 3.573c-.333.19-.748-.05-.748-.435v-6.276ZM4 13c-.552 0-1 .448-1 1s.448 1 1 1h6c.552 0 1-.448 1-1s-.448-1-1-1H4Zm-1 5c0-.552.448-1 1-1h6c.552 0 1 .448 1 1s-.448 1-1 1H4c-.552 0-1-.448-1-1Z"] { d: path("M15 19v-8l7 4-7 4Zm7-12H2v2h20V7Zm-9 6H2v-2h11v2Zm0 4H2v-2h11v2Z") }
[d*="M3.5 5.5h17v13h-17v-13ZM2 5.5C2 4.672 2.672 4 3.5 4h17c.828 0 1.5.672 1.5 1.5v13c0 .828-.672 1.5-1.5 1.5h-17c-.828 0-1.5-.672-1.5-1.5v-13Zm7.748 2.927c-.333-.19-.748.05-.748.435v6.276c0 .384.415.625.748.434L16 12 9.748 8.427Z"] { d: path("m10 8 6 4-6 4V8zm11-5v18H3V3h18zm-1 1H4v16h16V4z") }
[d*="M20.5 12c0 4.694-3.806 8.5-8.5 8.5S3.5 16.694 3.5 12 7.306 3.5 12 3.5s8.5 3.806 8.5 8.5Zm1.5 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-9.25-5c0-.414-.336-.75-.75-.75s-.75.336-.75.75v5.375l.3.225 4 3c.331.248.802.181 1.05-.15.248-.331.181-.801-.15-1.05l-3.7-2.775V7Z"] { d: path("M14.97 16.95 10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM12 3c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9m0-1c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z") }
[d*="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm1-15c0-.552-.448-1-1-1s-1 .448-1 1v5.5l.4.3 4 3c.442.331 1.069.242 1.4-.2.331-.442.242-1.069-.2-1.4L13 11.5V7Z"] { d: path("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.97 14.95L10 13.87V7h2v5.76l4.03 2.49-1.06 1.7z") }
[d*="M14.813 5.018 14.41 6.5 14 8h5.192c.826 0 1.609.376 2.125 1.022.711.888.794 2.125.209 3.101L21 13l.165.413c.519 1.296.324 2.769-.514 3.885l-.151.202v.5c0 1.657-1.343 3-3 3H5c-1.105 0-2-.895-2-2v-8c0-1.105.895-2 2-2h2v.282c0-.834.26-1.647.745-2.325L12 1l1.1.472c1.376.59 2.107 2.103 1.713 3.546ZM7 10.5H5c-.276 0-.5.224-.5.5v8c0 .276.224.5.5.5h2v-9Zm10.5 9h-9V9.282c0-.521.163-1.03.466-1.453l3.553-4.975c.682.298 1.043 1.051.847 1.77l-.813 2.981c-.123.451-.029.934.255 1.305.284.372.725.59 1.192.59h5.192c.37 0 .722.169.954.459.32.399.357.954.094 1.393l-.526.876c-.241.402-.28.894-.107 1.33l.165.412c.324.81.203 1.73-.32 2.428l-.152.202c-.195.26-.3.575-.3.9v.5c0 .828-.672 1.5-1.5 1.5Z"] { d: path("M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z M7,20H4v-8h3V20z M19.98,13.17l-1.34,6 C18.54,19.65,18.03,20,17.43,20H8v-8.61l5.6-6.06C13.79,5.12,14.08,5,14.38,5c0.26,0,0.5,0.11,0.63,0.3 c0.07,0.1,0.15,0.26,0.09,0.47l-1.52,4.94L13.18,12h1.35h4.23c0.41,0,0.8,0.17,1.03,0.46C19.92,12.61,20.05,12.86,19.98,13.17z") }
[d*="M8 21V9.282a4 4 0 01.745-2.325L13 1l.551.33a3 3 0 011.351 3.363L14 8h5.192a2.722 2.722 0 012.334 4.123L21 13l.165.413a4 4 0 01-.514 3.885l-.151.202v.5a3 3 0 01-3 3H8ZM4.5 9A1.5 1.5 0 003 10.5v9A1.5 1.5 0 004.5 21H7V9H4.5Z"] { d: path("M3,11h3v10H3V11z M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11v10h10.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z") }
[d*="m8.042 9.456-.716.08c-.732.08-1.486-.16-2.043-.718-.977-.976-.977-2.559 0-3.535.976-.977 2.559-.977 3.535 0 .558.557.798 1.312.717 2.044l-.079.715.51.51 10.13 10.13c-.97.643-2.291.537-3.146-.318l-4.951-4.951-1.061 1.06 4.951 4.952c1.442 1.442 3.712 1.553 5.282.331.13-.1.255-.212.375-.331l.707-.707-1.06-1.061L15.534 12l5.657-5.657 1.06-1.06-.706-.708c-.12-.12-.245-.23-.376-.331-1.569-1.222-3.839-1.111-5.281.331L13.06 7.404l1.061 1.06 2.829-2.828c.855-.855 2.175-.961 3.146-.318l-4.56 4.56 1.06 1.061L15.536 12l-4.51-4.51c.128-1.164-.254-2.375-1.147-3.268-1.562-1.562-4.095-1.562-5.657 0-1.562 1.562-1.562 4.095 0 5.657.893.893 2.104 1.276 3.269 1.147l2.033 2.033 1.06-1.06-2.033-2.033-.509-.51Zm-.285-3.113c-.39-.39-1.023-.39-1.414 0-.39.39-.39 1.024 0 1.415.39.39 1.024.39 1.414 0 .39-.391.39-1.024 0-1.415Zm-.43 8.122.715.079.51-.51.973-.973L8.465 12l-.975.974c-1.165-.128-2.375.254-3.268 1.147-1.562 1.562-1.562 4.095 0 5.657 1.562 1.562 4.094 1.562 5.657 0 .893-.893 1.275-2.104 1.147-3.269l.974-.973-1.06-1.061-.975.974-.509.509.079.716c.08.732-.16 1.486-.717 2.044-.976.976-2.56.976-3.536 0-.976-.977-.976-2.56 0-3.536.558-.558 1.312-.798 2.044-.717Zm-.984 3.192c.39.39 1.024.39 1.414 0 .39-.39.39-1.024 0-1.414-.39-.39-1.023-.39-1.414 0-.39.39-.39 1.023 0 1.414Z"] { d: path("M8 7c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm-1 9c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm3.79-7.77L21 18.44V20h-3.27l-5.76-5.76-1.27 1.27c.19.46.3.96.3 1.49 0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4c.42 0 .81.08 1.19.2l1.37-1.37-1.11-1.11C8 10.89 7.51 11 7 11c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4c0 .43-.09.84-.21 1.23zm-.71.71-.43-.44.19-.58c.11-.34.16-.64.16-.92 0-1.65-1.35-3-3-3S4 5.35 4 7s1.35 3 3 3c.36 0 .73-.07 1.09-.21l.61-.24.46.46 1.11 1.11.71.71-.71.71-1.37 1.37-.43.43-.58-.18C7.55 14.05 7.27 14 7 14c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3c0-.38-.07-.75-.22-1.12l-.25-.61.47-.47 1.27-1.27.71-.71.71.71L18.15 19H20v-.15l-9.92-9.91zM17.73 4H21v1.56l-5.52 5.52-2.41-2.41L17.73 4zm.42 1-3.67 3.67 1 1L20 5.15V5h-1.85z") }
[d*="M21.9 19.071c-1.563 1.562-4.095 1.562-5.657 0l-4.4-4.4-.994.995c.468 1.394.147 2.995-.964 4.105-1.562 1.562-4.094 1.562-5.656 0-1.563-1.562-1.563-4.095 0-5.657.98-.98 2.342-1.345 3.608-1.095l1.177-1.177-.928-.927c-1.334.356-2.817.01-3.864-1.036-1.562-1.562-1.562-4.095 0-5.657 1.562-1.562 4.094-1.562 5.657 0 1.046 1.047 1.392 2.53 1.035 3.865l.928.927.002-.002 2.83 2.83-.002.002 7.227 7.227ZM8.5 7c0-.828-.672-1.5-1.5-1.5-.829 0-1.5.672-1.5 1.5 0 .829.671 1.5 1.5 1.5.828 0 1.5-.671 1.5-1.5Zm7.584-2.228c1.563-1.562 4.097-1.56 5.659.001l-6.007 6.007-2.83-2.83 3.178-3.178ZM8.507 16.993c0 .828-.672 1.5-1.5 1.5-.829 0-1.5-.672-1.5-1.5 0-.829.671-1.5 1.5-1.5.828 0 1.5.671 1.5 1.5Z"] { d: path("M22 3h-4l-5 5 3 3 6-6V3zM10.79 7.79c.12-.41.21-.84.21-1.29C11 4.01 8.99 2 6.5 2S2 4.01 2 6.5 4.01 11 6.5 11c.45 0 .88-.09 1.29-.21L9 12l-1.21 1.21c-.41-.12-.84-.21-1.29-.21C4.01 13 2 15.01 2 17.5S4.01 22 6.5 22s4.5-2.01 4.5-4.5c0-.45-.09-.88-.21-1.29L12 15l6 6h4v-2L10.79 7.79zM6.5 8C5.67 8 5 7.33 5 6.5S5.67 5 6.5 5 8 5.67 8 6.5 7.33 8 6.5 8zm0 11c-.83 0-1.5-.67-1.5-1.5S5.67 16 6.5 16s1.5.67 1.5 1.5S7.33 19 6.5 19z") }
[d*="m14 2-1.5.886-5.195 3.07C4.637 7.533 3 10.401 3 13.5c0 4.694 3.806 8.5 8.5 8.5s8.5-3.806 8.5-8.5V1l-1.5 1-3 2L14 5V2ZM8.068 7.248l4.432-2.62v3.175l2.332-1.555L18.5 3.803V13.5c0 3.866-3.134 7-7 7s-7-3.134-7-7c0-2.568 1.357-4.946 3.568-6.252ZM9 15c0-1.226.693-2.346 1.789-2.894L15 10v5c0 1.657-1.343 3-3 3s-3-1.343-3-3Z"] { d: path("M14.72,17.84c-0.32,0.27-0.83,0.53-1.23,0.66c-1.34,0.33-2.41-0.34-2.62-0.46c-0.21-0.11-0.78-0.38-0.78-0.38 s0.35-0.11,0.41-0.13c1.34-0.54,1.89-1.24,2.09-2.11c0.2-0.84-0.16-1.56-0.31-2.39c-0.12-0.69-0.11-1.28,0.12-1.9 c0.02-0.05,0.12-0.43,0.12-0.43s0.11,0.35,0.13,0.41c0.71,1.51,2.72,2.18,3.07,3.84c0.03,0.15,0.05,0.3,0.05,0.46 C15.8,16.3,15.4,17.26,14.72,17.84z M12.4,4.34c-0.12,0.08-0.22,0.15-0.31,0.22c-2.99,2.31-2.91,5.93-2.31,8.55l0.01,0.03l0.01,0.03 c0.06,0.35-0.05,0.7-0.28,0.96c-0.24,0.26-0.58,0.41-0.95,0.41c-0.44,0-0.85-0.2-1.22-0.6c-0.67-0.73-1.17-1.57-1.5-2.46 c-0.36,0.77-0.75,1.98-0.67,3.19c0.04,0.51,0.12,1,0.25,1.43c0.18,0.6,0.43,1.16,0.75,1.65c1.05,1.66,2.88,2.82,4.78,3.05 c0.42,0.05,0.85,0.08,1.26,0.08c1.34,0,3.25-0.27,4.74-1.57c1.77-1.56,2.35-3.99,1.44-6.06c-0.04-0.1-0.06-0.14-0.09-0.19 l-0.04-0.08c-0.21-0.42-0.47-0.81-0.75-1.14c-0.24-0.3-0.48-0.56-0.79-0.83c-0.3-0.27-0.64-0.51-1-0.77 c-0.46-0.33-0.93-0.67-1.38-1.09C12.98,7.83,12.3,6.11,12.4,4.34 M14.41,2c0,0-0.2,0.2-0.56,0.99c-0.66,1.92-0.15,3.95,1.34,5.39 c0.73,0.69,1.61,1.17,2.36,1.84c0.32,0.29,0.62,0.59,0.89,0.93c0.36,0.42,0.66,0.89,0.91,1.38c0.05,0.1,0.1,0.2,0.14,0.3 c1.12,2.55,0.36,5.47-1.73,7.31C16.23,21.47,14.22,22,12.22,22c-0.47,0-0.95-0.03-1.41-0.09c-2.29-0.28-4.42-1.66-5.63-3.57 c-0.39-0.6-0.68-1.26-0.88-1.93c-0.16-0.54-0.25-1.1-0.29-1.67c-0.12-1.88,0.67-3.63,1.08-4.31c0.41-0.69,1.55-2.18,1.55-2.18 s0,0.03-0.01,0.09C6.41,10.11,7,11.88,8.22,13.22c0.15,0.17,0.27,0.22,0.34,0.22c0.06,0,0.09-0.04,0.08-0.09 C7.79,9.59,8.37,6,11.35,3.7c0.59-0.46,1.51-0.94,1.98-1.18C13.8,2.28,14.41,2,14.41,2L14.41,2z") }
[d*="M14 2 7.305 5.956C4.637 7.533 3 10.401 3 13.5c0 4.694 3.806 8.5 8.5 8.5s8.5-3.806 8.5-8.5V1l-6 4V2ZM9 15c0-1.226.693-2.346 1.789-2.894L15 10v5c0 1.657-1.343 3-3 3s-3-1.343-3-3Z"] { d: path("M19.48,12.83c-0.04-0.1-0.09-0.2-0.14-0.3c-0.25-0.49-0.55-0.96-0.91-1.38c-0.27-0.34-0.57-0.65-0.89-0.93 c-0.75-0.67-1.63-1.14-2.36-1.84c-1.49-1.44-2-3.46-1.34-5.39C14.2,2.2,14.41,2,14.41,2s-0.6,0.28-1.07,0.52 c-0.47,0.24-1.39,0.72-1.98,1.18C8.37,6,7.79,9.59,8.64,13.35c0.01,0.05-0.02,0.09-0.08,0.09c-0.07,0-0.18-0.06-0.34-0.22 C7,11.88,6.41,10.11,6.64,8.35c0.01-0.06,0.01-0.09,0.01-0.09S5.51,9.74,5.1,10.43c-0.41,0.69-1.2,2.43-1.08,4.31 c0.04,0.56,0.13,1.12,0.29,1.67c0.2,0.68,0.49,1.33,0.88,1.93c1.21,1.91,3.34,3.29,5.63,3.57c0.47,0.06,0.94,0.09,1.41,0.09 c2,0,4.01-0.53,5.53-1.87C19.84,18.3,20.6,15.38,19.48,12.83z M14.72,17.84c-0.32,0.27-0.83,0.53-1.23,0.66 c-1.34,0.33-2.41-0.34-2.62-0.46c-0.21-0.11-0.78-0.38-0.78-0.38s0.35-0.11,0.41-0.13c1.34-0.54,1.89-1.24,2.09-2.11 c0.2-0.84-0.16-1.56-0.31-2.39c-0.12-0.69-0.11-1.28,0.12-1.9c0.02-0.05,0.12-0.43,0.12-0.43s0.11,0.35,0.13,0.41 c0.71,1.51,2.72,2.18,3.07,3.84c0.03,0.15,0.05,0.3,0.05,0.46C15.8,16.3,15.4,17.26,14.72,17.84z") }
[d*="M12 2.5c-.328 0-.653.065-.957.19-.303.126-.579.31-.81.542-.233.232-.417.508-.543.811-.125.304-.19.629-.19.957v1h5V5c0-.328-.065-.653-.19-.957-.126-.303-.31-.579-.542-.81-.232-.233-.508-.417-.811-.543-.304-.125-.629-.19-.957-.19ZM16 5v1h3.5c.828 0 1.5.672 1.5 1.5V18c0 2.21-1.79 4-4 4H7c-2.21 0-4-1.79-4-4V7.5C3 6.672 3.672 6 4.5 6H8V5c0-.525.103-1.045.304-1.53.201-.486.496-.927.868-1.298.371-.372.812-.667 1.297-.868C10.955 1.104 11.475 1 12 1c.525 0 1.045.103 1.53.304.486.202.927.496 1.298.868.372.371.667.812.867 1.297C15.896 3.955 16 4.475 16 5Zm-4 7.5c-.328 0-.653-.065-.957-.19-.303-.126-.579-.31-.81-.542-.233-.232-.417-.508-.543-.811-.125-.304-.19-.629-.19-.957 0-.414-.336-.75-.75-.75S8 9.586 8 10c0 .525.103 1.045.304 1.53.201.486.496.927.868 1.298.371.372.812.667 1.297.867.486.201 1.006.305 1.531.305.525 0 1.045-.104 1.53-.305.486-.2.927-.495 1.298-.867.372-.371.667-.812.867-1.297.201-.486.305-1.006.305-1.531 0-.414-.336-.75-.75-.75s-.75.336-.75.75c0 .328-.065.653-.19.957-.126.303-.31.579-.542.81-.232.233-.508.417-.811.543-.304.125-.629.19-.957.19Zm-7.5-5h15V18c0 1.38-1.12 2.5-2.5 2.5H7c-1.38 0-2.5-1.12-2.5-2.5V7.5Z"] { d: path("M7 8c0 2.76 2.24 5 5 5s5-2.24 5-5h-1c0 2.21-1.79 4-4 4s-4-1.79-4-4H7zm9.9-2c-.46-2.28-2.48-4-4.9-4S7.56 3.72 7.1 6H4v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6h-3.1zM12 3c1.86 0 3.43 1.27 3.87 3H8.13c.44-1.73 2.01-3 3.87-3zm7 17c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1V7h14v13z") }
[d*="M11.235 3.152c.242-.1.502-.152.765-.152s.523.052.765.152c.243.1.463.248.65.434.185.186.332.406.433.649.1.242.152.502.152.765v1h-4V5c0-.263.052-.523.152-.765.1-.243.248-.464.434-.65.185-.185.406-.332.649-.433ZM8 6V5c0-.525.103-1.045.304-1.53.201-.486.496-.927.868-1.298.371-.372.812-.667 1.297-.868C10.955 1.104 11.475 1 12 1c.525 0 1.045.103 1.53.304.486.202.927.496 1.298.868.372.371.667.812.867 1.297C15.896 3.955 16 4.475 16 5v1h3.5c.828 0 1.5.672 1.5 1.5V18c0 2.21-1.79 4-4 4H7c-2.21 0-4-1.79-4-4V7.5C3 6.672 3.672 6 4.5 6H8Zm4 6c-.263 0-.523-.052-.765-.152-.243-.1-.463-.248-.65-.434-.185-.185-.332-.406-.433-.649-.1-.242-.152-.502-.152-.765 0-.552-.448-1-1-1s-1 .448-1 1c0 .525.103 1.045.304 1.53.201.486.496.927.868 1.298.371.372.812.667 1.297.867.486.201 1.006.305 1.531.305.525 0 1.045-.104 1.53-.305.486-.2.927-.495 1.298-.867.372-.371.667-.812.867-1.297.201-.486.305-1.006.305-1.531 0-.552-.448-1-1-1s-1 .448-1 1c0 .263-.052.523-.152.765-.1.243-.248.463-.434.65-.185.185-.406.332-.649.433-.242.1-.502.152-.765.152Z"] { d: path("M16.9 6c-.46-2.28-2.48-4-4.9-4S7.56 3.72 7.1 6H4v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6h-3.1zM12 3c1.86 0 3.43 1.27 3.87 3H8.13c.44-1.73 2.01-3 3.87-3zm0 11c-3.31 0-6-2.69-6-6h2c0 2.21 1.79 4 4 4s4-1.79 4-4h2c0 3.31-2.69 6-6 6z") }
[d*="M19 3c0-.271-.146-.521-.383-.654-.237-.133-.527-.127-.758.014l-9 5.5c-.223.136-.359.379-.359.64v7.901C8.059 16.146 7.546 16 7 16c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3v-7.08l7.5-4.583v6.064c-.441-.255-.954-.401-1.5-.401-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V3Zm-1.5 13c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5Zm-9 3c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5Zm9-13.42L10 10.162V8.92l7.5-4.584V5.58Z"] { d: path("M12 4v9.38c-.73-.84-1.8-1.38-3-1.38-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V8h6V4h-7zM9 19c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm9-12h-5V5h5v2z") }
[d*="M18.49 2.128A1 1 0 0119 3v13a3 3 0 11-2-2.83V7.784l-7 4.278V19a3 3 0 11-2-2.83V8.5a1 1 0 01.479-.853l9-5.5a1 1 0 011.01-.02Z"] { d: path("M12 4v9.38c-.73-.84-1.8-1.38-3-1.38-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V8h6V4h-7z") }
[d*="m3.116 5.998 16.79-2.66.157.988-16.79 2.66-.157-.988Zm-1.481.235c-.13-.819.428-1.587 1.247-1.717l16.79-2.659c.819-.13 1.587.429 1.716 1.247l.157.988.234 1.481-1.481.235L6.463 7.999H22v11.5c0 .829-.672 1.5-1.5 1.5h-17c-.828 0-1.5-.671-1.5-1.5V8.539L1.79 7.22l-.156-.987Zm7.698 3.266h-2L9 11.999H6l-1.667-2.5H3.5v10h17v-10h-3.167L19 12h-3l-1.667-2.501h-2L14 12h-3L9.333 9.499Z"] { d: path("m22.01 4.91-.5-2.96L1.64 5.19 2 8v13h20V8H3.06l18.95-3.09zM5 9l1 3h3L8 9h2l1 3h3l-1-3h2l1 3h3l-1-3h3v11H3V9h2z") }
[d*="M5.636 5.636c.293-.293.293-.768 0-1.06-.293-.294-.768-.294-1.06 0-.976.974-1.75 2.132-2.277 3.406C1.772 9.256 1.5 10.622 1.5 12c0 1.379.272 2.744.8 4.018.527 1.274 1.3 2.432 2.275 3.407.293.293.768.293 1.061 0 .293-.293.293-.768 0-1.061-.836-.836-1.499-1.828-1.95-2.92C3.232 14.352 3 13.182 3 12s.233-2.352.685-3.444c.452-1.092 1.115-2.084 1.951-2.92Zm2.828 1.768c.293.292.293.767 0 1.06-.464.464-.832 1.016-1.083 1.622C7.129 10.693 7 11.343 7 12c0 .656.13 1.306.38 1.913.252.607.62 1.158 1.084 1.622.293.293.293.768 0 1.06-.292.294-.767.294-1.06 0-.604-.603-1.083-1.32-1.41-2.108C5.669 13.7 5.5 12.853 5.5 12c0-.854.168-1.7.495-2.488.326-.788.805-1.505 1.409-2.108.293-.293.768-.293 1.06 0Zm7.072 0c.292-.293.767-.293 1.06 0C17.816 8.623 18.5 10.276 18.5 12c0 1.724-.685 3.377-1.904 4.596-.293.293-.768.293-1.06 0-.293-.293-.293-.768 0-1.06C16.473 14.597 17 13.325 17 12s-.527-2.598-1.464-3.536c-.293-.293-.293-.768 0-1.06Zm2.828-2.829c.293-.293.768-.293 1.06 0C21.395 6.545 22.5 9.215 22.5 12s-1.106 5.456-3.075 7.425c-.293.293-.768.293-1.061 0-.293-.293-.293-.768 0-1.061C20.052 16.676 21 14.387 21 12s-.948-4.676-2.636-6.364c-.293-.293-.293-.768 0-1.06ZM12 14c1.105 0 2-.895 2-2 0-1.104-.895-2-2-2s-2 .896-2 2c0 1.105.895 2 2 2Z"] { d: path("m22.01 4.91-.5-2.96L1.64 5.19 2 8v13h20V8H3.06l18.95-3.09zM18 9l1 3h-3l-1-3h3zm-5 0 1 3h-3l-1-3h3zM8 9l1 3H6L5 9h3z") }
[d*="M5.636 5.636c.293-.293.293-.768 0-1.06-.293-.294-.768-.294-1.06 0-.976.974-1.75 2.132-2.277 3.406C1.772 9.256 1.5 10.622 1.5 12c0 1.379.272 2.744.8 4.018.527 1.274 1.3 2.432 2.275 3.407.293.293.768.293 1.061 0 .293-.293.293-.768 0-1.061-.836-.836-1.499-1.828-1.95-2.92C3.232 14.352 3 13.182 3 12s.233-2.352.685-3.444c.452-1.092 1.115-2.084 1.951-2.92Zm2.828 1.768c.293.292.293.767 0 1.06-.464.464-.832 1.016-1.083 1.622C7.129 10.693 7 11.343 7 12c0 .656.13 1.306.38 1.913.252.607.62 1.158 1.084 1.622.293.293.293.768 0 1.06-.292.294-.767.294-1.06 0-.604-.603-1.083-1.32-1.41-2.108C5.669 13.7 5.5 12.853 5.5 12c0-.854.168-1.7.495-2.488.326-.788.805-1.505 1.409-2.108.293-.293.768-.293 1.06 0Zm7.072 0c.292-.293.767-.293 1.06 0C17.816 8.623 18.5 10.276 18.5 12c0 1.724-.685 3.377-1.904 4.596-.293.293-.768.293-1.06 0-.293-.293-.293-.768 0-1.06C16.473 14.597 17 13.325 17 12s-.527-2.598-1.464-3.536c-.293-.293-.293-.768 0-1.06Zm2.828-2.829c.293-.293.768-.293 1.06 0C21.395 6.545 22.5 9.215 22.5 12s-1.106 5.456-3.075 7.425c-.293.293-.768.293-1.061 0-.293-.293-.293-.768 0-1.061C20.052 16.676 21 14.387 21 12s-.948-4.676-2.636-6.364c-.293-.293-.293-.768 0-1.06ZM12 14c1.105 0 2-.895 2-2 0-1.104-.895-2-2-2s-2 .896-2 2c0 1.105.895 2 2 2Z"] { d: path("M14 12c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM8.48 8.45l-.71-.7C6.68 8.83 6 10.34 6 12s.68 3.17 1.77 4.25l.71-.71C7.57 14.64 7 13.39 7 12s.57-2.64 1.48-3.55zm7.75-.7-.71.71c.91.9 1.48 2.15 1.48 3.54s-.57 2.64-1.48 3.55l.71.71C17.32 15.17 18 13.66 18 12s-.68-3.17-1.77-4.25zM5.65 5.63l-.7-.71C3.13 6.73 2 9.24 2 12s1.13 5.27 2.95 7.08l.71-.71C4.02 16.74 3 14.49 3 12s1.02-4.74 2.65-6.37zm13.4-.71-.71.71C19.98 7.26 21 9.51 21 12s-1.02 4.74-2.65 6.37l.71.71C20.87 17.27 22 14.76 22 12s-1.13-5.27-2.95-7.08z") }
[d*="M5.99 5.99c.39-.391.39-1.024 0-1.415-.39-.39-1.024-.39-1.415 0C3.6 5.55 2.827 6.708 2.3 7.982 1.772 9.256 1.5 10.622 1.5 12c0 1.379.272 2.744.8 4.018.527 1.274 1.3 2.432 2.275 3.407.39.39 1.024.39 1.415 0 .39-.39.39-1.024 0-1.415-.79-.789-1.416-1.726-1.843-2.757C3.72 14.222 3.5 13.116 3.5 12s.22-2.222.647-3.253C4.574 7.716 5.2 6.78 5.99 5.99Zm2.828 1.414c.39.39.39 1.023 0 1.414-.418.418-.75.914-.975 1.46-.227.546-.343 1.13-.343 1.722 0 .59.116 1.176.343 1.722.226.546.557 1.042.975 1.46.39.39.39 1.023 0 1.414-.39.39-1.024.39-1.414 0-.604-.604-1.083-1.32-1.41-2.109C5.669 13.698 5.5 12.853 5.5 12c0-.854.168-1.7.495-2.488.326-.788.805-1.505 1.409-2.108.39-.391 1.024-.391 1.414 0Zm6.364 0c.39-.391 1.024-.391 1.414 0C17.816 8.623 18.5 10.276 18.5 12c0 1.724-.685 3.377-1.904 4.596-.39.39-1.024.39-1.414 0-.39-.39-.39-1.024 0-1.414.844-.844 1.318-1.989 1.318-3.182 0-1.194-.474-2.338-1.318-3.182-.39-.39-.39-1.024 0-1.414Zm2.828-2.829c.39-.39 1.024-.39 1.415 0C21.394 6.545 22.5 9.215 22.5 12s-1.106 5.456-3.075 7.425c-.39.39-1.024.39-1.415 0-.39-.39-.39-1.024 0-1.415 1.595-1.594 2.49-3.756 2.49-6.01s-.895-4.416-2.49-6.01c-.39-.391-.39-1.024 0-1.415ZM12 14.5c1.38 0 2.5-1.12 2.5-2.5S13.38 9.5 12 9.5 9.5 10.62 9.5 12s1.12 2.5 2.5 2.5Z"] { d: path("M14 12c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zM6.36 6.33 4.95 4.92C3.13 6.73 2 9.24 2 12s1.13 5.27 2.95 7.08l1.41-1.41C4.9 16.22 4 14.21 4 12s.9-4.22 2.36-5.67zm12.69-1.41-1.41 1.41C19.1 7.78 20 9.79 20 12s-.9 4.22-2.36 5.67l1.41 1.41C20.87 17.27 22 14.76 22 12s-1.13-5.27-2.95-7.08zM9.19 9.16 7.77 7.75C6.68 8.83 6 10.34 6 12s.68 3.17 1.77 4.25l1.41-1.41C8.46 14.11 8 13.11 8 12s.46-2.11 1.19-2.84zm7.04-1.41-1.41 1.41C15.54 9.89 16 10.89 16 12s-.46 2.11-1.19 2.84l1.41 1.41C17.32 15.17 18 13.66 18 12s-.68-3.17-1.77-4.25z") }
[d*="m12 7.75-.772-.464-4.186-2.511L2.5 7.803v6.307L12 19.29l9.5-5.181V7.803l-4.542-3.028-4.186 2.511L12 7.75ZM12 6 7.814 3.488c-.497-.298-1.122-.283-1.604.039L1.668 6.555C1.251 6.833 1 7.3 1 7.803v6.307c0 .548.3 1.054.782 1.316l9.5 5.182c.447.244.989.244 1.436 0l9.5-5.182c.482-.262.782-.768.782-1.316V7.803c0-.502-.25-.97-.668-1.248L17.79 3.527c-.482-.322-1.107-.337-1.604-.039L12 6Zm3.5 6.25c0 .69-.56 1.25-1.25 1.25S13 12.94 13 12.25 13.56 11 14.25 11s1.25.56 1.25 1.25ZM7 8c-.414 0-.75.336-.75.75v1.5h-1.5c-.414 0-.75.336-.75.75s.336.75.75.75h1.5v1.5c0 .414.336.75.75.75s.75-.336.75-.75v-1.5h1.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-1.5v-1.5C7.75 8.336 7.414 8 7 8Zm10.75 3c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25Z"] { d: path("M10 12H8v2H6v-2H4v-2h2V8h2v2h2v2zm7 .5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5.67 1.5 1.5 1.5 1.5-.67 1.5-1.5zm3-3c0-.83-.67-1.5-1.5-1.5S17 8.67 17 9.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5zm-3.03-4.35-4.5 2.53-.49.27-.49-.27-4.5-2.53L3 7.39v6.43l8.98 5.04 8.98-5.04V7.39l-3.99-2.24m0-1.15 4.99 2.8v7.6L11.98 20 2 14.4V6.8L6.99 4l4.99 2.8L16.97 4z") }
[d*="M1 7.803c0-.502.25-.97.668-1.248L6.21 3.527c.482-.322 1.107-.337 1.604-.039L12 6l4.186-2.512c.497-.298 1.122-.283 1.604.039l4.542 3.028c.417.278.668.746.668 1.248v6.307c0 .549-.3 1.054-.782 1.316l-9.5 5.182c-.447.244-.989.244-1.436 0l-9.5-5.182C1.3 15.164 1 14.658 1 14.11V7.803ZM16 12.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5Zm-9-5c-.552 0-1 .448-1 1V10H4.5c-.552 0-1 .448-1 1 0 .553.448 1 1 1H6v1.5c0 .553.448 1 1 1s1-.447 1-1V12h1.5c.552 0 1-.447 1-1 0-.552-.448-1-1-1H8V8.5c0-.552-.448-1-1-1ZM18.5 11c.828 0 1.5-.672 1.5-1.5S19.328 8 18.5 8 17 8.672 17 9.5s.672 1.5 1.5 1.5Z"] { d: path("m16.97 4-4.99 2.8L6.99 4 2 6.8v7.6l9.98 5.6 9.98-5.6V6.8L16.97 4zM10 12H8v2H6v-2H4v-2h2V8h2v2h2v2zm5.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 8 18.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z") }
[d*="M2 5.121V3l.94.94.56.56.5.5.94-.94.12-.12L6 3l.94.94.12.12L8 5l.94-.94.12-.12L10 3l.94.94.12.12L12 5l.94-.94.12-.12L14 3l.94.94.12.12L16 5l.94-.94.12-.12L18 3l.94.94.12.12L20 5l.5-.5.56-.56L22 3v16c0 1.105-.895 2-2 2H4c-1.105 0-2-.895-2-2V5.121ZM10.75 19.5h-4.5v-5.25h4.5v5.25Zm1.25 0V13H5v6.5H4c-.276 0-.5-.224-.5-.5V7.65l2.514-2.514.925.925L8 7.12l1.06-1.06.94-.94.94.94L12 7.12l1.06-1.06.94-.94.94.94L16 7.12l1.06-1.06.926-.925L20.5 7.65V19c0 .276-.224.5-.5.5h-8ZM19 9v2H5V9h14Zm-5 4h5v1.5h-5V13Zm5 3h-5v1.5h5V16Z"] { d: path("M11 11v6H7v-6h4m1-1H6v8h6v-8zM3 3.03V21h14l4-4V3.03M20 4v11.99l-.01.01H16v3.99l-.01.01H4V4h16zm-2 4H6V6h12v2zm0 7h-5v-2h5v2zm0-3h-5v-2h5v2z") }
[d*="M2 3v16c0 1.105.895 2 2 2h16c1.105 0 2-.895 2-2V3l-2 2-2-2-2 2-2-2-2 2-2-2-2 2-2-2-2 2-2-2Zm17 5v3H5V8h14Zm-7 5H5v6h7v-6Zm2 0h5v2h-5v-2Zm5 4h-5v2h5v-2Z"] { d: path("M3 3.03V21h14l4-4V3.03H3zM6 6h12v2H6V6zm7 9v-2h5v2h-5zm0-3v-2h5v2h-5zm-1 6H6v-8h6v8zm4-2h3.99L16 19.99V16z") }
[d*="M6.5 3.5h11V9c0 3.038-2.462 5.5-5.5 5.5S6.5 12.038 6.5 9V3.5ZM5 3.5C5 2.672 5.672 2 6.5 2h11c.828 0 1.5.672 1.5 1.5V4h2c.552 0 1 .448 1 1v3c0 2.493-1.825 4.56-4.212 4.938-1.082 1.588-2.8 2.707-4.788 2.991V17.5h1.5c.828 0 1.5.672 1.5 1.5v3H8v-3c0-.828.672-1.5 1.5-1.5H11v-1.57c-1.987-.285-3.706-1.404-4.788-2.992C3.825 12.56 2 10.493 2 8V5c0-.552.448-1 1-1h2v-.5Zm0 1.75H3.25V8c0 1.508.89 2.808 2.174 3.403C5.15 10.654 5 9.845 5 9V5.25Zm13.576 6.153C19.86 10.808 20.75 9.508 20.75 8V5.25H19V9c0 .844-.15 1.654-.424 2.403ZM9.5 20.5V19h5v1.5h-5Z"] { d: path("M18 5V2H6v3H3v6l3.23 1.61c.7 2.5 2.97 4.34 5.69 4.38L8 19v3h8v-3l-3.92-2.01c2.72-.04 4.99-1.88 5.69-4.38L21 11V5h-3zM6 11.38l-2-1V6h2v5.38zM15 21H9v-1.39l3-1.54 3 1.54V21zm2-10c0 2.76-2.24 5-5 5s-5-2.24-5-5V3h10v8zm3-.62-2 1V6h2v4.38z") }
[d*="M6.5 2C5.672 2 5 2.672 5 3.5V4H3c-.552 0-1 .448-1 1v3c0 2.493 1.825 4.56 4.212 4.938 1.082 1.588 2.8 2.707 4.788 2.991V18.5H9.5c-.828 0-1.5.672-1.5 1.5v2h8v-2c0-.828-.672-1.5-1.5-1.5H13v-2.57c1.988-.285 3.706-1.404 4.788-2.992C20.175 12.56 22 10.493 22 8V5c0-.552-.448-1-1-1h-2v-.5c0-.828-.672-1.5-1.5-1.5h-11ZM19 5.25V9c0 .844-.15 1.654-.424 2.403C19.86 10.808 20.75 9.508 20.75 8V5.25H19ZM5.424 11.403C5.15 10.654 5 9.845 5 9V5.25H3.25V8c0 1.508.89 2.808 2.174 3.403Z"] { d: path("M18 5V2H6v3H3v6l3.23 1.61c.7 2.5 2.97 4.34 5.69 4.38L8 19v3h8v-3l-3.92-2.01c2.72-.04 4.99-1.88 5.69-4.38L21 11V5h-3zM6 11.38l-2-1V6h2v5.38zm14-1-2 1V6h2v4.38z") }
[d*="m14.5 16.065.749-.434C17.196 14.505 18.5 12.404 18.5 10c0-3.59-2.91-6.5-6.5-6.5S5.5 6.41 5.5 10c0 2.404 1.304 4.505 3.251 5.631l.749.434V17.5h5v-1.435Zm1.5.865c2.391-1.383 4-3.969 4-6.93 0-4.418-3.582-8-8-8s-8 3.582-8 8c0 2.961 1.609 5.546 4 6.93V19h8v-2.07ZM16 20v.5c0 .552-.448 1-1 1h-1.063c-.024.09-.053.179-.09.265-.1.243-.247.463-.433.65-.185.185-.406.332-.649.433-.242.1-.502.152-.765.152s-.523-.052-.765-.152c-.243-.1-.463-.248-.65-.434-.185-.186-.332-.406-.433-.649-.036-.086-.065-.175-.088-.265H9c-.552 0-1-.448-1-1V20h8Z"] { d: path("M16 21h-2.28c-.35.6-.98 1-1.72 1s-1.38-.4-1.72-1H8v-1h8v1zm4-11c0 2.96-1.61 5.54-4 6.92V19H8v-2.08C5.61 15.54 4 12.96 4 10c0-4.42 3.58-8 8-8s8 3.58 8 8zm-5 8v-1.66l.5-.29C17.66 14.8 19 12.48 19 10c0-3.86-3.14-7-7-7s-7 3.14-7 7c0 2.48 1.34 4.8 3.5 6.06l.5.28V18h6z") }
[d*="M16 16.93c2.391-1.383 4-3.969 4-6.93 0-4.418-3.582-8-8-8s-8 3.582-8 8c0 2.961 1.609 5.546 4 6.93V19h8v-2.07ZM16 20v.5c0 .552-.448 1-1 1h-1.063c-.024.09-.053.179-.09.265-.1.243-.247.463-.433.65-.185.185-.406.332-.649.433-.242.1-.502.152-.765.152s-.523-.052-.765-.152c-.243-.1-.463-.248-.65-.434-.185-.186-.332-.406-.433-.649-.036-.086-.065-.175-.088-.265H9c-.552 0-1-.448-1-1V20h8Z"] { d: path("M16 21h-2.28c-.35.6-.98 1-1.72 1s-1.38-.4-1.72-1H8v-1h8v1zm4-11c0 2.96-1.61 5.54-4 6.92V19H8v-2.08C5.61 15.54 4 12.96 4 10c0-4.42 3.58-8 8-8s8 3.58 8 8z") }
[d*="M11.58 2.03c.545-.078 1.1-.003 1.606.214.506.218.942.57 1.26 1.02.319.448.508.976.547 1.525.038.55-.075 1.099-.328 1.588-.252.489-.634.899-1.104 1.185-.254.154-.527.27-.81.343v.705l7.18 5.026c.267.187.383.527.284.84-.098.312-.388.524-.715.524H18v3c0 .552-.448 1-1 1h-2v3h-1v-1h-1v1h-1v-1h-1v1h-1v-1H9v1H8v-1H7v1H6v-7H4.5c-.327 0-.617-.212-.715-.524-.099-.313.017-.653.285-.84l7.18-5.026V7.25c0-.414.336-.75.75-.75.275 0 .545-.076.78-.219.235-.143.427-.348.553-.593.126-.244.183-.519.163-.793-.019-.275-.114-.539-.273-.763-.16-.225-.377-.4-.63-.51-.253-.109-.53-.146-.803-.107-.272.038-.53.151-.742.326-.213.174-.373.404-.464.664-.137.391-.564.597-.955.46-.391-.136-.598-.564-.461-.955.182-.52.503-.98.928-1.328.425-.35.939-.575 1.484-.652ZM15 15h1.5v2.5H15V15Zm2.12-1.5H6.88L12 9.915l5.12 3.585ZM7.5 15h6v4.5h-6V15Z"] { d: path("M12.5 6.44v-.5C13.36 5.71 14 4.93 14 4c0-1.1-.9-2-2-2s-2 .9-2 2h1c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1h-.5v1.44L4 13h2v6h1v2h1v-2h2v3h1v-3h2v2h1v-2h1v-3h3v-3h2l-7.5-6.56zM6.66 12 12 7.33 17.34 12H6.66zM14 18H7v-5h7v5zm1-3v-2h2v2h-2z") }
[d*="M11.58 2.03c.545-.078 1.1-.003 1.606.214.506.218.942.57 1.26 1.02.319.448.508.976.547 1.525.038.55-.075 1.099-.328 1.588-.252.489-.634.899-1.104 1.185-.254.154-.527.27-.81.343v.705l7.18 5.026c.267.187.383.527.284.84-.098.312-.388.524-.715.524H18v3c0 .552-.448 1-1 1h-2v3h-1v-1h-1v1h-1v-1h-1v1h-1v-1H9v1H8v-1H7v1H6v-7H4.5c-.327 0-.617-.212-.715-.524-.099-.313.017-.653.285-.84l7.18-5.026V7.25c0-.414.336-.75.75-.75.275 0 .545-.076.78-.219.235-.143.427-.348.553-.593.126-.244.183-.519.163-.793-.019-.275-.114-.539-.273-.763-.16-.225-.377-.4-.63-.51-.253-.109-.53-.146-.803-.107-.272.038-.53.151-.742.326-.213.174-.373.404-.464.664-.137.391-.564.597-.955.46-.391-.136-.598-.564-.461-.955.182-.52.503-.98.928-1.328.425-.35.939-.575 1.484-.652ZM15 15h1.5v2.5H15V15Zm2.12-1.5H6.88L12 9.915l5.12 3.585Z"] { d: path("M12.5 6.44v-.5C13.36 5.71 14 4.93 14 4c0-1.1-.9-2-2-2s-2 .9-2 2h1c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1h-.5v1.44L4 13h2v6h1v2h1v-2h2v3h1v-3h2v2h1v-2h1v-3h3v-3h2l-7.5-6.56zM6.66 12 12 7.33 17.34 12H6.66z") }
[d*="M7.278 4.933C8.675 3.999 10.318 3.5 12 3.5c1.681 0 3.325.499 4.722 1.433 1.398.934 2.488 2.261 3.13 3.814.644 1.553.813 3.262.485 4.911-.328 1.65-1.138 3.164-2.327 4.352-.293.293-.293.768 0 1.061.293.293.768.293 1.061 0 1.399-1.399 2.351-3.18 2.737-5.12.386-1.94.188-3.95-.57-5.778-.756-1.827-2.038-3.389-3.682-4.488C15.91 2.586 13.978 2 12 2c-1.978 0-3.911.586-5.556 1.685-1.644 1.1-2.926 2.66-3.683 4.488-.757 1.827-.955 3.838-.569 5.778.386 1.94 1.338 3.721 2.737 5.12.293.293.768.293 1.06 0 .293-.293.293-.768 0-1.06-1.188-1.19-1.998-2.704-2.326-4.353-.328-1.649-.16-3.358.484-4.91.643-1.554 1.733-2.881 3.13-3.815ZM12 7.5c-.89 0-1.76.264-2.5.758-.74.495-1.317 1.198-1.657 2.02-.341.822-.43 1.727-.257 2.6.174.873.603 1.675 1.232 2.304.293.293.293.768 0 1.06-.293.293-.768.293-1.06 0-.84-.839-1.411-1.908-1.643-3.072-.231-1.163-.112-2.37.342-3.466S7.68 7.67 8.667 7.01C9.653 6.351 10.813 6 12 6c1.187 0 2.347.352 3.333 1.011.987.66 1.756 1.597 2.21 2.693.454 1.096.573 2.303.342 3.466-.232 1.164-.803 2.233-1.642 3.073-.293.293-.768.293-1.061 0-.293-.293-.293-.768 0-1.061.63-.63 1.058-1.431 1.231-2.304.174-.873.085-1.778-.256-2.6-.34-.822-.917-1.525-1.657-2.02-.74-.494-1.61-.758-2.5-.758Zm.875 6.299C13.541 13.474 14 12.79 14 12c0-1.105-.895-2-2-2s-2 .895-2 2c0 .79.459 1.474 1.125 1.799V21c0 .483.392.875.875.875s.875-.392.875-.875v-7.201Z"] { d: path("M6 12c0-3.31 2.69-6 6-6s6 2.69 6 6c0 1.66-.67 3.16-1.77 4.25l-.71-.71C16.44 14.63 17 13.38 17 12c0-2.76-2.24-5-5-5s-5 2.24-5 5c0 1.38.56 2.63 1.47 3.54l-.71.71C6.67 15.16 6 13.66 6 12zm8 0c0-1.1-.9-2-2-2s-2 .9-2 2c0 .74.4 1.38 1 1.72V22h2v-8.28c.6-.34 1-.98 1-1.72zm-9.06 7.08.71-.71C4.01 16.74 3 14.49 3 12c0-4.96 4.04-9 9-9s9 4.04 9 9c0 2.49-1.01 4.74-2.65 6.37l.71.71C20.88 17.27 22 14.77 22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 2.77 1.12 5.27 2.94 7.08z") }
[d*="M7.278 4.933C8.675 3.999 10.318 3.5 12 3.5c1.681 0 3.325.499 4.722 1.433 1.398.934 2.488 2.261 3.131 3.814.643 1.553.812 3.262.484 4.911-.328 1.65-1.138 3.164-2.327 4.352-.39.39-.39 1.024 0 1.415.39.39 1.024.39 1.415 0 1.468-1.469 2.468-3.34 2.873-5.377.405-2.036.198-4.148-.597-6.066-.795-1.919-2.14-3.559-3.867-4.712C16.107 2.116 14.077 1.5 12 1.5c-2.077 0-4.107.616-5.833 1.77C4.44 4.423 3.094 6.063 2.299 7.982c-.794 1.918-1.002 4.03-.597 6.066.405 2.037 1.405 3.908 2.873 5.377.39.39 1.024.39 1.415 0 .39-.39.39-1.024 0-1.415-1.19-1.188-1.999-2.703-2.327-4.352-.328-1.649-.16-3.358.484-4.91.643-1.554 1.733-2.881 3.13-3.815ZM12 7.5c-.89 0-1.76.264-2.5.758-.74.495-1.317 1.198-1.657 2.02-.341.822-.43 1.727-.257 2.6.174.873.603 1.675 1.232 2.304.39.39.39 1.024 0 1.414-.39.39-1.024.39-1.414 0-.91-.909-1.528-2.067-1.78-3.328-.25-1.26-.121-2.568.37-3.755C6.488 8.325 7.32 7.31 8.39 6.595 9.458 5.881 10.714 5.5 12 5.5s2.542.381 3.611 1.095c1.07.715 1.902 1.73 2.394 2.918.492 1.187.62 2.494.37 3.755-.25 1.261-.87 2.42-1.779 3.328-.39.39-1.024.39-1.414 0-.39-.39-.39-1.024 0-1.414.63-.63 1.058-1.431 1.231-2.304.174-.873.085-1.778-.256-2.6-.34-.822-.917-1.525-1.657-2.02-.74-.494-1.61-.758-2.5-.758Zm1 6.792c.883-.386 1.5-1.267 1.5-2.292 0-1.38-1.12-2.5-2.5-2.5S9.5 10.62 9.5 12c0 1.025.617 1.906 1.5 2.292V21c0 .552.448 1 1 1s1-.448 1-1v-6.708Z"] { d: path("M13 13.72V22h-2v-8.28c-.6-.35-1-.98-1-1.72 0-1.1.9-2 2-2s2 .9 2 2c0 .74-.4 1.38-1 1.72zm-5.23 2.53 1.42-1.42C8.45 14.11 8 13.11 8 12c0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.11-.45 2.11-1.18 2.83l1.42 1.42C17.33 15.16 18 13.66 18 12c0-3.31-2.69-6-6-6s-6 2.69-6 6c0 1.66.67 3.16 1.77 4.25zm-2.83 2.83 1.42-1.42C4.9 16.21 4 14.21 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 2.21-.9 4.21-2.35 5.66l1.42 1.42C20.88 17.27 22 14.77 22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 2.77 1.12 5.27 2.94 7.08z") }
[d*="m14.302 6.457-.668-.278L12.87 3.5h-1.737l-.766 2.68-.668.277c-.482.2-.934.463-1.344.778l-.575.44-2.706-.677-.868 1.504 1.938 2.003-.093.716c-.033.255-.05.514-.05.779 0 .264.017.524.05.779l.093.716-1.938 2.003.868 1.504 2.706-.677.575.44c.41.315.862.577 1.344.778l.668.278.766 2.679h1.737l.765-2.68.668-.277c.483-.2.934-.463 1.345-.778l.574-.44 2.706.677.869-1.504-1.938-2.003.092-.716c.033-.255.05-.514.05-.779 0-.264-.017-.524-.05-.779l-.092-.716 1.938-2.003-.869-1.504-2.706.677-.574-.44c-.41-.315-.862-.577-1.345-.778Zm4.436.214Zm-3.86-1.6-.67-2.346c-.123-.429-.516-.725-.962-.725h-2.492c-.446 0-.838.296-.961.725l-.67 2.347c-.605.251-1.17.58-1.682.972l-2.37-.593c-.433-.108-.885.084-1.108.47L2.717 8.08c-.223.386-.163.874.147 1.195l1.698 1.755c-.04.318-.062.642-.062.971 0 .329.021.653.062.97l-1.698 1.756c-.31.32-.37.809-.147 1.195l1.246 2.158c.223.386.675.578 1.109.47l2.369-.593c.512.393 1.077.72 1.681.972l.67 2.347c.124.429.516.725.962.725h2.492c.446 0 .839-.296.961-.725l.67-2.347c.605-.251 1.17-.58 1.682-.972l2.37.593c.433.108.885-.084 1.109-.47l1.245-2.158c.223-.386.163-.874-.147-1.195l-1.698-1.755c.04-.318.062-.642.062-.971 0-.329-.021-.653-.062-.97l1.698-1.756c.31-.32.37-.809.147-1.195L20.038 5.92c-.224-.386-.676-.578-1.11-.47l-2.369.593c-.512-.393-1.077-.72-1.681-.972ZM15.5 12c0 1.933-1.567 3.5-3.5 3.5S8.5 13.933 8.5 12s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5ZM14 12c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2Z"] { d: path("M12 9.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5m0-1c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zM13.22 3l.55 2.2.13.51.5.18c.61.23 1.19.56 1.72.98l.4.32.5-.14 2.17-.62 1.22 2.11-1.63 1.59-.37.36.08.51c.05.32.08.64.08.98s-.03.66-.08.98l-.08.51.37.36 1.63 1.59-1.22 2.11-2.17-.62-.5-.14-.4.32c-.53.43-1.11.76-1.72.98l-.5.18-.13.51-.55 2.24h-2.44l-.55-2.2-.13-.51-.5-.18c-.6-.23-1.18-.56-1.72-.99l-.4-.32-.5.14-2.17.62-1.21-2.12 1.63-1.59.37-.36-.08-.51c-.05-.32-.08-.65-.08-.98s.03-.66.08-.98l.08-.51-.37-.36L3.6 8.56l1.22-2.11 2.17.62.5.14.4-.32c.53-.44 1.11-.77 1.72-.99l.5-.18.13-.51.54-2.21h2.44M14 2h-4l-.74 2.96c-.73.27-1.4.66-2 1.14l-2.92-.83-2 3.46 2.19 2.13c-.06.37-.09.75-.09 1.14s.03.77.09 1.14l-2.19 2.13 2 3.46 2.92-.83c.6.48 1.27.87 2 1.14L10 22h4l.74-2.96c.73-.27 1.4-.66 2-1.14l2.92.83 2-3.46-2.19-2.13c.06-.37.09-.75.09-1.14s-.03-.77-.09-1.14l2.19-2.13-2-3.46-2.92.83c-.6-.48-1.27-.87-2-1.14L14 2z") }
[d*="M9.792 2.725A1 1 0 0110.753 2h2.492a1 1 0 01.961.725l.67 2.347c.605.251 1.17.58 1.682.972l2.37-.593a1 1 0 011.108.47l1.246 2.158a1 1 0 01-.147 1.195l-1.698 1.755a7.584 7.584 0 010 1.942l1.698 1.755a1 1 0 01.147 1.195l-1.245 2.158a1 1 0 01-1.11.47l-2.369-.593a7.494 7.494 0 01-1.681.972l-.67 2.347a1 1 0 01-.962.725h-2.492a1 1 0 01-.961-.725l-.67-2.347a7.494 7.494 0 01-1.682-.972l-2.37.593a1 1 0 01-1.108-.47L2.716 15.92a1 1 0 01.147-1.195l1.698-1.755a7.574 7.574 0 010-1.942L2.863 9.274a1 1 0 01-.147-1.195L3.962 5.92a1 1 0 011.109-.47l2.369.593a7.492 7.492 0 011.681-.972l.67-2.347ZM11.999 15a3 3 0 100-6 3 3 0 000 6Z"] { d: path("M19.56 12c0-.39-.03-.77-.09-1.14l2.19-2.13-2-3.46-2.92.83c-.6-.48-1.27-.87-2-1.14L14 2h-4l-.74 2.96c-.73.27-1.4.66-2 1.14l-2.92-.83-2 3.46 2.19 2.13c-.06.37-.09.75-.09 1.14s.03.77.09 1.14l-2.19 2.13 2 3.46 2.92-.83c.6.48 1.27.87 2 1.14L10 22h4l.74-2.96c.73-.27 1.4-.66 2-1.14l2.92.83 2-3.46-2.19-2.13c.06-.37.09-.75.09-1.14zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z") }
[d*="M4.75 3H4v18.25c0 .414.336.75.75.75s.75-.336.75-.75V14H11l.585 1.17c.254.509.774.83 1.342.83H18.5c.828 0 1.5-.672 1.5-1.5v-8c0-.828-.672-1.5-1.5-1.5H13l-.585-1.17C12.16 3.32 11.64 3 11.073 3H4.75Zm.75 9.5h6.427l.415.83.585 1.17H18.5v-8h-6.427l-.415-.83-.585-1.17H5.5v8Z"] { d: path("m13.18 4 .24 1.2.16.8H19v7h-5.18l-.24-1.2-.16-.8H6V4h7.18M14 3H5v18h1v-9h6.6l.4 2h7V5h-5.6L14 3z") }
[d*="M5 3h6.073a1.5 1.5 0 011.342.83L13 5h5.5A1.5 1.5 0 0120 6.5v8a1.5 1.5 0 01-1.5 1.5h-5.573a1.5 1.5 0 01-1.342-.83L11 14H6v7a1 1 0 11-2 0V3h1Z"] { d: path("M14 3H5v18h1v-9h6.6l.4 2h7V5h-5.6L14 3z") }
[d*="M3.5 12c0 4.694 3.806 8.5 8.5 8.5s8.5-3.806 8.5-8.5-3.806-8.5-8.5-8.5S3.5 7.306 3.5 12ZM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm2.245 7.505v-.003l-.003-.045c-.004-.044-.012-.114-.03-.2-.034-.174-.103-.4-.234-.619-.234-.39-.734-.883-1.978-.883s-1.744.494-1.978.883c-.131.22-.2.445-.235.62-.017.085-.025.155-.029.2l-.003.044v.004c-.004.415-.34.749-.755.749-.417 0-.755-.338-.755-.755H9h-.755v-.022l.001-.036.008-.114c.008-.092.023-.218.053-.367.058-.294.177-.694.42-1.1.517-.86 1.517-1.616 3.273-1.616 1.756 0 2.756.756 3.272 1.617.244.405.363.805.421 1.1.03.148.046.274.053.366l.008.114v.036l.001.013v.008L15 9.5h.755c0 .799-.249 1.397-.676 1.847-.374.395-.853.634-1.202.808l-.04.02c-.398.2-.646.333-.82.516-.136.143-.262.358-.262.809 0 .417-.338.755-.755.755s-.755-.338-.755-.755c0-.799.249-1.397.676-1.847.374-.395.853-.634 1.202-.808l.04-.02c.398-.2.646-.333.82-.516.135-.143.261-.356.262-.804ZM12 18.25c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25Z"] { d: path("M15.36 9.96c0 1.09-.67 1.67-1.31 2.24-.53.47-1.03.9-1.16 1.6l-.04.2H11.1l.03-.28c.14-1.17.8-1.76 1.47-2.27.52-.4 1.01-.77 1.01-1.49 0-.51-.23-.97-.63-1.29-.4-.31-.92-.42-1.42-.29-.59.15-1.05.67-1.19 1.34l-.05.28H8.57l.06-.42c.2-1.4 1.15-2.53 2.42-2.87 1.05-.29 2.14-.08 2.98.57.85.64 1.33 1.62 1.33 2.68zM12 18c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm0-15c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9m0-1c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z") }
[d*="M6.379 17.5H19c.276 0 .5-.224.5-.5V5c0-.276-.224-.5-.5-.5H5c-.276 0-.5.224-.5.5v14.379l1.44-1.44.439-.439Zm-1.879 4-.033.033-.26.26-.353.353c-.315.315-.854.092-.854-.353V5c0-1.105.895-2 2-2h14c1.105 0 2 .895 2 2v12c0 1.105-.895 2-2 2H7l-2.5 2.5ZM12 6c.552 0 1 .448 1 1v4c0 .552-.448 1-1 1s-1-.448-1-1V7c0-.552.448-1 1-1Zm0 9.75c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25Z"] { d: path("M13 14h-2v-2h2v2zm0-9h-2v6h2V5zm6-2H5v16.59l3.29-3.29.3-.3H19V3m1-1v15H9l-5 5V2h16z") }
[d*="m13.497 4.898.053.8.694.4C15.596 6.878 16.5 8.334 16.5 10v2.892c0 .997.27 1.975.784 2.83L18.35 17.5H5.649l1.067-1.778c.513-.855.784-1.833.784-2.83V10c0-1.666.904-3.122 2.256-3.902l.694-.4.053-.8c.052-.78.703-1.398 1.497-1.398.794 0 1.445.618 1.497 1.398ZM6 10c0-2.224 1.21-4.165 3.007-5.201C9.11 3.236 10.41 2 12 2c1.59 0 2.89 1.236 2.993 2.799C16.79 5.835 18 7.776 18 10v2.892c0 .725.197 1.436.57 2.058l1.521 2.535c.4.667-.08 1.515-.857 1.515H15c0 .796-.316 1.559-.879 2.121-.562.563-1.325.879-2.121.879s-1.559-.316-2.121-.879C9.316 20.56 9 19.796 9 19H4.766c-.777 0-1.257-.848-.857-1.515L5.43 14.95c.373-.622.57-1.333.57-2.058V10Zm4.5 9c0 .398.158.78.44 1.06.28.282.662.44 1.06.44s.78-.158 1.06-.44c.282-.28.44-.662.44-1.06h-3Z"] { d: path("M10 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm10-2.65V19H4v-1.65l2-1.88v-5.15C6 7.4 7.56 5.1 10 4.34v-.38c0-1.42 1.49-2.5 2.99-1.76.65.32 1.01 1.03 1.01 1.76v.39c2.44.75 4 3.06 4 5.98v5.15l2 1.87zm-1 .42-2-1.88v-5.47c0-2.47-1.19-4.36-3.13-5.1-1.26-.53-2.64-.5-3.84.03C8.15 6.11 7 7.99 7 10.42v5.47l-2 1.88V18h14v-.23z") }
[d*="M18.001 10a6.003 6.003 0 00-4.025-5.667 2 2 0 10-3.945-.002A6.003 6.003 0 006.001 10v3.988a.044.044 0 01-.006.022L3.91 17.485A1 1 0 004.767 19h14.468a1 1 0 00.857-1.515l-2.085-3.475a.044.044 0 01-.006-.022V10Zm-6 12a3.001 3.001 0 002.83-2H9.17A3.001 3.001 0 0012 22Z"] { d: path("M10 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm10-2.65V19H4v-1.65l2-1.88v-5.15C6 7.4 7.56 5.1 10 4.34v-.38c0-1.42 1.49-2.5 2.99-1.76.65.32 1.01 1.03 1.01 1.76v.39c2.44.75 4 3.06 4 5.98v5.15l2 1.87z") }
[d*="m13.06 9 5.47 5.47c.293.293.293.767 0 1.06-.293.293-.767.293-1.06 0L12 10.06l-5.47 5.47c-.293.293-.767.293-1.06 0-.293-.293-.293-.767 0-1.06L10.94 9l.53-.53.53-.53.53.53.53.53Z"] { d: path("M18.4 14.6 12 8.3l-6.4 6.3.8.8L12 9.7l5.6 5.7z") }
[d*="M5.47 8.47c.293-.293.767-.293 1.06 0L12 13.94l5.47-5.47c.293-.293.767-.293 1.06 0 .293.293.293.767 0 1.06l-6 6-.53.53-.53-.53-6-6c-.293-.293-.293-.767 0-1.06Z"] { d: path("m18 9.28-6.35 6.35-6.37-6.35.72-.71 5.64 5.65 5.65-5.65z") }
[d*="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z"] { d: path("M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z") }
[d*="M19 10L11.5 5.75V14.25L19 10Z"] { d: path("M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z") }
[d*="M37.1384 18.8999V13.4399L40.6084 2.09994H38.0184L36.6984 7.24994C36.3984 8.42994 36.1284 9.65994 35.9284 10.7999H35.7684C35.6584 9.79994 35.3384 8.48994 35.0184 7.22994L33.7384 2.09994H31.1484L34.5684 13.4399V18.8999H37.1384Z"] { d: path("M34.6024 13.0036L31.3945 1.41846H34.1932L35.3174 6.6701C35.6043 7.96361 35.8136 9.06662 35.95 9.97913H36.0323C36.1264 9.32532 36.3381 8.22937 36.665 6.68892L37.8291 1.41846H40.6278L37.3799 13.0036V18.561H34.6001V13.0036H34.6024Z") }
[d*="M44.1003 6.29994C41.0703 6.29994 40.0303 8.04994 40.0303 11.8199V13.6099C40.0303 16.9899 40.6803 19.1099 44.0403 19.1099C47.3503 19.1099 48.0603 17.0899 48.0603 13.6099V11.8199C48.0603 8.44994 47.3803 6.29994 44.1003 6.29994ZM45.3903 14.7199C45.3903 16.3599 45.1003 17.3899 44.0503 17.3899C43.0203 17.3899 42.7303 16.3499 42.7303 14.7199V10.6799C42.7303 9.27994 42.9303 8.02994 44.0503 8.02994C45.2303 8.02994 45.3903 9.34994 45.3903 10.6799V14.7199Z"] { d: path("M41.4697 18.1937C40.9053 17.8127 40.5031 17.22 40.2632 16.4157C40.0257 15.6114 39.9058 14.5437 39.9058 13.2078V11.3898C39.9058 10.0422 40.0422 8.95805 40.315 8.14196C40.5878 7.32588 41.0135 6.72851 41.592 6.35457C42.1706 5.98063 42.9302 5.79248 43.871 5.79248C44.7976 5.79248 45.5384 5.98298 46.0981 6.36398C46.6555 6.74497 47.0647 7.34234 47.3234 8.15137C47.5821 8.96275 47.7115 10.0422 47.7115 11.3898V13.2078C47.7115 14.5437 47.5845 15.6161 47.3329 16.4251C47.0812 17.2365 46.672 17.8292 46.1075 18.2031C45.5431 18.5771 44.7764 18.7652 43.8098 18.7652C42.8126 18.7675 42.0342 18.5747 41.4697 18.1937ZM44.6353 16.2323C44.7905 15.8231 44.8705 15.1575 44.8705 14.2309V10.3292C44.8705 9.43077 44.7929 8.77225 44.6353 8.35833C44.4777 7.94206 44.2026 7.7351 43.8074 7.7351C43.4265 7.7351 43.156 7.94206 43.0008 8.35833C42.8432 8.77461 42.7656 9.43077 42.7656 10.3292V14.2309C42.7656 15.1575 42.8408 15.8254 42.9914 16.2323C43.1419 16.6415 43.4123 16.8461 43.8074 16.8461C44.2026 16.8461 44.4777 16.6415 44.6353 16.2323Z") }
[d*="M52.2713 19.0899C53.7313 19.0899 54.6413 18.4799 55.3913 17.3799H55.5013L55.6113 18.8999H57.6012V6.53994H54.9613V16.4699C54.6812 16.9599 54.0312 17.3199 53.4212 17.3199C52.6512 17.3199 52.4113 16.7099 52.4113 15.6899V6.53994H49.7812V15.8099C49.7812 17.8199 50.3613 19.0899 52.2713 19.0899Z"] { d: path("M56.8154 18.5634H54.6094L54.3648 17.03H54.3037C53.7039 18.1871 52.8055 18.7656 51.6061 18.7656C50.7759 18.7656 50.1621 18.4928 49.767 17.9496C49.3719 17.4039 49.1743 16.5526 49.1743 15.3955V6.03751H51.9942V15.2308C51.9942 15.7906 52.0553 16.188 52.1776 16.4256C52.2999 16.6631 52.5045 16.783 52.7914 16.783C53.036 16.783 53.2712 16.7078 53.497 16.5573C53.7228 16.4067 53.8874 16.2162 53.9979 15.9858V6.03516H56.8154V18.5634Z") }
[d*="M62.8261 18.8999V4.14994H65.8661V2.09994H57.1761V4.14994H60.2161V18.8999H62.8261Z"] { d: path("M64.4755 3.68758H61.6768V18.5629H58.9181V3.68758H56.1194V1.42041H64.4755V3.68758Z") }
[d*="M67.8728 19.0899C69.3328 19.0899 70.2428 18.4799 70.9928 17.3799H71.1028L71.2128 18.8999H73.2028V6.53994H70.5628V16.4699C70.2828 16.9599 69.6328 17.3199 69.0228 17.3199C68.2528 17.3199 68.0128 16.7099 68.0128 15.6899V6.53994H65.3828V15.8099C65.3828 17.8199 65.9628 19.0899 67.8728 19.0899Z"] { d: path("M71.2768 18.5634H69.0708L68.8262 17.03H68.7651C68.1654 18.1871 67.267 18.7656 66.0675 18.7656C65.2373 18.7656 64.6235 18.4928 64.2284 17.9496C63.8333 17.4039 63.6357 16.5526 63.6357 15.3955V6.03751H66.4556V15.2308C66.4556 15.7906 66.5167 16.188 66.639 16.4256C66.7613 16.6631 66.9659 16.783 67.2529 16.783C67.4974 16.783 67.7326 16.7078 67.9584 16.5573C68.1842 16.4067 68.3488 16.2162 68.4593 15.9858V6.03516H71.2768V18.5634Z") }
[d*="M80.6744 6.26994C79.3944 6.26994 78.4744 6.82994 77.8644 7.73994H77.7344C77.8144 6.53994 77.8744 5.51994 77.8744 4.70994V1.43994H75.3244L75.3144 12.1799L75.3244 18.8999H77.5444L77.7344 17.6999H77.8044C78.3944 18.5099 79.3044 19.0199 80.5144 19.0199C82.5244 19.0199 83.3844 17.2899 83.3844 13.6099V11.6999C83.3844 8.25994 82.9944 6.26994 80.6744 6.26994ZM80.7644 13.6099C80.7644 15.9099 80.4244 17.2799 79.3544 17.2799C78.8544 17.2799 78.1644 17.0399 77.8544 16.5899V9.23994C78.1244 8.53994 78.7244 8.02994 79.3944 8.02994C80.4744 8.02994 80.7644 9.33994 80.7644 11.7299V13.6099Z"] { d: path("M80.609 8.0387C80.4373 7.24849 80.1621 6.67699 79.7812 6.32186C79.4002 5.96674 78.8757 5.79035 78.2078 5.79035C77.6904 5.79035 77.2059 5.93616 76.7567 6.23014C76.3075 6.52412 75.9594 6.90747 75.7148 7.38489H75.6937V0.785645H72.9773V18.5608H75.3056L75.5925 17.3755H75.6537C75.8724 17.7988 76.1993 18.1304 76.6344 18.3774C77.0695 18.622 77.554 18.7443 78.0855 18.7443C79.038 18.7443 79.7412 18.3045 80.1904 17.4272C80.6396 16.5476 80.8653 15.1765 80.8653 13.3092V11.3266C80.8653 9.92722 80.7783 8.82892 80.609 8.0387ZM78.0243 13.1492C78.0243 14.0617 77.9867 14.7767 77.9114 15.2941C77.8362 15.8115 77.7115 16.1808 77.5328 16.3971C77.3564 16.6158 77.1165 16.724 76.8178 16.724C76.585 16.724 76.371 16.6699 76.1734 16.5594C75.9759 16.4512 75.816 16.2866 75.6937 16.0702V8.96062C75.7877 8.6196 75.9524 8.34209 76.1852 8.12337C76.4157 7.90465 76.6697 7.79646 76.9401 7.79646C77.2271 7.79646 77.4481 7.90935 77.6034 8.13278C77.7609 8.35855 77.8691 8.73485 77.9303 9.26636C77.9914 9.79787 78.022 10.5528 78.022 11.5335V13.1492H78.0243Z") }
[d*="M92.6517 11.4999C92.6517 8.51994 92.3517 6.30994 88.9217 6.30994C85.6917 6.30994 84.9717 8.45994 84.9717 11.6199V13.7899C84.9717 16.8699 85.6317 19.1099 88.8417 19.1099C91.3817 19.1099 92.6917 17.8399 92.5417 15.3799L90.2917 15.2599C90.2617 16.7799 89.9117 17.3999 88.9017 17.3999C87.6317 17.3999 87.5717 16.1899 87.5717 14.3899V13.5499H92.6517V11.4999ZM88.8617 7.96994C90.0817 7.96994 90.1717 9.11994 90.1717 11.0699V12.0799H87.5717V11.0699C87.5717 9.13994 87.6517 7.96994 88.8617 7.96994Z"] { d: path("M84.8657 13.8712C84.8657 14.6755 84.8892 15.2776 84.9363 15.6798C84.9833 16.0819 85.0821 16.3736 85.2326 16.5594C85.3831 16.7428 85.6136 16.8345 85.9264 16.8345C86.3474 16.8345 86.639 16.6699 86.7942 16.343C86.9518 16.0161 87.0365 15.4705 87.0506 14.7085L89.4824 14.8519C89.4965 14.9601 89.5035 15.1106 89.5035 15.3011C89.5035 16.4582 89.186 17.3237 88.5534 17.8952C87.9208 18.4667 87.0247 18.7536 85.8676 18.7536C84.4777 18.7536 83.504 18.3185 82.9466 17.446C82.3869 16.5735 82.1094 15.2259 82.1094 13.4008V11.2136C82.1094 9.33452 82.3987 7.96105 82.9772 7.09558C83.5558 6.2301 84.5459 5.79736 85.9499 5.79736C86.9165 5.79736 87.6597 5.97375 88.1771 6.32888C88.6945 6.684 89.059 7.23433 89.2707 7.98457C89.4824 8.7348 89.5882 9.76961 89.5882 11.0913V13.2362H84.8657V13.8712ZM85.2232 7.96811C85.0797 8.14449 84.9857 8.43377 84.9363 8.83593C84.8892 9.2381 84.8657 9.84722 84.8657 10.6657V11.5641H86.9283V10.6657C86.9283 9.86133 86.9001 9.25221 86.846 8.83593C86.7919 8.41966 86.6931 8.12803 86.5496 7.95635C86.4062 7.78702 86.1851 7.7 85.8864 7.7C85.5854 7.70235 85.3643 7.79172 85.2232 7.96811Z") }
ytd-feed-filter-chip-bar-renderer[frosted-glass] ytd-button-renderer.ytd-feed-filter-chip-bar-renderer { background-color: transparent !important }
ytd-masthead[frosted-glass=with-chipbar] #background.ytd-masthead, ytd-masthead[frosted-glass=without-chipbar] #background.ytd-masthead { backdrop-filter: none !important }
/* Revert classic subscriptions page and disable gigantic search result thumbnails */
[page-subtype="subscriptions"] #avatar-link.ytd-rich-grid-media, [page-subtype="subscriptions"] #avatar-container.ytd-rich-grid-media { display: none !important; margin-right: 0 !important }
[page-subtype="subscriptions"] #video-title.ytd-rich-grid-media { font-size: 1.4rem !important; line-height: 1.8rem !important }
[page-subtype="subscriptions"] ytd-video-meta-block[rich-meta] #channel-name.ytd-video-meta-block, [page-subtype="subscriptions"] ytd-video-meta-block[rich-meta] #metadata-line.ytd-video-meta-block { font-size: 1.2rem !important }
[page-subtype="subscriptions"] ytd-rich-shelf-renderer { display: none !important }
[page-subtype="subscriptions"] ytd-rich-item-renderer { margin-left: 0 !important; margin-right: 0 !important; margin-bottom: 24px; width: calc(100% / var(--ytd-rich-grid-items-per-row) - 4px - 0.01px) }
[page-subtype="subscriptions"] h3.ytd-rich-grid-video-renderer { margin: 8px 0 8px !important }
[page-subtype="subscriptions"] ytd-primetime-promo-renderer.ytd-rich-section-renderer, [page-subtype="subscriptions"] ytd-inline-survey-renderer.ytd-rich-section-renderer { border-top: 1px solid var(--yt-spec-10-percent-layer); border-bottom: 1px solid var(--yt-spec-10-percent-layer) }
[page-subtype="subscriptions"] ytd-thumbnail[size=large] a.ytd-thumbnail, [page-subtype="subscriptions"] ytd-thumbnail[size=large]:before { border-radius: 0 !important }
[page-subtype="subscriptions"] div.ghost-grid.style-scope.ytd-ghost-grid-renderer { display: none !important }
[page-subtype="subscriptions"] html:not(.style-scope) { --ytd-rich-grid-item-max-width: 210px !important; --ytd-rich-grid-item-margin: 4px !important }
[page-subtype="subscriptions"] #contents.ytd-rich-grid-renderer, [page-subtype="subscriptions"] #grid-header.ytd-rich-grid-renderer { width: calc(100% + 4px + 0.01px) !important; max-width: calc( var(--ytd-rich-grid-items-per-row) * (var(--ytd-rich-grid-item-max-width) + var(--ytd-rich-grid-item-margin))) !important }
@media (max-width: 456px) {ytd-rich-grid-renderer {--ytd-rich-grid-items-per-row: 1 !important;--ytd-rich-grid-posts-per-row: 1 !important;}}
[page-subtype="subscriptions"] ytd-rich-grid-renderer, [page-subtype="subscriptions"] ytd-rich-grid-renderer.style-scope.ytd-two-column-browse-results-renderer { --ytd-rich-grid-items-per-row: var(--grid-items-videos--per-row) !important; --ytd-rich-grid-posts-per-row: var(--grid-posts-videos-per-row) !important }
@media (max-width: 456px) {html:not(.style-scope) {--grid-items-videos--per-row: 1;--grid-posts-videos-per-row: 1;}}
@media (min-width: 457px) {html:not(.style-scope) {--load-videos-items-per-row: 903px;--grid-items-videos--per-row: 2;--grid-posts-videos-per-row: 2;}}@media (min-width: 647px) {html:not(.style-scope) {--load-videos-items-per-row: 1300px;--grid-items-videos--per-row: 3;--grid-posts-videos-per-row: 3;}}
@media (min-width: 957px) {html:not(.style-scope) {--load-videos-items-per-row: 1680px;--grid-items-videos--per-row: 4;--grid-posts-videos-per-row: 3;}}
@media (min-width: 1171px) {html:not(.style-scope) {--load-videos-items-per-row: 2013px;--grid-items-videos--per-row: 5;--grid-posts-videos-per-row: 3;}}
@media (min-width: 1600px) {html:not(.style-scope) {--load-videos-items-per-row: 2348px;--grid-items-videos--per-row: 6;--grid-posts-videos-per-row: 3;}}
[page-subtype="subscriptions"] ytd-rich-grid-renderer #contents ytd-rich-grid-row, [page-subtype="subscriptions"] ytd-rich-grid-renderer #contents ytd-rich-grid-row #contents { display: contents !important }
[page-subtype="subscriptions"] #contents.ytd-rich-grid-renderer, [page-subtype="subscriptions"] #grid-header.ytd-rich-grid-renderer { --ytd-rich-grid-item-max-width: 210px !important }
ytd-two-column-search-results-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] #primary.ytd-two-column-search-results-renderer, ytd-search[has-search-header][has-bigger-thumbs] #header.ytd-search { max-width: 1096px !important }
ytd-channel-renderer[use-bigger-thumbs][bigger-thumb-style=BIG] #avatar-section.ytd-channel-renderer, ytd-channel-renderer[use-bigger-thumbs] #avatar-section.ytd-channel-renderer, ytd-video-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-thumbnail.ytd-video-renderer, ytd-video-renderer[use-search-ui] ytd-thumbnail.ytd-video-renderer, ytd-playlist-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-playlist-thumbnail.ytd-playlist-renderer, ytd-playlist-renderer[use-bigger-thumbs] ytd-playlist-thumbnail.ytd-playlist-renderer, ytd-radio-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-thumbnail.ytd-radio-renderer, ytd-radio-renderer[use-bigger-thumbs] ytd-thumbnail.ytd-radio-renderer, ytd-radio-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-thumbnail.ytd-radio-renderer, ytd-radio-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-playlist-thumbnail.ytd-radio-renderer, ytd-movie-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] .thumbnail-container.ytd-movie-renderer, ytd-movie-renderer[use-bigger-thumbs] .thumbnail-container.ytd-movie-renderer, ytd-promoted-video-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] ytd-thumbnail.ytd-promoted-video-renderer, ytd-promoted-sparkles-web-renderer[web-search-layout][use-bigger-thumbs][bigger-thumbs-style=BIG] #thumbnail-container.ytd-promoted-sparkles-web-renderer, ytd-text-image-no-button-layout-renderer[use-bigger-thumbs][bigger-thumbs-style=BIG] #text-image-container.ytd-text-image-no-button-layout-renderer { max-width: 360px !important }
.yt-lockup-view-model-wiz--horizontal .yt-lockup-view-model-wiz__content-image { max-width: 360px !important }
/* Fix disappearing bar in masthead */
#background.ytd-masthead { opacity: 1 !important }`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();


// Re-add 'Explore' tab in sidebar (it also replaces the 'Shorts' tab)
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

    function restoreTrending() {

        var trendingData = {
            "navigationEndpoint": {
                "clickTrackingParams": "CBwQtSwYASITCNqYh-qO_fACFcoRrQYdP44D9Q==",
                "commandMetadata": {
                    "webCommandMetadata": {
                        "url": "/feed/explore",
                        "webPageType": "WEB_PAGE_TYPE_BROWSE",
                        "rootVe": 6827,
                        "apiUrl": "/youtubei/v1/browse"
                    }
                },
                "browseEndpoint": {
                    "browseId": "FEtrending"
                }
            },
            "icon": {
                "iconType": "EXPLORE"
            },
            "trackingParams": "CBwQtSwYASITCNqYh-qO_fACFcoRrQYdP44D9Q==",
            "formattedTitle": {
                "simpleText": "Explore"
            },
            "accessibility": {
                "accessibilityData": {
                    "label": "Explore"
                }
            },
            "isPrimary": true
        };

        var guidetemplate = `<ytd-guide-entry-renderer class="style-scope ytd-guide-section-renderer" is-primary="" line-end-style="none"><!--css-build:shady--><a id="endpoint" class="yt-simple-endpoint style-scope ytd-guide-entry-renderer" tabindex="-1" role="tablist"><tp-yt-paper-item role="tab" class="style-scope ytd-guide-entry-renderer" tabindex="0" aria-disabled="false"><!--css-build:shady--><yt-icon class="guide-icon style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><yt-img-shadow height="24" width="24" class="style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-img-shadow><yt-formatted-string class="title style-scope ytd-guide-entry-renderer"><!--css-build:shady--></yt-formatted-string><span class="guide-entry-count style-scope ytd-guide-entry-renderer"></span><yt-icon class="guide-entry-badge style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><div id="newness-dot" class="style-scope ytd-guide-entry-renderer"></div></tp-yt-paper-item></a><yt-interaction class="style-scope ytd-guide-entry-renderer"><!--css-build:shady--><div class="stroke style-scope yt-interaction"></div><div class="fill style-scope yt-interaction"></div></yt-interaction></ytd-guide-entry-renderer>`;
        document.querySelector(`#items > ytd-guide-entry-renderer:nth-child(2)`).data = trendingData;

        var miniguidetemplate = `<ytd-mini-guide-entry-renderer class="style-scope ytd-mini-guide-section-renderer" is-primary="" line-end-style="none"><!--css-build:shady--><a id="endpoint" class="yt-simple-endpoint style-scope ytd-guide-entry-renderer" tabindex="-1" role="tablist"><tp-yt-paper-item role="tab" class="style-scope ytd-guide-entry-renderer" tabindex="0" aria-disabled="false"><!--css-build:shady--><yt-icon class="guide-icon style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><yt-img-shadow height="24" width="24" class="style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-img-shadow><yt-formatted-string class="title style-scope ytd-guide-entry-renderer"><!--css-build:shady--></yt-formatted-string><span class="guide-entry-count style-scope ytd-guide-entry-renderer"></span><yt-icon class="guide-entry-badge style-scope ytd-guide-entry-renderer" disable-upgrade=""></yt-icon><div id="newness-dot" class="style-scope ytd-guide-entry-renderer"></div></tp-yt-paper-item></a><yt-interaction class="style-scope ytd-guide-entry-renderer"><!--css-build:shady--><div class="stroke style-scope yt-interaction"></div><div class="fill style-scope yt-interaction"></div></yt-interaction></ytd-guide-entry-renderer>`;
        document.querySelector(`#items > ytd-mini-guide-entry-renderer:nth-child(2)`).data = trendingData;

    }


waitForElm("#items.ytd-guide-section-renderer").then((elm) => {
    restoreTrending();
});


// Restore old comment replies UI and more additions added (ft. YT Video Resize Fix (special thanks to CY Fung))
var observingComments = false;
var hl;

const cfconfig = {
    unicodeEmojis: false
};

const cfi18n = {
    en: {
        viewSingular: "View reply",
        viewMulti: "View %s replies",
        viewSingularOwner: "View reply from %s",
        viewMultiOwner: "View %s replies from %s and others",
        hideSingular: "Hide reply",
        hideMulti: "Hide replies",
        replyCountIsolator: /( REPLIES)|( REPLY)/
    }
}

/**
 * Get a string from the localization strings.
 *
 * @param {string}   string  Name of string to get
 * @param {string}   hl      Language to use.
 * @param {...array} args    Strings.
 * @returns {string}
 */
 function getString(string, hl = "en", ...args) {
    if (!string) return;
    var str;
    if (cfi18n[hl]) {
        if (cfi18n[hl][string]) {
            str = cfi18n[hl][string];
        } else if (cfi18n.en[string]) {
            str = cfi18n.en[string];
        } else {
            return;
        }
    } else {
        if (cfi18n.en[string]) str = cfi18n.en[string];
    }

    for (var i = 0; i < args.length; i++) {
        str = str.replace(/%s/, args[i]);
    }

    return str;
}

/**
 * Wait for a selector to exist
 *
 * @param {string}       selector  CSS Selector
 * @param {HTMLElement}  base      Element to search inside
 * @returns {Node}
 */
if (!window.waitForElm) {
    window.waitForElm = async function (selector, base = document) {
        if (!selector) return null;
        if (!base.querySelector) return null;
        while (base.querySelector(selector) == null) {
            await new Promise(r => requestAnimationFrame(r));
        };
        return base.querySelector(selector);
    };
}


/**
 * Is a value in an array?
 *
 * @param {*}     needle    Value to search
 * @param {Array} haystack  Array to search
 * @returns {boolean}
 */
 function inArray(needle, haystack) {
    for (var i = 0; i < haystack.length; i++) {
        if (needle == haystack[i]) return true;
    }
    return false;
}

/**
 * Get text of an InnerTube string.
 *
 * @param {object} object  String container.
 */
function getSimpleString(object) {
    if (object.simpleText) return object.simpleText;

    var str = "";
    for (var i = 0; i < object.runs.length; i++) {
        str += object.runs[i].text;
    }
    return str;
}

/**
 * Format a commentRenderer.
 *
 * @param {object} comment  commentRenderer from InnerTube.
 */
function formatComment(comment) {
    if (cfconfig.unicodeEmojis) {
        var runs;
        try {
            runs = comment.contentText.runs
            for (var i = 0; i < runs.length; i++) {
                delete runs[i].emoji;
                delete runs[i].loggingDirectives;
            }
        } catch(err) {}
    }

    return comment;
}

/**
 * Format a commentThreadRenderer.
 *
 * @param {object} thread  commentThreadRenderer from InnerTube.
 */
async function formatCommentThread(thread) {
    if (thread.comment.commentRenderer) {
        thread.comment.commentRenderer = formatComment(thread.comment.commentRenderer);
    }

    var replies;
    try {
        replies = thread.replies.commentRepliesRenderer;
        if (replies.viewRepliesIcon) {
            replies.viewReplies.buttonRenderer.icon = replies.viewRepliesIcon.buttonRenderer.icon;
            delete replies.viewRepliesIcon;
        }

        if (replies.hideRepliesIcon) {
            replies.hideReplies.buttonRenderer.icon = replies.hideRepliesIcon.buttonRenderer.icon;
            delete replies.hideRepliesIcon;
        }

        var creatorName;
        try {
            creatorName = replies.viewRepliesCreatorThumbnail.accessibility.accessibilityData.label;
            delete replies.viewRepliesCreatorThumbnail;
        } catch(err) {}

        var replyCount = getSimpleString(replies.viewReplies.buttonRenderer.text);
        replyCount = +replyCount.replace(getString("replyCountIsolator", hl), "");

        var viewMultiString = creatorName ? "viewMultiOwner" : "viewMulti";
        var viewSingleString = creatorName ? "viewSingularOwner" : "viewSingular";

        replies.viewReplies.buttonRenderer.text = {
            runs: [
                {
                    text: (replyCount > 1) ? getString(viewMultiString, hl, replyCount, creatorName) : getString(viewSingleString, hl, creatorName)
                }
            ]
        }

        replies.hideReplies.buttonRenderer.text = {
            runs: [
                {
                    text: (replyCount > 1) ? getString("hideMulti", hl) : getString("hideSingular", hl)
                }
            ]
        };
    } catch(err) {}

    return thread;
}

/**
 * Force Polymer to refresh data of an element.
 *
 * @param {Node} element  Element to refresh data of.
 */
function refreshData(element) {
    var clone = element.cloneNode();
    clone.data = element.data;
    // Let the script know we left our mark
    // in a way that doesn't rely on classes
    // because Polymer likes to cast comments
    // into the void for later reuse
    clone.data.fixedByCF = true;
    for (var i in element.properties) {
        clone[i] = element[i];
    }
    element.insertAdjacentElement("afterend", clone);
    element.remove();
}

var commentObserver = new MutationObserver((list) => {
    list.forEach(async (mutation) => {
        if (mutation.addedNodes) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                var elm = mutation.addedNodes[i];
                if (elm.classList && elm.data && !elm.data.fixedByCF) {
                    if (elm.tagName == "YTD-COMMENT-THREAD-RENDERER") {
                        elm.data = await formatCommentThread(elm.data);
                        refreshData(elm);
                    } else if (elm.tagName == "YTD-COMMENT-RENDERER") {
                        if (!elm.classList.contains("ytd-comment-thread-renderer")) {
                            elm.data = formatComment(elm.data);
                            refreshData(elm);
                        }
                    }
                }
            }
        }
    });
});

document.addEventListener("yt-page-data-updated", async (e) => {
    hl = yt.config_.HL;
    commentObserver.observe(document.querySelector("ytd-app"), { childList: true, subtree: true });
});

const abtnconfig = {
    unsegmentLikeButton: false,
    noFlexibleItems: true
};

function updateBtns() {
    var watchFlexy = document.querySelector("ytd-watch-flexy");
    var results = watchFlexy.data.contents.twoColumnWatchNextResults.results.results.contents;

    for (var i = 0; i < results.length; i++) {
        if (results[i].videoPrimaryInfoRenderer) {
            var actions = results[i].videoPrimaryInfoRenderer.videoActions.menuRenderer;

            if (abtnconfig.unsegmentLikeButton) {
                if (actions.topLevelButtons[0].segmentedLikeDislikeButtonRenderer) {
                    var segmented = actions.topLevelButtons[0].segmentedLikeDislikeButtonRenderer;
                    actions.topLevelButtons.splice(0, 1);
                    actions.topLevelButtons.unshift(segmented.dislikeButton);
                    actions.topLevelButtons.unshift(segmented.likeButton);
                }
            }

            if (abtnconfig.noFlexibleItems) {
                for (let i = 0; i < actions.flexibleItems.length; i++) {
                    actions.topLevelButtons.push(actions.flexibleItems[i].menuFlexibleItemRenderer.topLevelButton);
                }

                delete actions.flexibleItems
            }
        }
    }

    var temp = watchFlexy.data;
    watchFlexy.data = {};
    watchFlexy.data = temp;
}

document.addEventListener("yt-page-data-updated", (e) => {
    if (e.detail.pageType == "watch") {
        updateBtns();
    }
});

/* jshint esversion:8 */

((__CONTEXT01__) => {
  'use strict';


  const win = this instanceof Window ? this : window;

  // Create a unique key for the script and check if it is already running
  const hkey_script = 'ahceihvpbosz';
  if (win[hkey_script]) throw new Error('Duplicated Userscript Calling'); // avoid duplicated scripting
  win[hkey_script] = true;

  const insp = o => o ? (o.polymerController || o.inst || o || 0) : (o || 0);
  const indr = o => insp(o).$ || o.$ || 0;

  /** @type {globalThis.PromiseConstructor} */
  const Promise = (async () => { })().constructor; // YouTube hacks Promise in WaterFox Classic and "Promise.resolve(0)" nevers resolve.
  const cleanContext = async (win) => {
    const waitFn = requestAnimationFrame; // shall have been binded to window
    try {
      let mx = 16; // MAX TRIAL
      const frameId = 'vanillajs-iframe-v1'
      let frame = document.getElementById(frameId);
      let removeIframeFn = null;
      if (!frame) {
        frame = document.createElement('iframe');
        frame.id = frameId;
        const blobURL = typeof webkitCancelAnimationFrame === 'function' && typeof kagi === 'undefined' ? (frame.src = URL.createObjectURL(new Blob([], { type: 'text/html' }))) : null; // avoid Brave Crash
        frame.sandbox = 'allow-same-origin'; // script cannot be run inside iframe but API can be obtained from iframe
        let n = document.createElement('noscript'); // wrap into NOSCRPIT to avoid reflow (layouting)
        n.appendChild(frame);
        while (!document.documentElement && mx-- > 0) await new Promise(waitFn); // requestAnimationFrame here could get modified by YouTube engine
        const root = document.documentElement;
        root.appendChild(n); // throw error if root is null due to exceeding MAX TRIAL
        if (blobURL) Promise.resolve().then(() => URL.revokeObjectURL(blobURL));

        removeIframeFn = (setTimeout) => {
          const removeIframeOnDocumentReady = (e) => {
            e && win.removeEventListener("DOMContentLoaded", removeIframeOnDocumentReady, false);
            e = n;
            n = win = removeIframeFn = 0;
            setTimeout ? setTimeout(() => e.remove(), 200) : e.remove();
          }
          if (!setTimeout || document.readyState !== 'loading') {
            removeIframeOnDocumentReady();
          } else {
            win.addEventListener("DOMContentLoaded", removeIframeOnDocumentReady, false);
          }
        }
      }
      while (!frame.contentWindow && mx-- > 0) await new Promise(waitFn);
      const fc = frame.contentWindow;
      if (!fc) throw "window is not found."; // throw error if root is null due to exceeding MAX TRIAL
      try {
        const { requestAnimationFrame, setTimeout, clearTimeout } = fc;
        const res = { requestAnimationFrame, setTimeout, clearTimeout };
        for (let k in res) res[k] = res[k].bind(win); // necessary
        if (removeIframeFn) Promise.resolve(res.setTimeout).then(removeIframeFn);
        return res;
      } catch (e) {
        if (removeIframeFn) removeIframeFn();
        return null;
      }
    } catch (e) {
      console.warn(e);
      return null;
    }
  };

  const isWatchPageURL = (url) => {
    url = url || location;
    return location.pathname === '/watch' || location.pathname.startsWith('/live/')
  };

  cleanContext(win).then(__CONTEXT02__ => {
    if (!__CONTEXT02__) return null;

    const { ResizeObserver } = __CONTEXT01__;
    const { requestAnimationFrame, setTimeout, clearTimeout } = __CONTEXT02__;
    const elements = {};
    let rid1 = 0;
    let rid2 = 0;
    /** @type {MutationObserver | null} */
    let attrObserver = null;
    /** @type {ResizeObserver | null} */
    let resizeObserver = null;
    let isHTMLAttrApplied = false;
    const core = {
      begin() {
        document.addEventListener('yt-player-updated', core.hanlder, true);
        document.addEventListener('ytd-navigate-finish', core.hanlder, true);
      },
      hanlder: () => {
        rid1++;
        if (rid1 > 1e9) rid1 = 9;
        const tid = rid1;
        requestAnimationFrame(() => {
          if (tid !== rid1) return;
          core.runner();
        })
      },
      async runner() {
        if (!location.href.startsWith('https://www.youtube.com/')) return;
        if (!isWatchPageURL()) return;

        elements.ytdFlexy = document.querySelector('ytd-watch-flexy');
        elements.video = document.querySelector('ytd-watch-flexy #movie_player video, ytd-watch-flexy #movie_player audio.video-stream.html5-main-video');
        if (elements.ytdFlexy && elements.video) { } else return;
        elements.moviePlayer = elements.video.closest('#movie_player');
        if (!elements.moviePlayer) return;

        // resize Video
        let { ytdFlexy } = elements;
        if (!ytdFlexy.ElYTL) {
          ytdFlexy.ElYTL = 1;
          const ytdFlexyCnt = insp(ytdFlexy);
          if (typeof ytdFlexyCnt.calculateNormalPlayerSize_ === 'function') {
            ytdFlexyCnt.calculateNormalPlayerSize_ = core.resizeFunc(ytdFlexyCnt.calculateNormalPlayerSize_, 1);
          } else {
            console.warn('ytdFlexyCnt.calculateNormalPlayerSize_ is not a function.')
          }
          if (typeof ytdFlexyCnt.calculateCurrentPlayerSize_ === 'function') {
            ytdFlexyCnt.calculateCurrentPlayerSize_ = core.resizeFunc(ytdFlexyCnt.calculateCurrentPlayerSize_, 0);
          } else {
            console.warn('ytdFlexyCnt.calculateCurrentPlayerSize_ is not a function.')
          }
        }
        ytdFlexy = null;

        // when video is fetched
        elements.video.removeEventListener('canplay', core.triggerResizeDelayed, false);
        elements.video.addEventListener('canplay', core.triggerResizeDelayed, false);

        // when video is resized
        if (resizeObserver) {
          resizeObserver.disconnect();
          resizeObserver = null;
        }
        if (typeof ResizeObserver === 'function') {
          resizeObserver = new ResizeObserver(core.triggerResizeDelayed);
          resizeObserver.observe(elements.moviePlayer);
        }

        // MutationObserver:[collapsed] @ ytd-live-chat-frame#chat
        if (attrObserver) {
          attrObserver.takeRecords();
          attrObserver.disconnect();
          attrObserver = null;
        }
        let chat = document.querySelector('ytd-watch-flexy ytd-live-chat-frame#chat');
        if (chat) {
          // resize due to DOM update
          attrObserver = new MutationObserver(core.triggerResizeDelayed);
          attrObserver.observe(chat, { attributes: true, attributeFilter: ["collapsed"] });
          chat = null;
        }

        // resize on idle
        Promise.resolve().then(core.triggerResizeDelayed);
      },
      resizeFunc(originalFunc, kb) {
        return function () {
          rid2++;
          if (!isHTMLAttrApplied) {
            isHTMLAttrApplied = true;
            Promise.resolve(0).then(() => {
              document.documentElement.classList.add('youtube-video-resize-fix');
            }).catch(console.warn);
          }
          if (document.fullscreenElement === null) {

            // calculateCurrentPlayerSize_ shall be always return NaN to make correct positioning of toolbars
            if (!kb) return { width: NaN, height: NaN };

            let ret = core.calculateSize();
            if (ret.height > 0 && ret.width > 0) {
              return ret;
            }
          }
          return originalFunc.apply(this, arguments);
        }
      },
      calculateSize_() {
        const { moviePlayer, video } = elements;
        const rect1 = { width: video.videoWidth, height: video.videoHeight }; // native values independent of css rules
        if (rect1.width > 0 && rect1.height > 0) {
          const rect2 = moviePlayer.getBoundingClientRect();
          const aspectRatio = rect1.width / rect1.height;
          let h2 = rect2.width / aspectRatio;
          let w2 = rect2.height * aspectRatio;
          return { rect2, h2, w2 };
        }
        return null;
      },
      calculateSize() {
        let rs = core.calculateSize_();
        if (!rs) return { width: NaN, height: NaN };
        const { rect2, h2, w2 } = rs;
        if (h2 > rect2.height) {
          return { width: w2, height: rect2.height };
        } else {
          return { width: rect2.width, height: h2 };
        }
      },
      triggerResizeDelayed: () => {
        rid2++;
        if (rid2 > 1e9) rid2 = 9;
        const tid = rid2;
        requestAnimationFrame(() => {
          if (tid !== rid2) return;
          const { ytdFlexy } = elements;
          let r = false;
          const ytdFlexyCnt = insp(ytdFlexy);
          const windowSize_ = ytdFlexyCnt.windowSize_;
          if (windowSize_ && typeof ytdFlexyCnt.onWindowResized_ === 'function') {
            try {
              ytdFlexyCnt.onWindowResized_(windowSize_);
              r = true;
            } catch (e) { }
          }
          if (!r) window.dispatchEvent(new Event('resize'));
        })
      }
    };
    core.begin();







    // YouTube Watch Page Reflect (WPR)



    // This script enhances the functionality of YouTube pages by reflecting changes in the page state.

    (async function youTubeWPR() {

      let checkPageVisibilityChanged = false;

      // A WeakSet to keep track of elements being monitored for mutations.
      const monitorWeakSet = new WeakSet();

      /** @type {globalThis.PromiseConstructor} */
      const Promise = (async () => { })().constructor;

      // Function to reflect the current state of the YouTube page.
      async function _reflect() {
        await Promise.resolve();

        const youtubeWpr = document.documentElement.getAttribute("youtube-wpr");
        let s = '';

        // Check if the current page is the video watch page.
        if (isWatchPageURL()) {
          let watch = document.querySelector("ytd-watch-flexy");
          let chat = document.querySelector("ytd-live-chat-frame#chat");

          if (watch) {
            // Determine the state of the chat and video player on the watch page and generate a state string.
            s += !chat ? 'h0' : (chat.hasAttribute('collapsed') || !document.querySelector('iframe#chatframe')) ? 'h1' : 'h2';
            s += watch.hasAttribute('is-two-columns_') ? 's' : 'S';
            s += watch.hasAttribute('fullscreen') ? 'F' : 'f';
            s += watch.hasAttribute('theater') ? 'T' : 't';
          }
        }

        // Update the reflected state if it has changed.
        if (s !== youtubeWpr) {
          document.documentElement.setAttribute("youtube-wpr", s);
        }

      }

      // Function to reflect changes in specific attributes of monitored elements.
      async function reflect(nodeName, attrNames, forced) {
        await Promise.resolve();

        if (!forced) {
          let skip = true;
          for (const attrName of attrNames) {
            if (nodeName === 'ytd-live-chat-frame') {
              if (attrName === 'collapsed') skip = false;
            } else if (nodeName === 'ytd-watch-flexy') {
              if (attrName === 'is-two-columns_') skip = false;
              else if (attrName === 'fullscreen') skip = false;
              else if (attrName === 'theater') skip = false;
            }
          }
          if (skip) return;
        }

        // Log the mutated element and its attributes.
        // console.log(nodeName, attrNames);

        // Call _reflect() to update the reflected state.
        _reflect();
      }

      // Callback function for the MutationObserver that tracks mutations in monitored elements.
      function callback(mutationsList) {
        const attrNames = new Set();
        let nodeName = null;
        for (const mutation of mutationsList) {
          if (nodeName === null && mutation.target) nodeName = mutation.target.nodeName.toLowerCase();
          attrNames.add(mutation.attributeName);
        }
        reflect(nodeName, attrNames, false);
      }

      function getParent(element) {
        return element.__shady_native_parentNode || element.__shady_parentNode || element.parentNode;
      }

      let lastPageTypeChanged = 0;
      function chatContainerMutationHandler() {
        if (Date.now() - lastPageTypeChanged < 800) _reflect();
      }

      // Function to start monitoring an element for mutations.
      function monitor(element) {
        if (!element) return;
        if (monitorWeakSet.has(element)) {
          return;
        }

        monitorWeakSet.add(element);

        const observer = new MutationObserver(callback);
        observer.observe(element, { attributes: true });

        if (element.id === 'chat') {
          const parentNode = getParent(element);
          if (parentNode instanceof Element && parentNode.id === 'chat-container' && !monitorWeakSet.has(parentNode)) {
            monitorWeakSet.add(parentNode);
            const observer = new MutationObserver(chatContainerMutationHandler);
            observer.observe(parentNode, { childList: true, subtree: false });
          }
        }

        return 1;
      }

      let timeout = 0;

      // Function to monitor relevant elements and update the reflected state.
      let g = async (forced) => {
        await Promise.resolve();
        let b = 0;
        b = b | monitor(document.querySelector("ytd-watch-flexy"));
        b = b | monitor(document.querySelector("ytd-live-chat-frame#chat"));
        if (b || forced) {
          _reflect();
        }
      }
      // let renderId = 0;
      // Event handler function that triggers when the page finishes navigation or page data updates.
      let eventHandlerFunc = async (evt) => {
        checkPageVisibilityChanged = true;
        timeout = Date.now() + 800;
        g(1);
        if (evt.type === 'yt-navigate-finish') {
          // delay required when page type is changed for #chat (home -> watch).
          setTimeout(() => {
            g(1);
          }, 80);
        } else if (evt.type === 'yt-page-type-changed') {
          lastPageTypeChanged = Date.now();
          // setTimeout(() => {
          //   if (renderId > 1e9) renderId = 9;
          //   const t = ++renderId;
          //   requestAnimationFrame(() => {
          //     if (t !== renderId) return;
          //     g(1);
          //   });
          // }, 180);
          if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(() => {
              g(1);
            });
          }
        }
      }

      let loadState = 0;

      // Function to initialize the script and start monitoring the page.
      async function actor() {
        if (loadState === 0) {
          if (!document.documentElement.hasAttribute("youtube-wpr")) {
            loadState = 1;
            document.documentElement.setAttribute("youtube-wpr", "");
            document.addEventListener("yt-navigate-finish", eventHandlerFunc, false);
            document.addEventListener("yt-page-data-updated", eventHandlerFunc, false);
            document.addEventListener("yt-page-type-changed", eventHandlerFunc, false);
          } else {
            loadState = -1;
            document.removeEventListener("yt-page-data-fetched", actor, false);
            return;
          }
        }
        if (loadState === 1) {
          timeout = Date.now() + 800;
          // Function to continuously monitor elements and update the reflected state.
          let pf = () => {
            g(0);
            if (Date.now() < timeout) requestAnimationFrame(pf);
          };
          pf();
        }
      }

      // Event listener that triggers when page data is fetched.
      document.addEventListener("yt-page-data-fetched", actor, false);

      // Update after visibility changed (looks like there are bugs due to inactive tab)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'visible') return;
        if (checkPageVisibilityChanged) {
          checkPageVisibilityChanged = false;
          setTimeout(() => {
            g(1);
          }, 100);
          requestAnimationFrame(() => {
            g(1);
          });
        }
      }, false);


    })();

  });


// ==UserScript==
// @name         YouTube Shorts To Normal Video
// @name:es      Cortos De YouTube A Video Normal
// @namespace    https://github.com/tientq64/userscripts
// @version      1.0.2
// @description        Instantly redirect YouTube Shorts videos to normal video view, allowing you to save, download, choose quality, etc.
// @description:es     Redirecciona instantáneamente los videos de YouTube Shorts a la vista de video normal, lo que te permite guardarlos, descargarlos, elegir la calidad, etc.
// @author       tientq64
// @icon         https://cdn-icons-png.flaticon.com/64/3670/3670147.png
// @match        https://www.youtube.com/*
// @license      MIT
// @grant        none
// @noframes
// @homepage     https://github.com/tientq64/userscripts/tree/main/scripts/YouTube-Shorts-To-Normal-Video
// @downloadURL https://update.greasyfork.org/scripts/504848/YouTube%20Shorts%20To%20Normal%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/504848/YouTube%20Shorts%20To%20Normal%20Video.meta.js
// ==/UserScript==

function redirect() {
    const isShorts = location.pathname.startsWith('/shorts/')
    if (isShorts) {
        const newUrl = location.href.replace('/shorts/', '/watch?v=')
        location.replace(newUrl)
    }
}

document.addEventListener('yt-navigate-start', redirect)
redirect()


})({ ResizeObserver });