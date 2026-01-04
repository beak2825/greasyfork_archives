// ==UserScript==
// @name        bet365 Fullscreen Video
// @namespace   https://greasyfork.org/en/users/782448-powlo
// @match       https://www.bet365.com/
// @grant       none
// @version     1.0.1
// @author      powlo
// @description Allows live videos on bet365 to be made full screen.
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@1
// @downloadURL https://update.greasyfork.org/scripts/427819/bet365%20Fullscreen%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/427819/bet365%20Fullscreen%20Video.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

// TODO: Do something to hide controls when full screen.

VM.observe(document.body, () => {
  function makeSmallScreen(e) {
    // Does the inverse of makeFullScreen. Puts element back where it was and restores header.
    const header = document.querySelector('.wc-WebConsoleModule_Header');
    const mediaPlayer = document.querySelector(
      '.lv-LiveVideoView_MediaPlayerInnerWrapper'
    );
    const mediaPlayerContainer = document.querySelector(
      '.lv-LiveVideoView_MediaPlayerOuterWrapper'
    );
    const floatButton = document.querySelector('.fpm-FloatButton');
    const unFloatContainer = document.querySelector(
      '.fpm-FloatingMediaPlayerControls_UnfloatContainer'
    );

    header.style.display = 'block';
    mediaPlayer.style.zIndex = null;
    mediaPlayerContainer.appendChild(mediaPlayer);
    floatButton.style.display = 'block';
    unFloatContainer.style.display = 'none';
  }

  function makeBigScreen(e) {
    // Event handlers are on document.body. Stop them from being reached.
    e.stopPropagation();

    const header = document.querySelector('.wc-WebConsoleModule_Header');
    const floatButton = document.querySelector('.fpm-FloatButton');
    const unFloatContainer = document.querySelector(
      '.fpm-FloatingMediaPlayerControls_UnfloatContainer'
    );
    const bottomBar = document.querySelector(
      '.fpm-FloatableMediaPlayerControls_BottomBar'
    );
    const mediaPlayer = document.querySelector(
      '.lv-LiveVideoView_MediaPlayerInnerWrapper'
    );

    mediaPlayer.style.zIndex = '100';
    document.body.appendChild(mediaPlayer);

    header.style.display = 'none';

    // maybe use event target?
    floatButton.style.display = 'none';
    unFloatContainer.style.display = 'block';
  }

  const formControl = document.querySelector('.fpm-ControlsOverlay');
  if (formControl) {
    const floatButton = formControl.querySelector('.fpm-FloatButton');
    const bottomBar = formControl.querySelector(
      '.fpm-FloatableMediaPlayerControls_BottomBar'
    );
    floatButton.addEventListener('click', makeBigScreen);

    // We have to manually construct the unfloat button because we disabled the event propagation above.
    // Create it then hide it so it can be 'switched on' in later code.
    const unFloatContainer = document.createElement('div');
    unFloatContainer.classList.add(
      'fpm-FloatingMediaPlayerControls_UnfloatContainer'
    );
    bottomBar.prepend(unFloatContainer);
    const unFloatButton = document.createElement('div');
    unFloatButton.classList.add(
      'fpm-FloatingMediaPlayerControls_Unfloat',
      'fpm-FloatingMediaPlayerControls_Unfloat-enabled'
    );
    unFloatButton.style.backgroundColor = 'unset';
    unFloatButton.style.borderRadius = 'unset';
    unFloatContainer.appendChild(unFloatButton);
    unFloatButton.addEventListener('click', makeSmallScreen);
    unFloatContainer.style.display = 'none';

    return true;
  }
});
