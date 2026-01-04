// ==UserScript==
// @name         Reddit Political Lean Indicator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  automatically adds an l, r, or n next to a user's name based on political subreddit activity on old.reddit, colors the username (left=green, right=red, neoliberal=blue), caches results, and adds a tooltip with details.
// @author       greenwenvy
// @match        https://old.reddit.com/*
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/531297/Reddit%20Political%20Lean%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/531297/Reddit%20Political%20Lean%20Indicator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // caching political lean results so we don't fetch multiple times 
    const userLeanCache = {};

    // left-leaning subreddits
    const leftSubreddits = [
        'politics', 'leftistpolitics', 'democrats', 'liberal', 'berniesanders', 'worldnews', 'blacklivesmatter', 'progressive', 'socialism', 'greenparty', 'liberalworld', 'lgbt', 'antifascist', 'socialistra', 'theresistance', 'occupywallstreet', 'chapotraphouse', 'sandersforpresident', 'politicalrevolution', 'communism', 'anarchism', 'feminism', 'scienceandreason', 'historylessons', 'futurepolitics', 'internationalsocialism', 'leftpolitics', 'libertariansocialism', 'communist', 'socialistalliance', 'greennewdeal', 'liberalsofreddit', 'progressivepolitics', 'socialdemocracy', 'socialistfeminism', 'socialjustice', 'anarchocommunism', 'transrights', 'anticapitalist', 'antiimperialism', 'globaljustice', 'climateaction', 'ecosocialism', 'leftypolitics', 'prochoice', 'antiausterity', 'abolishice', 'medicareforall', 'antiracism', 'union', 'workersrights', 'laborrights', 'humanrights', 'equalrights', 'fairwages', 'incomeinequality', 'stopthepatriarchy',
        'leftist', 'democraticsocialism', 'antiwork', 'latestagecapitalism', 'askaliberal', 'defundthepolice', 'workersunite', 'modernsocialism', 'marxism', 'feminists', 'leftwing', 'socialismmemes', 'revolutionarycommunism', 'socialism_101', 'economicjustice', 'progressiveleft', 'laborunite', 'politicalleft', 'wearetheunion', 'feministpolitics',
        'marxists', 'peoplesmovement', 'leftistdiscussion', 'antifascismnow', 'socialistindependence', 'socialism101', 'marxistleninism', 'classstruggle', 'prosocialism', 'labormovement', 'radicalsocialism', 'secularleft', 'antiwarleft', 'leftistmemes', 'socialistactivism', 'socialistfuture', 'leftanalysis', 'socialistdreams', 'justiceforall', 'prosocialist', 'progressivestruggle', 'equityforall', 'queerleftists', 'ecoeconomics', 'socialistrevolution', 'secularprogressives', 'postcapitalism', 'marxistsocialism', 'anticapitalistsunite', 'radicaltransformation', 'anticapitalistmovement', 'workingclasspolitics', 'revolutionarymarxists', 'antifascismdiscussion', 'reformpolitics', 'libertarianleft', 'anticapitalistmemes', 'workingclassunity', 'marxistcommunism', 'politicalaction', 'redmarxism', 'greenleft', 'sosocialism', 'movementsforchange', 'socialistgathering', 'actionforyourrights', 'radicalleft', 'openleftism'
    ];

    // right-leaning subreddits
    const rightSubreddits = [
        'conservative', 'the_donald', 'republican', 'ask_conservatives', 'guns', 'libertarian', 'r_conservative', 'christianconservative', 'trump', 'patriot', 'libertarianism', 'conservatism', 'ask_libertarians', 'truelibertarian', 'republican_party', 'trumpsupporters', 'progun', 'altright', 'westernculture', 'maga', 'conservativechristian', 'conservativewomen', 'trumpism', 'liberty', 'freespeech', 'teaparty', 'antisocialism', 'anarchy', 'protrump', 'patriotfront', 'hardright', 'rightwing', 'libertariansunite', 'republicansfortrump', 'traditionalist', 'conservativevoice', 'rightwingpolitics', 'libertarianismforall', 'secondamendment', 'trump2024', 'patriotism', 'constitution', 'libertarianparty', 'deplorables', 'rightwingnews', 'nationalism', 'libertarianright', 'theconservativetreehouse', 'coldwarhistory', 'conservativefeminists', 'moderaterepublicans', 'neoconservatism', 'traditionalvalues', 'fiscalconservatives', 'conservativeeconomics', 'righttoarms', 'righttolife', 'propolice', 'prolawenforcement', 'veteransfortrump', 'christianvalues', 'rightwingmedia', 'bluecollarconservatism',
        'conservatives', 'politicallyincorrect', 'redpill', 'askarightwing', 'maga2024', 'draintheswamp', 'conservativememes', 'republicanmemes', 'trueconservative', 'modernconservatism', 'maleconservatives', 'conservativehumor', 'conservativenews', 'askaright', 'rightwingmemes', 'antiliberal', 'traditionalconservatives', 'libertarianconservative', 'conservative101', 'conservativetalk',
        'conservativepolitics', 'conservativeideas', 'republicanlife', 'libertarianpolitics', 'conservativevalues', 'rightwingaction', 'rightwingnetwork', 'traditionaltalk', 'rightwingrevolution', 'patriotnetwork', 'conservativeissues', 'republicannews', 'trumpnation', 'freespeechforall', 'conservativeamerica', 'libertyforall', 'trueamericanpatriots', 'thepatriots', 'rightwingmovement', 'rightwingvalues', 'redstateamerica', 'conservativeresistance', 'freeusafirst', 'capitalismstrong', 'voterintegrity', 'thedonaldreborn', 'stoptheleft', 'keepamericaalive', 'realamericanpolitics', 'conservativeunity', 'libertarianism101', 'proamerica', 'conservativejustice', 'patriotamerican', 'conservativepost', 'realdonaldtrumpfans', 'patriotfight', 'magaamerica', 'voteforfreedom', 'freedomforall', 'rightwingrecovery', 'myrighttoconscious', 'americanminds', 'truthmatters'
    ];

    // neoliberal subreddits
    const neoliberalSubreddits = [
        'neoliberal', 'neoliberalism', 'marketlibertarian', 'neoliberaleconomicpolicy', 'freemarkets', 'capitalism', 'liberaleconomics', 'globalization', 'profreemarket', 'fiscalconservatism', 'laissefaireeconomics', 'capitalistsociety', 'freemarketcapitalism', 'neoliberalpolitico', 'globalcapitalism', 'neoliberalpolicy', 'marketsarefree', 'globallibertarianism', 'neoliberalthinkers', 'freemarketdebate', 'neoliberalgovernance', 'neoliberaldebate', 'freetradeeconomics', 'capitalistdebate', 'economicliberalism', 'liberalcapitalism', 'capitalismdebate', 'freemarketsforall', 'proglobalization', 'libertarianeconomics', 'liberalizedmarkets', 'marketdrivensociety', 'neoliberalperspectives', 'globaleconomicpolicy', 'marketsociety', 'globalfreemarket', 'freemarketdemocracy', 'neoliberaldebates', 'progressivecapitalism', 'moderncapitalism', 'marketsystems', 'capitalismdebates', 'globalmarketideas', 'competitivecapitalism', 'economicglobalization', 'privatesectorgrowth', 'capitalinvestment', 'freeenterprise',
        'neoliberalmemes', 'freemarket101', 'marketfundamentalism', 'economicsdebate', 'globalcapitalists', 'neoliberalliberalism', 'liberalmarkets', 'economicpolicythinkers', 'economicreforms', 'proeconomicgrowth', 'capitalistthinking', 'capitalismdebates', 'economictransformation', 'progressivefreemarkets', 'neoliberalfuture', 'freeentrepreneurship', 'businessliberalism', 'globalfreemarketplace', 'globalexpansionists', 'marketliberalthinkers',
        'privatizationpolicy', 'economicgrowthstrategies', 'economicliberaltheories', 'entrepreneurialcapitalism', 'globaleconomicliberalism', 'modernliberaleconomics', 'marketfoundations', 'globalpolicydebate', 'europeanmarketliberalism', 'capitalismstrong', 'privatemarketforces', 'globaltradepolicy', 'freeenterprisecommunity', 'worldmarketliberalism', 'neoliberalconservatism', 'politicaleconomicsdebate', 'futureofglobalization', 'neoliberalexpansion', 'privatizedeconomy', 'capitalistreform', 'socialdemocracymarket', 'economicliberalreforms', 'neoliberalism101', 'advancedcapitalism', 'neoliberalismdebates', 'economicfreeenterprise', 'liberalcapitalismdebates', 'freeenterprisefuture', 'globalizedeconomicpolicy', 'capitalistmovement', 'neoliberalpoliticsdebate', 'privatizeorreform', 'futuristcapitalism', 'economicsandmarket', 'proliberalreforms', 'capitalistdiscourse', 'businessandcapitalism', 'privatizationofthefuture', 'marketdynamicthinking', 'freecapitalistsociety', 'economicliberalnetwork', 'neoliberalexpansionism', 'capitalistreformation'
    ];

    // function to check a user's political lean based on their submission history
    function checkPoliticalLean(user, usernameElement) {
        // if already cached, use that data!
        if (userLeanCache[user]) {
            applyPoliticalStyle(userLeanCache[user], usernameElement);
            return;
        }

        const userProfileLink = `https://old.reddit.com/user/${user}/submitted/`;
        fetch(userProfileLink)
            .then(response => response.text())
            .then(pageContent => {
                const content = pageContent.toLowerCase();
                const matchedLeft = leftSubreddits.filter(sub => content.includes(`/r/${sub.toLowerCase()}/`));
                const matchedRight = rightSubreddits.filter(sub => content.includes(`/r/${sub.toLowerCase()}/`));
                const matchedNeoliberal = neoliberalSubreddits.filter(sub => content.includes(`/r/${sub.toLowerCase()}/`));

                let politicalLabel = '';
                let detail = '';
                if (matchedLeft.length) {
                    politicalLabel = 'l';
                    detail = 'left: ' + matchedLeft.join(', ');
                } else if (matchedRight.length) {
                    politicalLabel = 'r';
                    detail = 'right: ' + matchedRight.join(', ');
                } else if (matchedNeoliberal.length) {
                    politicalLabel = 'n';
                    detail = 'neoliberal: ' + matchedNeoliberal.join(', ');
                }

                // cache result so we don't re-fetch for this user
                userLeanCache[user] = { politicalLabel, detail };
                applyPoliticalStyle(userLeanCache[user], usernameElement);
            })
            .catch(error => console.error('error fetching user profile:', error));
    }

    // function to apply style based on political lean
    function applyPoliticalStyle(data, usernameElement) {
        const { politicalLabel, detail } = data;
        if (politicalLabel) {
            // assign color based on lean: left=green, right=red, neoliberal=blue
            if (politicalLabel === 'l') {
                usernameElement.style.color = 'green';
            } else if (politicalLabel === 'r') {
                usernameElement.style.color = 'red';
            } else if (politicalLabel === 'n') {
                usernameElement.style.color = 'blue';
            }

            // add indicator label if not present
            if (!usernameElement.querySelector('.political-label')) {
                const label = document.createElement('span');
                label.classList.add('political-label');
                label.style.marginLeft = '5px';
                label.style.color = 'gray';
                label.textContent = politicalLabel.toUpperCase();
                usernameElement.appendChild(label);
            }

            // add tooltip with detailed info
            usernameElement.title = 'political lean: ' + detail;
        }
    }

    // automatically check political lean for all username elements on page load
    function autoCheckUsernames() {
        const usernames = document.querySelectorAll('.author');
        usernames.forEach(usernameElement => {
            const username = usernameElement.textContent.trim();
            if (username) {
                checkPoliticalLean(username, usernameElement);
            }
        });
    }

    window.addEventListener('load', autoCheckUsernames);
})();