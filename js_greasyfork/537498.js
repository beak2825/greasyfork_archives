// ==UserScript==
// @name         Torn Toolbar Button and Message Inserter From URL
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Inserts a custom message into the Torn message composer with username and player ID from URL parameters.
// @author       Hesper
// @match        https://www.torn.com/messages.php*
// @grant        none
// @icon
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537498/Torn%20Toolbar%20Button%20and%20Message%20Inserter%20From%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/537498/Torn%20Toolbar%20Button%20and%20Message%20Inserter%20From%20URL.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let username = null;
    let playerId = null;

    const subjectTitle = 'Join Luscious Dreams Today!';

    const message = `<div>
  <div
    style="background-image: url('https://i.postimg.cc/Jnb8X8RH/6c6ea8b3.png'); background-color: black; padding: 40px 10px 40px 10px;"
  >
    <div class="h">
      <div>
        <p style="text-align: center;">
          <span style="color: #f7335a; font-size: 18px;"
            >Hello, we hope this letter finds you well! We at <strong>Luscious Dreams</strong> are looking for Eager and
            Experienced New Recruits to Join our Faction!</span
          ><br /><br /><img
            src="https://factionimages.torn.com/95c27bd4-b885-41e2-9b50-1593795783cc-7282.gif"
            alt="95c27bd4-b885-41e2-9b50-1593795783cc-7282.gif"
            width="100%"
          /><br /><br /><span style="color: #f7335a;"
            ><strong
              ><span style="font-size: 16px;"><em>Why am I getting this mail?</em></span
              ><br /></strong></span
          ><span style="font-size: 16px; color: white;"
            ><strong><span style="text-decoration: underline;">You</span> </strong>are the type of player we want in our
            family! <strong><span style="color: #f7335a;">Luscious Dreams</span></strong> is a faction aspiring for
            Greatness in Torn and we need players like
            <strong><span style="text-decoration: underline;">YOU</span></strong> to make it possible!! Every day we are
            growing, whether it be in member count, individual player growth and in our Unmatched Armory! Our Family is
            aiming for the stars, and we want to include you on that path for Greatness!!</span
          ><span style="color: #f7335a;"
            ><strong><br /></strong
          ></span>
        </p>
        <p style="text-align: center;">&nbsp;</p>
        <p style="text-align: center;">
          <span style="color: #f7335a;"
            ><strong
              ><br /><em><span style="font-size: 16px;">What do you need from me?</span></em
              ><br /></strong
          ></span>
        </p>
        <p style="text-align: center;">
          <span style="font-size: 12px;"
            ><span style="font-size: 16px; color: white;"
              >All we ask is that you <span style="color: #f7335a;"><strong>Join us!</strong></span> Our faction is
              being reshaped as we speak, building from the ground up as a Stronger and more Competitive Family of
              Professionals who have a strong desire to grow larger both as individuals as well as bringing our faction
              to the Top of Torn!
              <span style="color: #f7335a;"
                >Players like you will form the Foundations of the NEW Luscious Dreams, guiding it to never before seen
                heights!</span
              ></span
            ></span
          ><span style="color: #f7335a; font-size: 12px;"
            ><strong><br /></strong
          ></span>
        </p>
        <p style="text-align: center;">&nbsp;</p>
        <p style="text-align: center;">
          <span style="color: #f7335a; font-size: 12px;"
            ><strong
              ><br /><em><span style="font-size: 16px;">What's in it for me?</span></em></strong
            ></span
          >
        </p>
        <p style="text-align: center;">
          <span style="font-size: 16px; color: white;"
            ><strong><span style="color: #f7335a;">Luscious Dreams</span></strong> boasts one of the Largest Armories in
            Torn, and that's not hyperbole!
          </span>
        </p>
        <p style="text-align: center;">
          <span style="font-size: 16px;"
            ><span style="color: #f6ad2e; font-size: 18px;"
              >You would have Free Access to loan <strong>Any</strong> weapon out of our
              <strong
                >$250B+ worth of RW Weapons and Armor! This includes over 400+ RW Weapons and Armors, 14 Red Warlord
                Weapons to share, 70% of all Gear is <span style="color: var(--te-text-color-orange);">Orange</span> or
                <span style="color: #f7335a;">Red</span>, Entirely FREE for You to Use!!<br /></strong></span
          ></span>
        </p>
        <p style="text-align: center;">&nbsp;</p>
        <p style="text-align: center;">
          <span style="font-size: 16px; color: #f7335a;"
            ><strong>We also offer the standard benefits you'd expect of a high-end faction:</strong></span
          >
        </p>
        <p style="text-align: center;">
          <span style="font-size: 18px;"
            ><span style="color: #f6ad2e;"><strong>Free Xanax and Refills for Wars</strong></span></span
          >
        </p>
        <p style="text-align: center;">
          <span style="font-size: 18px;"
            ><span style="color: #f6ad2e;"><strong>Faction Banking</strong></span></span
          >
        </p>
        <p style="text-align: center;">
          <span style="font-size: 18px;"
            ><span style="color: #f6ad2e;"><strong>Toleration</strong></span></span
          >
        </p>
        <p style="text-align: center;">
          <span style="font-size: 18px;"
            ><span style="color: #f6ad2e;"><strong>Criminality</strong></span></span
          >
        </p>
        <p style="text-align: center;">
          <span style="font-size: 18px;"
            ><span style="color: #f6ad2e;"><strong>Voracity</strong></span></span
          >
        </p>
        <p style="text-align: center;">
          <span style="font-size: 18px;"
            ><span style="color: #f6ad2e;"><strong>Steadfast</strong>&nbsp;</span></span
          >
        </p>
        <p style="text-align: center;">
          <span style="font-size: 18px;"
            ><span style="color: #f6ad2e;"><strong>Aggression</strong></span></span
          >
        </p>
        <p style="text-align: center;">
          <br /><span style="font-size: 16px; color: #f7335a;"
            >This includes Perks such as 15% Gym Gains rotated Monthly, +24 hour Booster CD, 50% Nerve from Alcohol and
            E-drinks, 50% Less Addiction, 40 Extra Nerve, 10+% Crime Exp Gains and More!!!<span style="color: #f7335a;"
              ><span style="color: #f6ad2e;"
                ><span style="color: #f7335a;"><br /></span></span></span
          ></span>
        </p>
        <p style="text-align: center;">&nbsp;</p>
        <p style="text-align: center;">
          <span style="font-size: 16px; color: #f7335a;"
            ><span style="color: #f7335a;"
              ><span style="color: #f6ad2e;"
                ><span style="color: #f7335a;"><br /></span></span></span></span
          ><span style="color: #f7335a; font-size: 12px;"
            ><strong
              ><em><span style="font-size: 16px;">What are the Requirements?</span></em></strong
            ></span
          >
        </p>
        <p style="text-align: center;">
          <span style="font-size: 12px;"
            ><span style="font-size: 16px; color: white;"
              >We are enforcing Strict Policies to ensure that you are only surrounded by likeminded players with a
              Strong Desire to be the Best! This means the following:<br /><strong
                ><span style="color: #f7335a;">Minimum 2.5 Xan AVG Daily<br /></span
                ><span style="color: #f7335a;">Average Playtime 1hr Per Day<br /></span></strong
              ><span style="font-size: 12px;"
                ><span style="font-size: 16px;"
                  ><strong><span style="color: #f7335a;">One Billion Stat Total </span></strong
                  ><span style="color: var(--te-text-color-pink);">(with exceptions)<br /></span></span></span
              ><span style="font-size: 12px;"
                ><span style="font-size: 16px;"
                  ><strong
                    ><span style="color: #f7335a;"
                      >Join the Family Discord and TornStats!<br />Above ALL else,
                      <span style="text-decoration: underline;">Have A Good Attitude</span>!!</span
                    ></strong
                  ></span
                ><span style="font-size: 10px;"
                  ><strong><br /></strong></span></span></span
          ></span>
        </p>
        <p style="text-align: center;">&nbsp;</p>
        <p style="text-align: center;">
          <span style="font-size: 12px;"
            ><span style="font-size: 16px;"
              ><span style="font-size: 12px;"
                ><span style="font-size: 10px;"
                  ><strong
                    ><br /><span style="font-size: 12px;"
                      ><em
                        ><span style="font-size: 16px; color: white;"
                          >If the <span style="color: #f7335a;">Luscious Family</span> sounds like the place for you,
                          please contact us and we will discuss you joining our ranks today!!<br /></span></em></span
                    ><span style="color: #f7335a; font-size: 12px;"
                      ><em
                        ><span style="font-size: 16px;"><br /></span></em></span
                    ><span style="font-size: 12px;"
                      ><span style="font-size: 16px;"
                        ><span style="font-size: 12px;"
                          ><span style="font-size: 10px;"
                            ><span style="font-size: 12px;"
                              ><em
                                ><span style="font-size: 16px; color: white;"
                                  >Contact our Leader
                                  <span style="text-decoration: underline; color: #009ffb;"
                                    ><a style="color: #009ffb;" href="/profiles.php?XID=2802242">Here</a></span
                                  >&nbsp;!</span
                                ></em
                              ></span
                            ><span style="color: #f7335a; font-size: 12px;"
                              ><em
                                ><span style="font-size: 16px;"
                                  ><span style="color: var(--te-text-color-violet);"
                                    ><br /></span></span></em></span></span></span></span></span
                    ><span style="font-size: 12px;"
                      ><span style="font-size: 16px;"
                        ><span style="font-size: 12px;"
                          ><span style="font-size: 10px;"
                            ><span style="font-size: 12px;"
                              ><span style="font-size: 16px;"
                                ><span style="font-size: 12px;"
                                  ><span style="font-size: 10px;"
                                    ><span style="font-size: 12px;"
                                      ><em
                                        ><span style="font-size: 16px; color: white;"
                                          >Or view the faction directly
                                          <span style="text-decoration: underline; color: #009ffb;"
                                            ><a
                                              style="color: #009ffb;"
                                              href="/factions.php?step=profile&amp;ID=7282&amp;referredFrom=2802242"
                                              >Here</a
                                            ></span
                                          >&nbsp;!<br />Join our Family Discord Server
                                          <span style="text-decoration: underline; color: #009ffb;"
                                            ><a style="color: #009ffb;" href="https://discord.gg/lusciousfamily style="
                                              >Here</a
                                            ></span
                                          >&nbsp;</span
                                        ></em
                                      ></span
                                    ></span
                                  ></span
                                ></span
                              ></span
                            ></span
                          ></span
                        ></span
                      ></span
                    ><span style="font-style: normal; font-size: 10px; line-height: inherit; font-family: Arial;"
                      ><span style="font-size: 12px; line-height: 14.4px;"
                        ><span style="font-size: 16px; line-height: 19.2px;"
                          ><span style="font-size: 12px; line-height: 14.4px;"
                            ><span style="font-size: 10px; line-height: 12px;"
                              ><span style="font-size: 12px; line-height: 14.4px;"
                                ><span style="font-size: 16px; line-height: 19.2px;"
                                  ><span style="font-size: 12px; line-height: 14.4px;"
                                    ><span style="font-size: 10px; line-height: 12px;"
                                      ><span style="font-size: 12px; line-height: 14.4px;"
                                        ><em
                                          ><span style="font-size: 16px; line-height: 19.2px;"
                                            ><span style="font-size: 12px; line-height: 14.4px;"
                                              ><span style="font-size: 16px; line-height: 19.2px;"
                                                ><span style="font-size: 12px; line-height: 14.4px;"
                                                  ><span style="font-size: 10px; line-height: 12px;"
                                                    ><span style="font-size: 12px; line-height: 14.4px;"
                                                      ><span style="font-size: 16px; line-height: 19.2px;"
                                                        ><span style="font-size: 12px; line-height: 14.4px;"
                                                          ><span style="font-size: 10px; line-height: 12px;"
                                                            ><span style="font-size: 12px; line-height: 14.4px;"
                                                              ><span style="font-size: 16px; line-height: 19.2px;"
                                                                ><span style="font-size: 12px; line-height: 14.4px;"
                                                                  ><span style="font-size: 10px; line-height: 12px;"
                                                                    ><span style="font-size: 12px; line-height: 14.4px;"
                                                                      ><span
                                                                        style="font-size: 16px; line-height: 19.2px; color: white;"
                                                                        >!</span
                                                                      ></span
                                                                    ></span
                                                                  ></span
                                                                ></span
                                                              ></span
                                                            ></span
                                                          ></span
                                                        ></span
                                                      ></span
                                                    ></span
                                                  ></span
                                                ></span
                                              ></span
                                            ></span
                                          ></em
                                        ></span
                                      ></span
                                    ></span
                                  ></span
                                ></span
                              ></span
                            ></span
                          ></span
                        ></span
                      ></span
                    ><span style="font-size: 12px;"
                      ><span style="font-size: 16px;"
                        ><span style="font-size: 12px;"
                          ><span style="font-size: 10px;"
                            ><span style="font-size: 12px;"
                              ><span style="font-size: 16px;"
                                ><span style="font-size: 12px;"
                                  ><span style="font-size: 10px;"
                                    ><span style="font-size: 12px;"
                                      ><em
                                        ><span style="font-size: 16px;"
                                          ><br /></span></em></span></span></span></span></span></span></span></span></span
                    ><span style="font-size: 32px; color: #f7335a;">We hope to see you soon!!</span></strong
                  ></span
                ></span
              ></span
            ></span
          >
        </p>
      </div>
    </div>
  </div>
</div>`;


    function modifyToolbarButton() {
        const toolbarButton = document.querySelector('.order2___TcFfn > .toolbarButton___dzcqX');
        if (!toolbarButton) {
            console.error('Toolbar button not found!');
            return;
        }

        toolbarButton.setAttribute('title', 'Click to insert Username, Player ID, Subject, and Message');
        toolbarButton.style.backgroundColor = 'red'; 
        toolbarButton.style.color = 'white';
        toolbarButton.style.border = '2px solid #fff';
        toolbarButton.style.cursor = 'pointer';

        toolbarButton.addEventListener('click', () => {

            const userIdInput = document.querySelector('.user-id');
            const subjectInput = document.querySelector('.subject');
            const messageArea = document.querySelector('.sourceArea___fQWHn');

            if (!userIdInput || !subjectInput || !messageArea) {
                alert('Required elements not found on the page!');
                return;
            }
            if (username != null) {
              userIdInput.value = `${username} [${playerId}]`;

            }

            subjectInput.value = subjectTitle;

            setTimeout(() => {
                const messageArea = document.querySelector('.sourceArea___fQWHn');
                messageArea.value = message;
            }, 100); // Delay to ensure the input fields are ready

           
        });
    }

    function initialize() {
        const observer = new MutationObserver(() => {
            const toolbarButton = document.querySelector('.order2___TcFfn');
            if (toolbarButton) {
                modifyToolbarButton();
                observer.disconnect(); 
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }


    function extractParamsFromUrl() {
        const url = new URL(window.location.href);
        const hashParams = new URLSearchParams(url.hash.replace('#/p=compose?', ''));

        const extractedUsername = hashParams.get('username');
        const extractedPlayerId = hashParams.get('playerID');

        if (extractedUsername && extractedPlayerId) {
            // console.log(`Extracted Username: ${extractedUsername}, Player ID: ${extractedPlayerId}`);
            username = extractedUsername;
            playerId = extractedPlayerId;
        } else {
            // console.warn('URL does not contain the required parameters: username and playerID.');
        }
    }

    function checkUrlAndInitialize() {
        extractParamsFromUrl();
        initialize();
    }
    checkUrlAndInitialize();

})();