// ==UserScript==
// @name         Dongrami
// @namespace    gaeulbyul
// @license      WTFPL
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @icon         https://www.google.com/s2/favicons?domain=mobile.twitter.com
// @version      0.1.20220820
// @author       gaeulbyul
// @description  트위터의 서클기능을 활성화해줍니다.
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/449880/Dongrami.user.js
// @updateURL https://update.greasyfork.org/scripts/449880/Dongrami.meta.js
// ==/UserScript==
'use strict'
void (({ document }) => {
  function set(switches, name, value) {
    if (!(name in switches)) {
      console.warn('[Dongrami] switch "%s" is not exists', name)
      return false
    }
    switches[name].value = value
    return true
  }
  function main(reactRoot) {
    const store = Object.entries(reactRoot.children[0].children[0])
      .find(([key, _v]) => /^__reactProps\$/.test(key))
      .pop().children.props.store
    const state = store.getState()
    const switches = state.featureSwitch.user.config
    console.debug('[Dongrami] %o', { store, state, switches })
    const r1 = set(switches, 'trusted_friends_consumption_enabled', true)
    const r2 = set(switches, 'trusted_friends_dash_discovery_enabled', true)
    const r3 = set(switches, 'trusted_friends_tweet_creation_enabled', true)
    // trusted_friends_audience_control_exp_variant <- ??
    if (r1 && r2 && r3) {
      console.debug('[Dongrami] success')
    }
  }
  function initialize() {
    const reactRoot = document.getElementById('react-root')
    if (!('_reactRootContainer' in reactRoot)) {
      setTimeout(initialize, 500)
      return
    }
    main(reactRoot)
  }
  initialize()
})(unsafeWindow)