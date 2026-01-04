// ==UserScript==
// @name        YouTube EXPERIMENT_FLAGS Tamer (Basic)
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @version     0.4.8.104
// @license     MIT
// @author      CY Fung
// @icon        https://raw.githubusercontent.com/cyfung1031/userscript-supports/main/icons/yt-engine.png
// @description Adjust EXPERIMENT_FLAGS
// @grant       none
// @unwrap
// @run-at      document-start
// @allFrames   true
// @inject-into page
// @downloadURL https://update.greasyfork.org/scripts/473685/YouTube%20EXPERIMENT_FLAGS%20Tamer%20%28Basic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/473685/YouTube%20EXPERIMENT_FLAGS%20Tamer%20%28Basic%29.meta.js
// ==/UserScript==

((__CONTEXT__) => {

  // Purpose 1: Remove Obsolete Flags
  // Purpose 2: Remove Flags bring no visual difference
  // Purpose 3: Enable Flags bring performance boost

  const DISABLE_CINEMATICS = false; // standard design
  const NO_SerializedExperiment = false;
  const KEEP_PLAYER_QUALITY_STICKY = true; // see https://greasyfork.org/scripts/471033/
  const DISABLE_serializedExperimentIds = true;
  const DISABLE_serializedExperimentFlags = true;


  // const ALLOW_FLAGS_202404_flags11 = new Set([
  //   // 'use_core_sm',
  //   // 'use_new_cml',
  //   // 'web_api_url',
  // ]);

  const ENABLE_EXPERIMENT_FLAGS_MAINTAIN_STABLE_LIST = {
    defaultValue: true, // performance boost
    useExternal: () => typeof localStorage.EXPERIMENT_FLAGS_MAINTAIN_STABLE_LIST !== 'undefined',
    externalValue: () => (+localStorage.EXPERIMENT_FLAGS_MAINTAIN_STABLE_LIST ? true : false)
  };
  const ENABLE_EXPERIMENT_FLAGS_MAINTAIN_REUSE_COMPONENTS = {
    defaultValue: true, // not sure
    useExternal: () => typeof localStorage.EXPERIMENT_FLAGS_MAINTAIN_REUSE_COMPONENTS !== 'undefined',
    externalValue: () => (+localStorage.EXPERIMENT_FLAGS_MAINTAIN_REUSE_COMPONENTS ? true : false)
  };
  const ENABLE_EXPERIMENT_FLAGS_DEFER_DETACH = {
    defaultValue: true, // not sure
    useExternal: () => typeof localStorage.ENABLE_EXPERIMENT_FLAGS_DEFER_DETACH !== 'undefined',
    externalValue: () => (+localStorage.ENABLE_EXPERIMENT_FLAGS_DEFER_DETACH ? true : false)
  };

  const ALLOW_ALL_LIVE_CHATS_FLAGS = true;



  // TBC
  // kevlar_tuner_should_always_use_device_pixel_ratio
  // kevlar_tuner_should_clamp_device_pixel_ratio
  // kevlar_tuner_clamp_device_pixel_ratio
  // kevlar_tuner_should_use_thumbnail_factor
  // kevlar_tuner_thumbnail_factor
  // kevlar_tuner_min_thumbnail_quality
  // kevlar_tuner_max_thumbnail_quality

  // kevlar_tuner_should_test_visibility_time_between_jobs
  // kevlar_tuner_visibility_time_between_jobs_ms

  // kevlar_tuner_default_comments_delay
  // kevlar_tuner_run_default_comments_delay

  let settled = null;
  // cinematic feature is no longer an experimential feature.
  // It has been officially implemented.
  // To disable cinematics, the user shall use other userscripts or just turn off the option in the video options.

  const getSettingValue = (fm) => fm.useExternal() ? fm.externalValue() : fm.defaultValue;

  const win = this instanceof Window ? this : window;

  // Create a unique key for the script and check if it is already running
  const hkey_script = 'jmimcvowrlzl';
  if (win[hkey_script]) throw new Error('Duplicated Userscript Calling'); // avoid duplicated scripting
  win[hkey_script] = true;

  /** @type {globalThis.PromiseConstructor} */
  const Promise = ((async () => { })()).constructor;

  let isMainWindow = false;
  let mzFlagDetected = new Set();
  let zPlayerKevlar = false;
  try {
    isMainWindow = window.document === window.top.document
  } catch (e) { }

  function fixSerializedExperiment(conf) {

    if (DISABLE_serializedExperimentIds && typeof conf.serializedExperimentIds === 'string') {
      let ids = conf.serializedExperimentIds.split(',');
      let newIds = [];
      for (const id of ids) {
        let keep = false;
        if (keep) {
          newIds.push(id);
        }
      }
      conf.serializedExperimentIds = newIds.join(',');
    }

    if (DISABLE_serializedExperimentFlags && typeof conf.serializedExperimentFlags === 'string') {
      const fg = conf.serializedExperimentFlags;
      const rx = /(^|&)(\w+)=([^=&|\s\{\}\[\]\(\)?]*)/g;
      let res = [];
      for (let m; m = rx.exec(fg);) {
        let key = m[2];
        let value = m[3];
        let keep = false;
        if (KEEP_PLAYER_QUALITY_STICKY) {
          if (key === 'html5_exponential_memory_for_sticky' || key.startsWith('h5_expr_')) {
            keep = true;
          }
        }
        if (!DISABLE_CINEMATICS) {
          if (key === 'web_cinematic_watch_settings') {
            keep = true;
          }
        }
        if (keep) res.push(`${key}=${value}`);
      }
      conf.serializedExperimentFlags = res.join('&');
    }

  }

  const cachedSetFn=(o) => {

    const { use_maintain_stable_list, use_maintain_reuse_components, use_defer_detach } = o;

    const BY_PASS = [

      'enable_profile_cards_on_comments',

      'suppress_error_204_logging',
      ...(!DISABLE_CINEMATICS ? [

        'kevlar_measure_ambient_mode_idle',
        'kevlar_watch_cinematics_invisible',
        'web_cinematic_theater_mode',
        'web_cinematic_fullscreen',

        'enable_cinematic_blur_desktop_loading',
        'kevlar_watch_cinematics',
        'web_cinematic_masthead',
        'web_watch_cinematics_preferred_reduced_motion_default_disabled'

      ] : []),

      'live_chat_web_enable_command_handler',
      'live_chat_channel_activity',
      'live_chat_web_input_update',


      ...(ALLOW_ALL_LIVE_CHATS_FLAGS ? [

        'live_chat_banner_expansion_fix',
        'live_chat_enable_mod_view',
        'live_chat_enable_qna_banner_overflow_menu_actions',
        'live_chat_enable_qna_channel',
        'live_chat_enable_send_button_in_slow_mode',
        'live_chat_filter_emoji_suggestions',
        'live_chat_increased_min_height',
        'live_chat_over_playlist',
        'live_chat_web_use_emoji_manager_singleton',
        'live_chat_whole_message_clickable',

        'live_chat_emoji_picker_toggle_state',
        'live_chat_enable_command_handler_resolver_map',
        'live_chat_enable_controller_extraction',
        'live_chat_enable_rta_manager',
        'live_chat_require_space_for_autocomplete_emoji',
        'live_chat_unclickable_message',

      ]:[]),

      'kevlar_rendererstamper_event_listener', // https://github.com/cyfung1031/userscript-supports/issues/11

      // kevlar_enable_up_arrow - no use
      // kevlar_help_use_locale - might use
      // kevlar_refresh_gesture - might use
      // kevlar_smart_downloads - might use
      // kevlar_thumbnail_fluid
      'kevlar_ytb_live_badges',

      ...(!use_maintain_stable_list ? [
        'kevlar_tuner_should_test_maintain_stable_list',
        'kevlar_should_maintain_stable_list',
        'kevlar_tuner_should_maintain_stable_list', // fallback


      ] : []),


      ...(!use_maintain_reuse_components ? [

        'kevlar_tuner_should_test_reuse_components',
        'kevlar_tuner_should_reuse_components',
        'kevlar_should_reuse_components' // fallback

      ] : []),


      'kevlar_system_icons',

      // 'kevlar_prefetch_data_augments_network_data' continue;

      // home page / watch page icons
      'kevlar_three_dot_ink',
      'kevlar_use_wil_icons',
      'kevlar_home_skeleton',

      'kevlar_fluid_touch_scroll',
      'kevlar_watch_color_update',
      'kevlar_use_vimio_behavior', // home page - channel icon

      // collapsed meta; no teaser, use latest collapsed meta design
      'kevlar_structured_description_content_inline',
      'kevlar_watch_metadata_refresh',

      'kevlar_watch_js_panel_height', // affect Tabview Youtube

      'shorts_desktop_watch_while_p2',
      'web_button_rework',
      'web_darker_dark_theme_live_chat',
      'web_darker_dark_theme', // it also affect cinemtaics

      // modern menu
      'web_button_rework_with_live',
      'web_fix_fine_scrubbing_drag',

      // full screen -buggy
      'external_fullscreen',

      // minimize menu
      'web_modern_buttons',
      'web_modern_dialogs',

      // Tabview Youtube - multiline transcript
      'enable_mixed_direction_formatted_strings',


      // Notification Menu
      "kevlar_service_command_check",

      // Live ChatRoom Visibility
      "live_chat_cow_visibility_set_up",

    ].concat(
      [
      ]
    )

    const s = new Set(BY_PASS);

    return s;

  };
  let cachedSet = null;

  const hLooper = ((fn) => {

    let nativeFnLoaded = false;
    let kc1 = 0;

    const setIntervalW = setInterval;
    const clearIntervalW = clearInterval;
    let microDisconnectFn = null;
    let fStopLooper = false;
    const looperFn = () => {
      if (fStopLooper) return;

      let config_ = null;
      let EXPERIMENT_FLAGS = null;
      try {
        config_ = yt.config_;
        EXPERIMENT_FLAGS = config_.EXPERIMENT_FLAGS
      } catch (e) { }

      if (EXPERIMENT_FLAGS) {

        fn(EXPERIMENT_FLAGS, config_);

        if (microDisconnectFn) {
          let isYtLoaded = false;
          try {
            isYtLoaded = typeof ytcfg.set === 'function';
          } catch (e) { }
          if (isYtLoaded) {
            microDisconnectFn();
          }
        }

      }

      let playerKevlar = null;

      try {
        playerKevlar = ytcfg.data_.WEB_PLAYER_CONTEXT_CONFIGS.WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH;
      } catch (e) { }

      if (playerKevlar && !zPlayerKevlar) {
        zPlayerKevlar = true;

        if (NO_SerializedExperiment && typeof playerKevlar.serializedExperimentFlags === 'string' && typeof playerKevlar.serializedExperimentIds === 'string') {
          fixSerializedExperiment(playerKevlar);
        }


      }



    };

    const controller = {
      start() {
        kc1 = setIntervalW(looperFn, 1);
        (async () => {
          while (true && !nativeFnLoaded) {
            looperFn();
            if (fStopLooper) break;
            await (new Promise(requestAnimationFrame));
          }
        })();
        looperFn();
      },
      /**
       *
       * @param {Window} __CONTEXT__
       */
      setupForCleanContext(__CONTEXT__) {

        const { requestAnimationFrame, setInterval, clearInterval, setTimeout, clearTimeout } = __CONTEXT__;

        (async () => {
          while (true) {
            looperFn();
            if (fStopLooper) break;
            await (new Promise(requestAnimationFrame));
          }
        })();

        let kc2 = setInterval(looperFn, 1);

        const marcoDisconnectFn = () => {
          if (fStopLooper) return;
          Promise.resolve().then(() => {
            if (kc1 || kc2) {
              kc1 && clearIntervalW(kc1); kc1 = 0;
              kc2 && clearInterval(kc2); kc2 = 0;
              looperFn();
            }
            fStopLooper = true;
          });
          document.removeEventListener('yt-page-data-fetched', marcoDisconnectFn, false);
          document.removeEventListener('yt-navigate-finish', marcoDisconnectFn, false);
          document.removeEventListener('spfdone', marcoDisconnectFn, false);
        };
        document.addEventListener('yt-page-data-fetched', marcoDisconnectFn, false);
        document.addEventListener('yt-navigate-finish', marcoDisconnectFn, false);
        document.addEventListener('spfdone', marcoDisconnectFn, false);


        function onReady() {
          if (!fStopLooper) {
            setTimeout(() => {
              !fStopLooper && marcoDisconnectFn();
            }, 1000);
          }
        }

        Promise.resolve().then(() => {
          if (document.readyState !== 'loading') {
            onReady();
          } else {
            window.addEventListener("DOMContentLoaded", onReady, false);
          }
        });

        nativeFnLoaded = true;

        microDisconnectFn = () => Promise.resolve(marcoDisconnectFn).then(setTimeout);

      }
    };

    return controller;
  })((EXPERIMENT_FLAGS, config_) => {

    if (!EXPERIMENT_FLAGS) return;

    if (!settled) {
      settled = {
        use_maintain_stable_list: getSettingValue(ENABLE_EXPERIMENT_FLAGS_MAINTAIN_STABLE_LIST),
        use_maintain_reuse_components: getSettingValue(ENABLE_EXPERIMENT_FLAGS_MAINTAIN_REUSE_COMPONENTS),
        use_defer_detach: getSettingValue(ENABLE_EXPERIMENT_FLAGS_DEFER_DETACH),
      }
      if (settled.use_maintain_stable_list) Promise.resolve().then(() => console.debug("use_maintain_stable_list"));
      if (settled.use_maintain_reuse_components) Promise.resolve().then(() => console.debug("use_maintain_reuse_components"));
      if (settled.use_defer_detach) Promise.resolve().then(() => console.debug("use_defer_detach"));
    }
    const { use_maintain_stable_list, use_maintain_reuse_components, use_defer_detach } = settled;

    cachedSet = cachedSet || cachedSetFn({ use_maintain_stable_list, use_maintain_reuse_components, use_defer_detach });

    let mps = [];

    setTimeout(async ()=>{

      if(!mps.length) return;
      let ezz = new Set();
      let e1 = 999;
      let e2 = -999;
      for(const mp of mps){
        for(const k of mp){
          ezz.add(k);
          const kl= k.length;
          if(kl<e1) e1=kl;
          if(kl>e2) e2=kl;
        }
      }
      mps.length = 0;

      if(!ezz.size) return;

      await new Promise(r => window.setTimeout(r, 1));
      let qt = Date.now();

      console.log('EXPERIMENT_FLAGS', [e1,e2, ezz.size]);

      let mf = false;
      const obj = JSON.parse(localStorage['bpghn01'] || '{}');
      for(const e of ezz){
        if(obj[e])continue;
        obj[e] = qt;
        mf= true;
      }
      if(mf){

      localStorage['bpghn01'] = JSON.stringify( obj);
      }

      // await new Promise(r => window.setTimeout(r, 1));

      const getEFT = function(after, offset){


        after = typeof after === 'string' ? new Date(after) : after;
        let afterValue = +after;


        let arr = Object.entries(obj).map(e=>{
          return {key: e[0], date: e[1], len:e[0].length };
        }).sort((a,b)=>{
          return a.date < b.date ? 1 : a.date>b.date ? -1 : a.len < b.len ? 1 :a.len>b.len ? -1 : `${a.key}`.localeCompare(`${b.key}`) ;
        });

        if (afterValue > 0) {
          arr = arr.filter(e => {
            return e.date >= afterValue + offset;
          })
        }

        return [arr, after, afterValue];

      }

      window.log_EXPERIMENT_FLAGS_Tamer = function(after, toString){

        let [arr, after_, afterValue] =getEFT(after, -86400000);

        const r = {
          "!log": arr,
          after: afterValue > 0 ? new Date(afterValue) : null
        };
        console.log("log_EXPERIMENT_FLAGS_Tamer", toString ? JSON.stringify(r) : r);
        
      }

      window.kl_EXPERIMENT_FLAGS_Tamer = function (after, kl) {


        let [arr, after_, afterValue] =getEFT(after, -86400000);

        arr = arr.filter(e => {
          return e.len === kl
        });

        return arr.map(e => e.key).join('|')


      }


    }, 800);

    const setFalseFn = (EXPERIMENT_FLAGS) => {

      let ezz = new Set();

      for (const [key, value] of Object.entries(EXPERIMENT_FLAGS)) {


        if (value === true) {
          // if(key.indexOf('modern')>=0 || key.indexOf('enable')>=0 || key.indexOf('theme')>=0 || key.indexOf('skip')>=0  || key.indexOf('ui')>=0 || key.indexOf('observer')>=0 || key.indexOf('polymer')>=0 )continue;

          if (mzFlagDetected.has(key)) continue;
          mzFlagDetected.add(key);
          const kl = key.length;
          const kl7 = kl % 7;
          const kl5 = kl % 5;
          const kl3 = kl % 3;
          const kl2 = kl % 2;

          if(cachedSet.has(key)) continue;

          ezz.add(key);

          // console.log(key)
          EXPERIMENT_FLAGS[key] = false;
        }
      }
      mps.push(ezz);
      ezz = null;

    }

    setFalseFn(EXPERIMENT_FLAGS);
    if (config_.EXPERIMENTS_FORCED_FLAGS) setFalseFn(config_.EXPERIMENTS_FORCED_FLAGS);

    EXPERIMENT_FLAGS.desktop_delay_player_resizing = false;
    EXPERIMENT_FLAGS.web_animated_like = false;
    EXPERIMENT_FLAGS.web_animated_like_lazy_load = false;

    if (use_maintain_stable_list) {
      EXPERIMENT_FLAGS.kevlar_tuner_should_test_maintain_stable_list = true;
      EXPERIMENT_FLAGS.kevlar_should_maintain_stable_list = true;
      EXPERIMENT_FLAGS.kevlar_tuner_should_maintain_stable_list = true; // fallback
    }

    if (use_maintain_reuse_components) {
      EXPERIMENT_FLAGS.kevlar_tuner_should_test_reuse_components = true;
      EXPERIMENT_FLAGS.kevlar_tuner_should_reuse_components = true;
      EXPERIMENT_FLAGS.kevlar_should_reuse_components = true; // fallback
    }

    if (use_defer_detach) {
      EXPERIMENT_FLAGS.kevlar_tuner_should_defer_detach = true;
    }

    // EXPERIMENT_FLAGS.kevlar_prefetch_data_augments_network_data = true; // TBC
  });

  hLooper.start();


  const cleanContext = async (win) => {
    const waitFn = requestAnimationFrame; // shall have been binded to window
    try {
      let mx = 16; // MAX TRIAL
      const frameId = 'vanillajs-iframe-v1'
      let frame = document.getElementById(frameId);
      let removeIframeFn = null;
      if (!frame) {
        frame = document.createElement('iframe');
        frame.id = 'vanillajs-iframe-v1';
        frame.sandbox = 'allow-same-origin'; // script cannot be run inside iframe but API can be obtained from iframe
        let n = document.createElement('noscript'); // wrap into NOSCRPIT to avoid reflow (layouting)
        n.appendChild(frame);
        while (!document.documentElement && mx-- > 0) await new Promise(waitFn); // requestAnimationFrame here could get modified by YouTube engine
        const root = document.documentElement;
        root.appendChild(n); // throw error if root is null due to exceeding MAX TRIAL
        removeIframeFn = (setTimeout) => {
          const removeIframeOnDocumentReady = (e) => {
            e && win.removeEventListener("DOMContentLoaded", removeIframeOnDocumentReady, false);
            win = null;
            setTimeout(() => {
              n.remove();
              n = null;
            }, 200);
          }
          if (document.readyState !== 'loading') {
            removeIframeOnDocumentReady();
          } else {
            win.addEventListener("DOMContentLoaded", removeIframeOnDocumentReady, false);
          }
        }
      }
      while (!frame.contentWindow && mx-- > 0) await new Promise(waitFn);
      const fc = frame.contentWindow;
      if (!fc) throw "window is not found."; // throw error if root is null due to exceeding MAX TRIAL
      const { requestAnimationFrame, setInterval, setTimeout, clearInterval, clearTimeout } = fc;
      const res = { requestAnimationFrame, setInterval, setTimeout, clearInterval, clearTimeout };
      for (let k in res) res[k] = res[k].bind(win); // necessary
      if (removeIframeFn) Promise.resolve(res.setTimeout).then(removeIframeFn);
      return res;
    } catch (e) {
      console.warn(e);
      return null;
    }
  };

  cleanContext(win).then(__CONTEXT__ => {

    const { requestAnimationFrame, setInterval, clearInterval, setTimeout, clearTimeout } = __CONTEXT__;

    hLooper.setupForCleanContext(__CONTEXT__)

  });


  if (isMainWindow) {

    console.groupCollapsed(
      "%cYouTube EXPERIMENT_FLAGS Tamer",
      "background-color: #EDE43B ; color: #000 ; font-weight: bold ; padding: 4px ;"
    );

    console.log("Script is loaded.");
    console.log("This might affect the new features when YouTube rolls them out to general users.");
    console.log("If you found any issue in using YouTube, please disable this script to check whether the issue is due to this script or not.");

    console.groupEnd();

  }

})(null);
