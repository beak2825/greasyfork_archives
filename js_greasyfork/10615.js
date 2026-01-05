// ==UserScript==
// @name        HIT Scraper WITH EXPORT
// @author      feihtality
// @description Snag HITs. mturk.
// @namespace   https://greasyfork.org/en/users/12709
// @include     /^https://w(ww|orker).mturk.com/.*hit[-_]?scraper$/
// @version     4.1.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10615/HIT%20Scraper%20WITH%20EXPORT.user.js
// @updateURL https://update.greasyfork.org/scripts/10615/HIT%20Scraper%20WITH%20EXPORT.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const ENV = Object.freeze({
                              LEGACY : 'www.mturk.com',
                              NEXT   : 'worker.mturk.com',
                              HOST   : window.location.hostname,
                              ORIGIN : window.location.origin,
                              ISFF   : Boolean(window.sidebar),
                              VERSION: '4.1.4'
                            });
  const URL_SELF = 'https://greasyfork.org/en/scripts/10615-hit-scraper-with-export#ugTop';
  const DOC_TITLE = 'HIT Scraper';
  const TO_BASE = 'https://turkopticon.ucsd.edu/';
  const TO_REPORTS = TO_BASE + 'reports?id=';
  const TO_API = TO_BASE + 'api/multi-attrs.php?ids=';

  const ico         = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wsTDwctGwJAtQAAAYRJREFUOMudkz1rWmEUx3/6gFeC1A5p6RJByGTGTpEM3iHfwMmxfggH1yyB69BFyFAy5FIQ6wdw9CVxUOhQXFykYFcTLvEaiuafQU0wXoPkwIHnOS8/znPOeWAh18AU0I7qA61lLjfbAl3X1Ww2k+u620AtgP9BTsdx1O/3lUqlNBgM5DhOEGAaWh7eLeEgYywWo1QqMRwO8X2fdrtNsVjcCtkorVKpSJKy2awsy1Imk1Gv19vWh02j53mSpHQ6vctENo2dTkcrGY/HqlarSiaTuwMSiYRqtZomk8kzqNvt7g5YqTFGtm1LkjzPC4wJnEKz2cS2bSKRCMYYAOr1+htTCFtr1EKhoEajId/3NRqNVC6XFY/HF/69LyKfE9bivlikfA72D+H8DHh8e3PyOfAMfJjDj58YoMjvP4bQPVz9g4MU7Ifh7y2EDJgoHB/BqQ3fLuDzAdz14fIXaP6w+okvT8jnRFub+r0mTr6+bmJzVVgLmKw5w1ER/SQiH4O6fw80AJ4AC20qRDxx28IAAAAASUVORK5CYII=',
      audio0      = 'T2dnUwACAAAAAAAAAAB8mpoRAAAAAFLKt9gBHgF2b3JiaXMAAAAAARErAAAAAAAAkGUAAAAAAACZAU9nZ1MAAAAAAAAAAAAAfJqaEQEAAACHYsq6Cy3///////////+1A3ZvcmJpcx0AAABYaXBoLk9yZyBsaWJWb3JiaXMgSSAyMDA1MDMwNAAAAAABBXZvcmJpcxJCQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBADIAAAYhiGH3knMkFOQSSYpVcw5CKH1DjnlFGTSUsaYYoxRzpBTDDEFMYbQKYUQ1E45pQwiCENInWTOIEs96OBi5zgQGrIiAIgCAACMQYwhxpBzDEoGIXKOScggRM45KZ2UTEoorbSWSQktldYi55yUTkompbQWUsuklNZCKwUAAAQ4AAAEWAiFhqwIAKIAABCDkFJIKcSUYk4xh5RSjinHkFLMOcWYcowx6CBUzDHIHIRIKcUYc0455iBkDCrmHIQMMgEAAAEOAAABFkKhISsCgDgBAIMkaZqlaaJoaZooeqaoqqIoqqrleabpmaaqeqKpqqaquq6pqq5seZ5peqaoqp4pqqqpqq5rqqrriqpqy6ar2rbpqrbsyrJuu7Ks256qyrapurJuqq5tu7Js664s27rkearqmabreqbpuqrr2rLqurLtmabriqor26bryrLryratyrKua6bpuqKr2q6purLtyq5tu7Ks+6br6rbqyrquyrLu27au+7KtC7vourauyq6uq7Ks67It67Zs20LJ81TVM03X9UzTdVXXtW3VdW1bM03XNV1XlkXVdWXVlXVddWVb90zTdU1XlWXTVWVZlWXddmVXl0XXtW1Vln1ddWVfl23d92VZ133TdXVblWXbV2VZ92Vd94VZt33dU1VbN11X103X1X1b131htm3fF11X11XZ1oVVlnXf1n1lmHWdMLqurqu27OuqLOu+ruvGMOu6MKy6bfyurQvDq+vGseu+rty+j2rbvvDqtjG8um4cu7Abv+37xrGpqm2brqvrpivrumzrvm/runGMrqvrqiz7uurKvm/ruvDrvi8Mo+vquirLurDasq/Lui4Mu64bw2rbwu7aunDMsi4Mt+8rx68LQ9W2heHVdaOr28ZvC8PSN3a+AACAAQcAgAATykChISsCgDgBAAYhCBVjECrGIIQQUgohpFQxBiFjDkrGHJQQSkkhlNIqxiBkjknIHJMQSmiplNBKKKWlUEpLoZTWUmotptRaDKG0FEpprZTSWmopttRSbBVjEDLnpGSOSSiltFZKaSlzTErGoKQOQiqlpNJKSa1lzknJoKPSOUippNJSSam1UEproZTWSkqxpdJKba3FGkppLaTSWkmptdRSba21WiPGIGSMQcmck1JKSamU0lrmnJQOOiqZg5JKKamVklKsmJPSQSglg4xKSaW1kkoroZTWSkqxhVJaa63VmFJLNZSSWkmpxVBKa621GlMrNYVQUgultBZKaa21VmtqLbZQQmuhpBZLKjG1FmNtrcUYSmmtpBJbKanFFluNrbVYU0s1lpJibK3V2EotOdZaa0ot1tJSjK21mFtMucVYaw0ltBZKaa2U0lpKrcXWWq2hlNZKKrGVklpsrdXYWow1lNJiKSm1kEpsrbVYW2w1ppZibLHVWFKLMcZYc0u11ZRai621WEsrNcYYa2415VIAAMCAAwBAgAlloNCQlQBAFAAAYAxjjEFoFHLMOSmNUs45JyVzDkIIKWXOQQghpc45CKW01DkHoZSUQikppRRbKCWl1losAACgwAEAIMAGTYnFAQoNWQkARAEAIMYoxRiExiClGIPQGKMUYxAqpRhzDkKlFGPOQcgYc85BKRljzkEnJYQQQimlhBBCKKWUAgAAChwAAAJs0JRYHKDQkBUBQBQAAGAMYgwxhiB0UjopEYRMSielkRJaCylllkqKJcbMWomtxNhICa2F1jJrJcbSYkatxFhiKgAA7MABAOzAQig0ZCUAkAcAQBijFGPOOWcQYsw5CCE0CDHmHIQQKsaccw5CCBVjzjkHIYTOOecghBBC55xzEEIIoYMQQgillNJBCCGEUkrpIIQQQimldBBCCKGUUgoAACpwAAAIsFFkc4KRoEJDVgIAeQAAgDFKOSclpUYpxiCkFFujFGMQUmqtYgxCSq3FWDEGIaXWYuwgpNRajLV2EFJqLcZaQ0qtxVhrziGl1mKsNdfUWoy15tx7ai3GWnPOuQAA3AUHALADG0U2JxgJKjRkJQCQBwBAIKQUY4w5h5RijDHnnENKMcaYc84pxhhzzjnnFGOMOeecc4wx55xzzjnGmHPOOeecc84556CDkDnnnHPQQeicc845CCF0zjnnHIQQCgAAKnAAAAiwUWRzgpGgQkNWAgDhAACAMZRSSimllFJKqKOUUkoppZRSAiGllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimVUkoppZRSSimllFJKKaUAIN8KBwD/BxtnWEk6KxwNLjRkJQAQDgAAGMMYhIw5JyWlhjEIpXROSkklNYxBKKVzElJKKYPQWmqlpNJSShmElGILIZWUWgqltFZrKam1lFIoKcUaS0qppdYy5ySkklpLrbaYOQelpNZaaq3FEEJKsbXWUmuxdVJSSa211lptLaSUWmstxtZibCWlllprqcXWWkyptRZbSy3G1mJLrcXYYosxxhoLAOBucACASLBxhpWks8LR4EJDVgIAIQEABDJKOeecgxBCCCFSijHnoIMQQgghREox5pyDEEIIIYSMMecghBBCCKGUkDHmHIQQQgghhFI65yCEUEoJpZRSSucchBBCCKWUUkoJIYQQQiillFJKKSGEEEoppZRSSiklhBBCKKWUUkoppYQQQiillFJKKaWUEEIopZRSSimllBJCCKGUUkoppZRSQgillFJKKaWUUkooIYRSSimllFJKCSWUUkoppZRSSikhlFJKKaWUUkoppQAAgAMHAIAAI+gko8oibDThwgMQAAAAAgACTACBAYKCUQgChBEIAAAAAAAIAPgAAEgKgIiIaOYMDhASFBYYGhweICIkAAAAAAAAAAAAAAAABE9nZ1MABAgkAAAAAAAAfJqaEQIAAAB89IOyJjhEQUNNRE5TRENHS0xTRllHSEpISUdORk1GSEdISUNHP0ZHS1IhquPYHv5OAgC/7wFATp2pUBdX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',
      /*'*/
      audio1      = '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VVVVVVVVVVVVVQBqs0jMnBWmgKng1FRU32lmZmb+N6/V+w+MygnAXTBSU3/Ffjw4KGwvhYijgbg038TRQL8U3//xv5cO4FZf/z8bdj8V3CpuILkwNl5P8KE+53G3eCoQUAIQxdpeAGCps5MdqtGpNehUFBQFS2qx1bDEzNSDATAKKlIBjsJGEQBFZnmMUrStzKW+pXKVDOZ+hnQ2jloarUNK2iGVjPlUVcHRF4NCI9e2HcNCJ4NQ0eEQlnbmh0FYaUxBTUUzLjk5LjNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7kkScD/K0GL+QyBnCYEgHsjBlXAAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';

  let scraperHistory;
  const defaults    = { //{{{
        themes    : {//{{{
          whisper : {
            highlight   : '#1F3847',
            background  : '#232A2F',
            accent      : '#00ffff',
            bodytable   : '#AFCCDE',
            cpBackground: '#394752',
            toHigh      : '#009DFF',
            toGood      : '#40B6FF',
            toAverage   : '#7ACCFF',
            toLow       : '#B5E3FF',
            toPoor      : '#DEF1FC',
            hitDB       : '#CADA95',
            nohitDB     : '#DA95A8',
            unqualified : '#808080',
            reqmaster   : '#C1E1F6',
            nomaster    : '#D6C1F6',
            defaultText : '#AFCCDE',
            inputText   : '#98D6D6',
            secondText  : '#808080',
            link        : '#003759',
            vlink       : '#40F0F0',
            toNone      : '#AFCCDE',
            export      : '#86939C',
            hover       : '#1E303B'
          },
          solDark : {
            highlight   : '#657b83',
            background  : '#002b36',
            accent      : '#b58900',
            bodytable   : '#839496',
            cpBackground: '#073642',
            toHigh      : '#859900',
            toGood      : '#A2BA00',
            toAverage   : '#b58900',
            toLow       : '#cb4b16',
            toPoor      : '#dc322f',
            hitDB       : '#82D336',
            nohitDB     : '#D33682',
            unqualified : '#9F9F9F',
            reqmaster   : '#B58900',
            nomaster    : '#839496',
            defaultText : '#839496',
            inputText   : '#eee8d5',
            secondText  : '#93a1a1',
            link        : '#000000',
            vlink       : '#6c71c4',
            toNone      : '#839496',
            export      : '#CCC6B4',
            hover       : '#122A30'
          },
          solLight: {
            highlight   : '#657b83',
            background  : '#fdf6e3',
            accent      : '#b58900',
            bodytable   : '#657b83',
            cpBackground: '#eee8d5',
            toHigh      : '#859900',
            toGood      : '#A2BA00',
            toAverage   : '#b58900',
            toLow       : '#cb4b16',
            toPoor      : '#dc322f',
            hitDB       : '#82D336',
            nohitDB     : '#36D0D3',
            unqualified : '#9F9F9F',
            reqmaster   : '#B58900',
            nomaster    : '#6C71C4',
            defaultText : '#657b83',
            inputText   : '#6FA3A3',
            secondText  : '#A6BABA',
            link        : '#000000',
            vlink       : '#6c71c4',
            toNone      : '#657b83',
            export      : '#000000',
            hover       : '#C7D2D6'
          },
          classic : {
            highlight   : '#30302F',
            background  : '#131313',
            accent      : '#94704D',
            bodytable   : '#000000',
            cpBackground: '#131313',
            toHigh      : '#66CC66',
            toGood      : '#ADFF2F',
            toAverage   : '#FFD700',
            toLow       : '#FF9900',
            toPoor      : '#FF3030',
            hitDB       : '#66CC66',
            nohitDB     : '#FF3030',
            unqualified : '#9F9F9F',
            reqmaster   : '#551A8B',
            nomaster    : '#0066CC',
            defaultText : '#94704D',
            inputText   : '#000000',
            secondText  : '#997553',
            link        : '#0000FF',
            vlink       : '#800080',
            toNone      : '#d3d3d3',
            export      : '#000000',
            hover       : '#21211F'
          },
          deluge  : {
            highlight   : '#1F3847',
            background  : '#434e56',
            accent      : '#fbde2d',
            bodytable   : '#f8f8f8',
            cpBackground: '#384147',
            toHigh      : '#6FFA3C',
            toGood      : '#D9FC35',
            toAverage   : '#fbde2d',
            toLow       : '#FAB050',
            toPoor      : '#FA6F50',
            hitDB       : '#d8fa3c',
            nohitDB     : '#DA95A8',
            unqualified : '#ADC6EE',
            reqmaster   : '#BFADEE',
            nomaster    : '#ADEEDF',
            defaultText : '#f8f8f8',
            inputText   : '#D8FA3C',
            secondText  : '#ADC6EE',
            link        : '#99004F',
            vlink       : '#DCEEAD',
            toNone      : '#97A167',
            export      : '#ADC6EE',
            hover       : '#426075'
          }
        },//}}}
        vbTemplate: '[table][tr][td][b]Title:[/b] [URL=${previewLink}]${title}[/URL] | [URL=${pandaLink}]PANDA[/URL]\n' +
                    '[b]Requester:[/b] [URL=${requesterLink}]${requesterName}[/URL] [${requesterId}] ' +
                    '([URL=' + TO_REPORTS + '${requesterId}]TO[/URL])\n' +
                    '[b]TO Ratings:[/b]\n${toVerbose}\n${toFoot}\n' +
                    '[b]Description:[/b] ${description}\n[b]Time:[/b] ${time}\n[b]HITs Available:[/b] ${numHits}\n' +
                    '[b]Reward:[/b] [COLOR=green][b]${reward}[/b][/COLOR]\n' +
                    '[b]Qualifications:[/b] ${quals}[/td][/tr][/table]'
      },//}}}

      Settings    = {//{{{
        defaults      : {//{{{
          themes        : { name: 'classic', colors: defaults.themes },
          colorType     : 'sim',
          sortType      : 'adj',
          toWeights     : { comm: '1', pay: '3', fair: '3', fast: '1' },
          exportVb      : true,
          exportIrc     : true,
          exportHwtf    : true,
          notifySound   : [false, 'ding'],
          notifyBlink   : false,
          notifyTaskbar : false,
          volume        : { ding: 1, squee: 1 },
          wildblocks    : true,
          showCheckboxes: true,
          hitColor      : 'link',
          fontSize      : 11,
          shineOffset   : 1,

          refresh       : '0',
          pages         : '1',
          skips         : false,
          resultsPerPage: '50',
          batch         : '',
          pay           : '',
          qual          : true,
          monly         : false,
          mhide         : false,
          searchBy      : 0,
          invert        : false,
          shine         : '300',
          minTOPay      : '',
          hideNoTO      : false,
          onlyViable    : false,
          disableTO     : false,
          sortPay       : false,
          sortAll       : false,
          search        : '',
          hideBlock     : true,
          onlyIncludes  : false,
          shineInc      : true,
          sortAsc       : false,
          sortDsc       : true,
          gbatch        : false,
          bubbleNew     : false,

          vbTemplate: defaults.vbTemplate,
          vbSym     : '\u2605' // star
        },//}}}
        user: {}, save: function() { localStorage.setItem('scraper_settings', JSON.stringify(this.user)); },
        draw          : function() {//{{{
          var
            _ccs        = 'https://greasyfork.org/en/scripts/3118-mmmturkeybacon-color-coded-search-with-checkpoints',
            _hwtf       = 'https://www.reddit.com/r/HITsWorthTurkingFor',
            _general    = //{{{
              `<div>
             <div style="float:left; margin-left:15px">
              <span style="position:relative; left:-8px"><b>Export Buttons</b></span>
              <p><label for="exportVb" style="float:left; width:51px">vBulletin</label>
              <input id="exportVb" name="export" value="vb" type="checkbox" ${this.user.exportVb ? 'checked' : ''}/></p>
              <p><label for="exportIrc" style="float:left; width:51px">IRC</label>
              <input id="exportIrc" name="export" value="irc" type="checkbox" ${this.user.exportIrc ? 'checked' : ''}/></p>
              <p><label for="exportHwtf" style="float:left; width:51px">Reddit</label>
              <input id="exportHwtf" name="export" value="hwtf" type="checkbox" ${this.user.exportHwtf ? 'checked' : ''}/></p>
             </div>
             <section style="margin-left:110px">
              <span style="position:relative; left:10px"><i>vBulletin</i></span><br>
              Show a button in the results to export the specified HIT with vBulletin formatted text to share on forums.
             </section><section style="margin-left:110px">
              <span style="position:relative; left:10px"><i>IRC</i></span><br>
              Show a button in the results to export the specified HIT streamlined for sharing on IRC.
             </section><section style="margin-left:110px">
              <span style="position:relative; left:10px"><i>Reddit</i></span><br>
              Show a button in the results to export the specified HIT for sharing on Reddit, formatted to 
              <a style="color:black" href="${_hwtf}" target="_blank">r/HITsWorthTurkingFor</a> standards.
             </section>
            </div><div>
              <div style="float:left; margin-left:15px">
               <span style="position:relative; left:-8px"><b>Bubble New HITs</b></span>
               <p><label for="bubbleNew" style="float:left; width:51px">Enable</label>
               <input id="bubbleNew" type="checkbox" ${this.user.bubbleNew ? 'checked' : ''}></p>
              </div>
              <section style="margin-left:100px; margin-top:23px">
               When this option is enabled, new HITs will always be placed at the top of the results table.
              </section>
            </div><div>
             <div style="float:left; margin-left:15px">
              <span style="position:relative; left:-8px"><b>Color Type</b></span>
              <p><label for="ctSim" style="float:left; width:51px">Simple</label>
              <input id="ctSim" type="radio" name="colorType" value="sim" 
                ${this.user.colorType === 'sim' ? 'checked' : ''}/></p>
              <p><label for="ctAdj" style="float:left; width:51px">Adjusted</label>
              <input id="ctAdj" type="radio" name="colorType" value="adj" 
                ${this.user.colorType === 'adj' ? 'checked' : ''}/></p>
             </div>
             <section style="margin-left:100px">
              <span style="position:relative; left:10px"><i>simple</i></span><br>HIT Scraper will use a simple weighted average to 
              determine the overall TO rating and colorize results using that value. Use this setting to make coloring consistent between 
              HIT Scraper and <a style="color:black" href="${_ccs}" target="_blank">Color Coded Search</a>.
             </section><section style="margin-left:100px">
              <span style="position:relative; left:10px;"><i>adjusted</i></span><br>HIT Scraper will calculate a Bayesian adjusted average 
              based on confidence of the TO rating to colorize results. Confidence is proportional to the number of reviews.
             </section>
            </div><div>
             <div style="float:left; margin-left:15px">
              <span style="position:relative; left:-8px"><b>Sort Type</b></span>
              <p><label for="stSim" style="float:left; width:51px">Simple</label>
              <input id="stSim" type="radio" name="sortType" value="sim" 
                ${this.user.sortType === 'sim' ? 'checked' : ''}/></p>
              <p><label for="stAdj" style="float:left; width:51px">Adjusted</label>
              <input id="stAdj" type="radio" name="sortType" value="adj" 
                ${this.user.sortType === 'adj' ? 'checked' : ''}/></p>
             </div>
             <section style="margin-left:100px">
              <span style="position:relative; left:10px"><i>simple</i></span><br>
              HIT Scraper will sort results based simply on value regardless of the number of reviews.
             </section><section style="margin-left:100px">
              <span style="position:relative; left:10px;"><i>adjusted</i></span><br>HIT Scraper will use a Bayesian adjusted rating 
              based on reliability (i.e. confidence) of the data. It factors in the number of reviews such that, for example, 
              a requester with 100 reviews rated at 4.6 will rightfully be ranked higher than a requester with 3 reviews rated at 5.
              This gives a more accurate representation of the data.
             </section>
            </div><div>
             <div style="float:left; margin-left:15px">
              <span style="position:relative; left:-8px"><b>Alert Volume</b></span>
              <p><label style="float:left;width:45px">Ding</label>
              <input name="ding" type="range" value=${this.user.volume.ding} max="1" step="0.02" min="0" />
              <span style="padding-left:10px">${Math.floor(this.user.volume.ding * 100)}%</span></p>
              <p><label style="float:left;width:45px">Squee</label>
              <input name="squee" type="range" value=${this.user.volume.squee} max="1" step="0.02" min="0" />
              <span style="padding-left:10px">${Math.floor(this.user.volume.squee * 100)}%</span></p>
             </div>
            </div><div>
             <div style="float:left; margin-left:15px">
              <span style="position:relative; left:-8px"><b>TO Weighting</b></span>
              <p><label for="comm" style="float:left; width:45px">comm</label>
              <input id="comm" type="number" name="TOW" min="1" max="10" step="0.5" value=${this.user.toWeights.comm} style="width:40px"/></p>
              <p><label for="pay" style="float:left; width:45px">pay</label>
              <input id="pay" type="number" name="TOW" min="1" max="10" step="0.5" value=${this.user.toWeights.pay} style="width:40px"/></p>
              <p><label for="fair" style="float:left; width:45px">fair</label>
              <input id="fair" type="number" name="TOW" min="1" max="10" step="0.5" value=${this.user.toWeights.fair} style="width:40px"/></p>
              <p><label for="fast" style="float:left; width:45px">fast</label>
              <input id="fast" type="number" name="TOW" min="1" max="10" step="0.5" value=${this.user.toWeights.fast} style="width:40px"/></p>
             </div>
             <section style="margin-left:110px; padding:10px">
              Specify weights for TO attributes to place greater importance on certain attributes over others.
              <p>The default values, [1, 3, 3, 1], ensure consistency between HIT Scraper and 
              <a style="color:black" href="${_ccs}" target="_blank">Color Coded Search</a>; 
               recommended values for adjusted coloring are [1, 6, 3.5, 1].</p>
             </section>
            </div>`,//}}}
            _appearance =//{{{
              `<div>
             <div style="float:left; margin-left:15px">
              <span style="position:relative;left:-8px"><b>Display Checkboxes</b></span>
              <p><label for="checkshow" style="float:left;width:51px">Show</label>
              <input id="checkshow" type="radio" name="checkbox" value="true" 
                ${this.user.showCheckboxes ? 'checked' : ''} /></p>
              <p><label for="checkhide" style="float:left;width:51px">Hide</label>
              <input id="checkhide" type="radio" name="checkbox" value="false" 
                ${this.user.showCheckboxes ? '' : 'checked'} /></p>
             </div>
             <section style="margin-left:133px">
              <span style="position:relative;left:10px"><i>show</i></span><br>
              Shows all checkboxes and radio inputs on the control panel for sake of clarity.
             </section><section style="margin-left:133px">
              <span style="position:relative;left:10px"><i>hide</i></span><br>
              Hides checkboxes and radio inputs for a cleaner, neater appearance. Their visibility is not required for proper 
              operation; all options can still be toggled while hidden.
             </section>
            </div><div>
             <div style="float:left;margin-left:15px">
              <span style="position:relative;left:-8px"><b>Themes</b></span>
              <p><select>
               <option value="classic" ${this.user.themes.name === 'classic' ? 'selected' : ''}>Classic</option>
               <option value="deluge" ${this.user.themes.name === 'deluge' ? 'selected' : ''}>Deluge</option>
               <option value="solDark" ${this.user.themes.name === 'solDark' ? 'selected' : ''}>Solarium:Dark</option>
               <option value="solLight" ${this.user.themes.name === 'solLight' ? 'selected' : ''}>Solarium:Light</option>
               <option value="whisper" ${this.user.themes.name === 'whisper' ? 'selected' : ''}>Whisper</option>` +
              //<option value="random" ${this.user.themes.name === 'random' ? 'selected' : ''}>I'm Feelin'
              // Lucky!</option>
              `</select> <button id="thedit" style="cursor:pointer">Edit Current Theme</button></p>
             </div>
            </div><div>
             <div style="float:left;margin-left:15px">
              <span style="position:relative;left:-8px"><b>HIT Coloring</b></span>
              <p><label for="link" style="float:left;width:51px">Link</label>
              <input id="link" type="radio" name="hitColor" value="link" 
                ${this.user.hitColor === 'link' ? 'checked' : ''} /></p>
              <p><label for="cell" style="float:left;width:51px">Cell</label>
              <input id="cell" type="radio" name="hitColor" value="cell" 
                ${this.user.hitColor === 'cell' ? 'checked' : ''} /></p>
             </div>
             <section style="margin-left:100px;padding-top:10px">
              <span style="position:relative;left:10px"><i>link</i></span><br>
              Apply coloring based on Turkopticon reviews to all applicable links in the results table.
             </section><section style="margin-left:100px">
              <span style="position:relative;left:10px"><i>cell</i></span><br>
              Apply coloring based on Turkopticon reviews to the background of all applicable cells in the results table.
             </section>
             <p style="clear:both"><b>Note:</b> The Classic theme is exempt from these settings and will always colorize cells.</p>
            </div><div>
             <div style="float:left;margin-left:15px">
              <span style="position:relative;left:-8px"><b>Font Size</b></span>
              <p><input name="fontSize" type="number" min="5" value="${this.user.fontSize}" style="width:45px"></p>
              <span style="position:relative;left:-8px"><b>New HIT Offset</b></span>
              <p><input name="shineOffset" type="number" value="${this.user.shineOffset}" style="width:45px"></p>
             </div>
             <section style="margin-left:100px;margin-top:15px">
              Change the font size (measured in px) for text in the results table. Default is 11px.
             </section><section style="margin-left:100px;margin-top:40px;">
              Controls the font size of new HITs relative to the rest of the results. Default is 1px. <br />
              <i>Example:</i> With a font size of 11px and an offset of 1px, new HITs will be displayed at 12px.
             </section>
            </div>`,//}}}
            _blocks     = //{{{
              `<div>
             <div style="float:left; margin-left:15px">
              <span style="position:relative; left:-8px"><b>Advanced Matching</b></span>
              <p><label for="wildblocks" style="float:left; width:95px">Allow Wildcards</label>
              <input id="wildblocks" type="checkbox" ${this.user.wildblocks ? 'checked' : ''}/></p>
             </div>
             <section style="margin-left:150px">
              Allows for the use of asterisks <code>(*)</code> as wildcards in the blocklist for simple glob matching. Any blocklist entry 
              without an asterisk is treated the same as the default behavior--the entry must exactly match a HIT title or requester to 
              trigger a block.
              <p><em>Wildcards have the potential to block more HITs than intended if using a pattern that's too generic.</em></p>
              <p>Matching is not case sensitive regardless of the wildcard setting. Entries without an opening asterisk are 
              expected to match the beginning of a line, likewise, entries without a closing asterisk are expected to match 
              the end of a line. Example usage below.</p>
              <table class="ble" style="left:-100px;position:relative;width:110%;">
               <tr>
                <th class="blec ble"></th>
                <th class="blec ble">Matches</th>
                <th class="blec ble" style="width:86px">Does not match</th>
                <th class="blec ble">Notes</th>
               </tr><tr>
                <td rowspan="2" class="blec ble"><code>foo*baz</code></td>
                <td class="blec ble">foo bar bat baz</td>
                <td class="blec ble">bar foo bat baz</td>
                <td rowspan="2" class="blec ble">no leading or closing asterisks; <code>foo</code> must be at the start of a line, 
                and <code>baz</code> must be at the end of a line for a positive match</td>
               </tr><tr><td class="blec ble">foobarbatbaz</td><td class="blec ble">foo bar bat</td>
               </tr><tr>
                <td class="blec ble"><code>*foo</code></td>
                <td class="ble blec">bar baz foo</td>
                <td class="blec ble">foo baz</td>
                <td class="ble blec">matches and blocks any line ending in <code>foo</code></td>
               </tr><tr>
                <td class="blec ble"><code>foo*</code></td>
                <td class="ble blec">foo bat bar</td>
                <td class="ble blec">bat foo baz</td>
                <td class="ble blec">matches and blocks any line beginning with <code>foo</code></td>
               </tr><tr>
                <td class="ble blec" rowspan="4"><code>*bar*</code></td>
                <td class="ble blec">foo bar bat baz</td>
                <td class="ble blec" rowspan="4">foo bat baz</td>
                <td class="ble blec" rowspan="4">matches and blocks any line containing <code>bar</code></td>
               </tr><tr><td class="ble blec">bar bat baz</td>
               </tr><tr><td class="ble blec">foo bar</td>
               </tr><tr><td class="ble blec">foobatbarbaz</td>
               </tr><tr>
                <td class="ble blec"><code>** foo</code></td>
                <td class="ble blec">** foo</td>
                <td class="ble blec">** foo bar baz</td>
                <td class="ble blec">Multiple consecutive asterisks will be treated as a string rather than a wildcard. This makes it 
                compatible with HITs using multiple asterisks in their titles, <i>e.g.</i>, <code>*** contains peanuts ***</code>.</td>
               </tr><tr>
                <td class="ble blec"><code>** *bar* ***</td>
                <td class="ble blec">** foo bar baz bat ***</td>
                <td class="ble blec">foo bar baz</td>
                <td class="ble blec">Consecutive asterisks used in conjunction with single asterisks.</td>
               </tr><tr>
                <td class="ble blec"><code>*</code></td>
                <td class="ble blec"><i>nothing</i></td>
                <td class="ble blec"><i>all</i></td>
                <td class="ble blec">A single asterisk would usually match anything and everything, 
                but here, it matches nothing. This prevents accidentally blocking everything from the results table.</td>
               </tr>
              </table>
             </section>
            </div>`,//}}}
            _notify     = //{{{
              `<div>
             <div style="float:left; margin-left:15px">
              <span style="position:relative; left:-8px"><b>Additional Notifications</b></span><br>
              <p><label for="notifyBlink" style="float:left; width:51px">Blink</label>
              <input id="notifyBlink" type="checkbox" name="notify" ${this.user.notifyBlink ? 'checked' : ''}/></p>
              <p><label for="notifyTaskbar" style="float:left; width:51px">Taskbar</label>
              <input id="notifyTaskbar" type="checkbox" name="notify" ${this.user.notifyTaskbar ? 'checked' : ''}/></p>
             </div>
             <section style="margin-left:160px">
              <span style="position:relative; left:10px"><i>blink</i></span><br>
              Blink the tab when there are new HITs.
             </section>
             <section style="margin-left:160px">
              <span style="position:relative; left:10px"><i>taskbar</i></span><br>
              Create an HTML5 browser notification when there are new HITs, which appears over the taskbar for 10 seconds.
             </section>
             <p style="clear:both"><b>Note:</b> These notification options will only apply when the page does not have active focus.</p>
            </div>`,//}}}
            _utils      =//{{{
              `<div>
           <div style="float:left; margin-left:15px">
            <span style="position relative; left:-8px"><b>Export/Import</b></span>
            <p><button id="sexport">Export</button></p>
            <p><button id="simport">Import</button></p>
            <input type="file" id="fsimport" style="display:none">
           </div>
           <section style="margin-left:130px; margin-top:15px">
            <span style="position:relative; left:10px"><i>Export</i></span><br>
            Export your current settings, block list, and include list as a local file.
           </section>
           <section style="margin-left:130px">
            <span style="position:relative; left:10px"><i>Import</i></span></br>
            Import your settings, block list, and include list from a local file.
           </section>
           <div style="margin-top:10px" id="eisStatus"></div>
          </div>`,//}}}
            _main       = //{{{
              `<div style="top:0;left:0;margin:0;text-align:right;padding:0px;border:none;width:100%">
             <label id="settingsClose" class="close" title="Close">&#160;&#10008;&#160;</label>
            </div><div id="settingsSidebar">
             <span class="settingsSelected">General</span>
             <span>Appearance</span>
             <span>Blocklist</span>
             <span>Notifications</span>
             <span>Utilities</span>
            </div><div id="panelContainer" style="margin-left:10px;border:none;overflow:auto;width:auto;height:92%">
             <div id="General" class="settingsPanel">${_general}</div>
             <div id="Appearance" class="settingsPanel">${_appearance}</div>
             <div id="Blocklist" class="settingsPanel">${_blocks}</div>
             <div id="Notifications" class="settingsPanel">${_notify}</div>
             <div id="Utilities" class="settingsPanel">${_utils}</div>
            </div>`;//}}}

          this.main = document.body.appendChild(document.createElement('DIV'));
          this.main.id = 'settingsMain';
          this.main.innerHTML = _main;
          return this;
        },//}}} Settings::draw
        init          : function() {//{{{
          var get         = (q, all) => this.main['querySelector' + (all ? 'All' : '')](q),
              sidebarFn   = function(e) {
                if (e.target.classList.contains('settingsSelected')) return;
                get('#' + get('.settingsSelected').textContent).style.display = 'none';
                get('.settingsSelected').classList.toggle('settingsSelected');
                e.target.classList.toggle('settingsSelected');
                get('#' + e.target.textContent).style.display = 'block';
              }.bind(this),
              sliderFn    = function(e) {
                e.target.nextElementSibling.textContent = Math.floor(e.target.value * 100) + '%';
              },
              optChangeFn = function(e) {//{{{
                var tag                                                       = e.target.tagName, type                              = e.target.type, id = e.target.id,
                    isChecked = e.target.checked, name = e.target.name, value = e.target.value;

                switch (tag) {
                  case 'SELECT':
                    //get('#thedit').textContent = value === 'random' ? 'Re-roll!' : 'Edit Current Theme';
                    this.user.themes.name = value;
                    Themes.apply(value, this.user.hitColor);
                    break;
                  case 'INPUT':
                    switch (type) {
                      case 'radio':
                        if (name === 'checkbox') {
                          this.user.showCheckboxes = (value === 'true');
                          Array.from(document.querySelectorAll('#controlpanel input[type=checkbox],#controlpanel input[type=radio]'))
                               .forEach(v => v.classList.toggle('hidden'));
                        }
                        else this.user[name] = value;
                        if (name === 'hitColor') Themes.apply(this.user.themes.name, value);
                        break;
                      case 'checkbox':
                        this.user[id] = isChecked;
                        if (name === 'export')
                          Array.from(document.querySelectorAll(`button.${value}`))
                               .forEach(v => v.style.display = isChecked ? '' : 'none');
                        if (id === 'notifyTaskbar' && isChecked && Notification.permission === 'default')
                          Notification.requestPermission();
                        break;
                      case 'number':
                        if (name === 'fontSize')
                          document.head.querySelector('#lazyfont').sheet.cssRules[0].style.fontSize = value + 'px';
                        else if (name === 'shineOffset')
                          document.head.querySelector('#lazyfont').sheet.cssRules[1].style.fontSize = +this.user.fontSize + (+value) + 'px';
                        if (name === 'TOW') this.user.toWeights[id] = value;
                        else this.user[name] = value;
                        break;
                      case 'range':
                        this.user.volume[name] = value;
                        let audio = document.querySelector(`#${name}`);
                        audio.volume = value;
                        audio.play();
                        break;
                    }
                    break;
                }
                Settings.save();
              }.bind(this);//}}}

          get('#settingsClose').onclick = this.die.bind(this);
          get('#General').style.display = 'block';
          Array.from(get('#settingsSidebar span', true)).forEach(v => v.onclick = sidebarFn);
          Array.from(get('input:not([type=file]),select', true)).forEach(v => v.onchange = optChangeFn);
          Array.from(get('input[type=range]', true)).forEach(v => v.oninput = sliderFn);
          get('#thedit').onclick = () => {
            this.die.call(this);
            new Editor('theme');
          };
          get('#sexport').onclick = FileHandler.exports;
          get('#simport').onclick = () => {
            get('#fsimport').value = '';
            get('#eisStatus').innerHTML = '';
            get('#fsimport').click();
          };
          get('#fsimport').onchange = FileHandler.imports;
        },//}}} Settings::init
        die           : function() {
          Interface.toggleOverflow('off');
          this.main.remove();
        }
      },//}}} Settings

      Themes      = {//{{{
        default      : defaults.themes,
        generateCSS  : function(theme, mode) {//{{{
          var ref     = theme === 'random' ? this.randomize() : Settings.user.themes.colors[theme],
              _ms     = mode === 'cell' || theme === 'classic',
              cellFix = {
                row   : k => `.${k} ` + (_ms ? '{background:' : 'a {color:') + ref[k] + '}',
                text  : k => `.${k} {color:` + (_ms ? this.tune(ref.bodytable, ref[k]) : ref.bodytable) + '}',
                export: k => `.${k} button {color:` + (_ms ? this.tune(ref.export, ref[k]) : ref.export) + '}',
                vlink : k => `.${k} a:not(.static):visited {color:` + (_ms
                  ? this.tune(ref.vlink, ref[k])
                  : ref.vlink) + '}'
              },
              css     = `body {color:${ref.defaultText}; background-color:${ref.background}}
            /*#status {color:${ref.secondText}}*/
            #sortdirs {color:${ref.inputText}}
            #curtain {background:${ref.background}; opacity:0.5}
            .controlpanel i:after {color:${ref.accent}}
            #controlpanel {background:${ref.cpBackground}}
            #controlpanel input${theme === 'classic' ? '' : ', #controlpanel select'} 
              {color:${ref.inputText}; border:1px solid; background:${theme === 'classic' ? '#fff' : ref.cpBackground}}
            #controlpanel label {color:${ref.defaultText}; background:${ref.cpBackground}}
            #controlpanel label:hover {background:${ref.hover}}
            #controlpanel label.checked {color:${ref.secondText}; background:${ref.highlight}}
            /*#resultsTable tbody a:not(.static):visited {color:${ref.vlink}}*/
            /*#resultsTable button {color:${ref.export}}*/
            thead, caption, a {color:${ref.defaultText}}
            tbody a {color:${ref.link}}
            .nohitDB {color:#000; background:${ref.nohitDB}}
            .hitDB {color:#000; background:${ref.hitDB}}
            .reqmaster {color:#000; background:${ref.reqmaster}}
            .nomaster {color:#000; background:${ref.nomaster}}
            .tooweak {background:${ref.unqualified}}
            ${cellFix.row('toNone')}    ${cellFix.text('toNone')}    ${cellFix.export('toNone')}    ${cellFix.vlink('toNone')}
            ${cellFix.row('toHigh')}    ${cellFix.text('toHigh')}    ${cellFix.export('toHigh')}    ${cellFix.vlink('toHigh')}
            ${cellFix.row('toGood')}    ${cellFix.text('toGood')}    ${cellFix.export('toGood')}    ${cellFix.vlink('toGood')}
            ${cellFix.row('toAverage')} ${cellFix.text('toAverage')} ${cellFix.export('toAverage')} ${cellFix.vlink('toAverage')}
            ${cellFix.row('toLow')}     ${cellFix.text('toLow')}     ${cellFix.export('toLow')}     ${cellFix.vlink('toLow')}
            ${cellFix.row('toPoor')}    ${cellFix.text('toPoor')}    ${cellFix.export('toPoor')}    ${cellFix.vlink('toPoor')}`;
          if (theme !== 'classic') css += `\n.controlpanel button {color:${ref.accent}; background:transparent;}`;
          return css;
        },//}}} Themes::generateCSS
        tune         : function(fg, bg) {//{{{
          var cbg     = this.getBrightness(bg),
              lighten = c => {
                c.s = Math.max(0, c.s - 5);
                c.v = Math.min(100, c.v + 5);
                return c;
              },
              darken  = c => {
                c.s = Math.min(100, c.s + 5);
                c.v = Math.max(0, c.v - 5);
                return c;
              },
              tune    = (function() { if (cbg >= 128) return darken; else return lighten; })(),
              hex2hsv = function(c) {//{{{
                var r = parseInt(c.slice(1, 3), 16), g = parseInt(c.slice(3, 5), 16), b = parseInt(c.slice(5, 7), 16),
                    min                                                                 = Math.min(r, g, b), max                                        = Math.max(r, g, b), delta             = max - min, _hue;
                switch (max) {
                  case r:
                    _hue = Math.round(60 * (g - b) / delta);
                    break;
                  case g:
                    _hue = Math.round(120 + 60 * (b - r) / delta);
                    break;
                  case b:
                    _hue = Math.round(240 + 60 * (r - g) / delta);
                    break;
                }
                return {
                  h: _hue < 0 ? _hue + 360 : _hue,
                  s: max === 0 ? 0 : Math.round(100 * delta / max),
                  v: Math.round(max * 100 / 255)
                };
              }, //}}}
              hsv2hex = function(c) {//{{{
                var r, g, b, pad = s => ('00' + s.toString(16)).slice(-2);
                if (c.s === 0) r = g = b = Math.round(c.v * 2.55).toString(16);
                else {
                  c = { h: c.h / 60, s: c.s / 100, v: c.v / 100 }; // convert to prime to calc chroma
                  var _t1 = Math.round((c.v * (1 - c.s)) * 255),
                      _t2 = Math.round((c.v * (1 - c.s * (c.h - Math.floor(c.h)))) * 255),
                      _t3 = Math.round((c.v * (1 - c.s * (1 - (c.h - Math.floor(c.h))))) * 255);
                  switch (Math.floor(c.h)) {
                    case 1:
                      r = _t2;
                      g = Math.round(c.v * 255);
                      b = _t1;
                      break;
                    case 2:
                      r = _t1;
                      g = Math.round(c.v * 255);
                      b = _t3;
                      break;
                    case 3:
                      r = _t1;
                      g = _t2;
                      b = Math.round(c.v * 255);
                      break;
                    case 4:
                      r = _t3;
                      g = _t1;
                      b = Math.round(c.v * 255);
                      break;
                    case 0:
                      r = Math.round(c.v * 255);
                      g = _t3;
                      b = _t1;
                      break;
                    default:
                      r = Math.round(c.v * 255);
                      g = _t1;
                      b = _t2;
                      break;
                  }
                }
                return '#' + pad(r) + pad(g) + pad(b);
              };//}}}

          while (Math.abs(this.getBrightness(fg) - cbg) < 90) fg = hsv2hex(tune(hex2hsv(fg)));
          return fg;
        },//}}}
        getBrightness: function(hex) {//{{{
          // TODO: put in Colors object
          var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
          return ((r * 299) + (g * 587) + (b * 114)) / 1000;
        },//}}} Themes::getBrightness
        apply        : function(theme, mode) {//{{{
          var cssNew                                                            = URL.createObjectURL(new Blob([this.generateCSS(theme, mode)], { type: 'text/css' })),
              rel = document.head.querySelector('link[rel=stylesheet]'), cssOld = rel.href;
          rel.href = cssNew;
          URL.revokeObjectURL(cssOld);
        }//}}} Themes::apply
      },//}}} Themes

      Interface   = {//{{{
        user          : Settings.user,
        time          : Date.now(),
        focused       : true,
        blackhole     : {},
        isLoggedout   : document.querySelector('#lnkWorkerSignin') ? true : false,
        resetTitle    : function() {//{{{
          if (this.blackhole.blink) clearInterval(this.blackhole.blink);
          document.title = DOC_TITLE;
        },//}}}
        toggleOverflow: function(state) {//{{{
          document.body.querySelector('#curtain').style.display = state === 'on' ? 'block' : 'none';
          document.body.style.overflow = state === 'on' ? 'hidden' : 'auto';
        },//}}} Interface::curtains
        draw          : function() {//{{{
          var user = this.user = Settings.user,
              _cb    = user.showCheckboxes ? '' : 'hidden',
              _u0    = new Uint8Array(Array.prototype.map.call(window.atob(audio0), v => v.charCodeAt(0))),
              _u1    = new Uint8Array(Array.prototype.map.call(window.atob(audio1), v => v.charCodeAt(0))),
              ding   = URL.createObjectURL(new Blob([_u0], { type: 'audio/ogg' })),
              squee  = URL.createObjectURL(new Blob([_u1], { type: 'audio/mp3' })),
              titles = {//{{{
                refresh       : 'Enter search refresh delay in seconds.\nEnter 0 for no auto-refresh.\nDefault is 0 (no auto-refresh).',
                pages         : 'Enter number of pages to scrape. Default is 1.',
                skips         : 'Searches additional pages to get a more consistent number of results. Helpful if you\'re blocking a lot of items.',
                resultsPerPage: 'Number of results to return per page (maximum is 100, default is 30)',
                batch         : 'Enter minimum HITs for batch search (must be searching by Most Available).',
                pay           : 'Enter the minimum desired pay per HIT (e.g. 0.10).',
                qual          : 'Only show HITs you\'re currently qualified for (must be logged in).',
                monly         : 'Only show HITs that require Masters qualifications.',
                mhide         : 'Remove masters hits from the results if selected, otherwise display both masters and non-masters HITS.\n' +
                                'The \'qualified\' setting supercedes this option.',
                searchBy      : 'Get search results by...\n Latest = HIT Creation Date (newest first),\n ' +
                                'Most Available = HITs Available (most first),\n Reward = Reward Amount (most first),\n Title = Title (A-Z)',
                invert        : 'Reverse the order of the Search By choice, so...\n Latest = HIT Creation Date (oldest first),\n ' +
                                'Most Available = HITs Available (least first),\n Reward = Reward Amount (least first),\n Title = Title (Z-A)',
                shine         : 'Enter time (in seconds) to keep new HITs highlighted.\nDefault is 300 (5 minutes).',
                sound         : 'Play a sound when new results are found.',
                soundSelect   : 'Select which sound will be played.',
                minTOPay      : 'After getting search results, hide any results below this average Turkopticon pay rating.\n' +
                                'Minimum is 1, maximum is 5, decimals up to 2 places, such as 3.25',
                hideNoTO      : 'After getting search results, hide any results that have no, or too few, Turkopticon pay ratings.',
                disableTO     : 'Disable attempts to download ratings data from Turkopticon for the results table.\n' +
                                'NOTE: TO is cached. That means if TO is availible from a previous scrape, it will use that value even if ' +
                                'TO is disabled. This option only prevents the retrieval of ratings from the Turkopticon servers,',
                sortPay       : 'After getting search results, re-sort the results based on their average Turkopticon pay ratings.',
                sortAll       : 'After getting search results, re-sort the results by their overall Turkopticon rating.',
                sortAsc       : 'Sort results in ascending (low to high) order.',
                sortDsc       : 'Sort results in descending (high to low) order.',
                search        : 'Enter keywords to search for; default is blank (no search terms).',
                hideBlock     : 'When enabled, hide HITs that match your blocklist.\n' +
                                'When disabled, HITs that match your blocklist will be displayed with a red border.',
                onlyIncludes  : 'Show only HITs that match your includelist.\nBe sure to edit your includelist first or no results will be displayed.',
                shineInc      : 'Outline HITs that match your includelist with a dashed green border.',
                mainlink      : 'Version: ' + ENV.VERSION + '\nRead the documentation for HIT Scraper With Export on its Greasyfork page.',
                gbatch        : 'Apply the \'Minimum batch size\' filter to all search options.',
                onlyViable    : 'Filters out HITs with qualifications you do not have and \ncan neither request nor take a test to obtain.\n' +
                                'Does not work while logged out.'
              },//}}}
              css    = [//{{{
                'body {font-family:Verdana, Arial; font-size:14px}',
                'p {margin:8px auto}',
                '.cpdefault {display:inline-block; visibility:visible; overflow:hidden; padding:8px 5px 1px 5px; transition:all 0.3s;}',
                '#controlpanel i:after, #status i:after {content:" | "}',
                'input[type="checkbox"], input[type="radio"] {vertical-align:middle}',
                'input[type="number"] {width:50px; text-align:center}',
                'label {padding:2px}',
                '.hiddenpanel {width:0px; height:0px; visibility:hidden}',
                '.hidden {display:none}',
                'button {border:1px solid}',
                'textarea {font-family:inherit; font-size:11px; margin:auto; padding:2px}',
                '.pop {position:fixed; top:15%; left:50%; margin:auto; transform:translateX(-50%); padding:5px;' + // for
                // editors/exporters
                'background:black; color:white; z-index:20; font-size:12px; box-shadow:0px 0px 6px 1px #fff}',
                'dt {text-transform:uppercase; clear:both; margin:3px}',
                '.icbutt {float:left;border:1px solid #fff;cursor:pointer} .icbutt > input {opacity:0;display:block;width:25px;height:25px;border:none}',
                // settings
                '#settingsMain {z-index:20; position:fixed; background:#fff; color:#000; box-shadow:-3px 3px 2px 2px #7B8C89; line-height:initial;' +
                'top:50%; left:50%; width:85%; height:85%; margin-right:-50%; transform:translate(-50%, -50%)}',
                '#settingsMain > div {margin:5px; padding:3px; position:relative; border:1px solid grey; line-height:initial}',
                '.close {position:relative; font-weight:bold; font-size:1em; color:white; background:black; cursor:pointer}',
                '#settingsSidebar {width:100px; min-width:90px; height:92%; float:left}',
                '#settingsSidebar > span {display:block; margin-bottom:5px; width:100px; font-size:1em; cursor:pointer}',
                '.settingsPanel {position:absolute; top:0;left:0; display:none; width:100%; height:100%; font-size:11px}',
                '.settingsPanel > div {margin:15px 5px; position:relative; background:#CCFFFA; overflow:auto; padding:6px 10px}',
                '.settingsSelected {background:aquamarine}',
                '.ble {border:1px solid black; border-collapse:collapse;} .blec {padding:5px; text-align:left;}',

                '.toLink {position:relative;}',
                '.toLink:before {content:""; display:none; z-index:5; position:absolute; top:0; left:-6px; width:0; height:0;' +
                'border-top:6px solid transparent; border-bottom:6px solid transparent; border-left:6px solid black}',
                '.toLink:hover:before {display:block;}',
                '.tooltip {position:absolute;top:0;right:calc(100% + 6px);text-align:left;transform:translateY(-20%);padding:5px;font-weight:normal;' +
                'font-size:11px; line-height:1; display:none; background:black; color:white; box-shadow:0px 0px 6px 1px #fff}',
                'meter {width:100%; position:relative; height:15px;}',
                'meter:before, .ffmb {display:block; font-size:10px; font-weight:bold; color:black; content:attr(data-attr); position:absolute; top:1px}',
                'meter:after, .ffma {display:block; font-size:10px; font-weight:bold; color:black; content:attr(value); position:absolute; top:1px; right:0}',
                '#resultsTable button {height:14px; font-size:8px; border:1px solid; padding:0; background:transparent}',
                '#resultsTable tbody td > div {display:table-cell}',
                '#resultsTable tbody td > div:first-child {padding-right:2px; vertical-align:middle; white-space:nowrap}',
                'button.disabled {position:relative}',
                'button.disabled:before {content:""; display:none; z-index:5; position:absolute; top:-7px; left:50%; width:0; height:0;' +
                'border-left:6px solid transparent; border-right:6px solid transparent; border-top:6px solid black; transform:translateX(-50%)}',
                'button.disabled:after {content:"Exports are disabled while logged out."; display:none; z-index:5; position:absolute;' +
                'top:-7px; left:50%; color:white; background:black; width:230px; padding:2px; transform:translate(-50%,-100%);' +
                'box-shadow:0px 0px 6px 1px #fff; font-size:12px}',
                'button.disabled:focus:before {display:block} button.disabled:focus:after {display:block}',
                '.spinner {display: inline-block; animation: kfspin 0.7s infinite linear; font-weight:bold;}',
                '@keyframes kfspin { 0% { transform: rotate(0deg) } 100% { transform: rotate(359deg) } }',
                '.spinner:before{content:"*"}',
                '.exhwtf {width:70px; background:black; color:white; vertical-align:top; border-radius:5px}',
                '.ignored td {border:2px solid #00E5FF}',
                '.includelisted td {border:3px dashed #008800}',
                '.blocklisted td {border:3px solid #cc0000}'
              ],//}}}
              fCss   =
                `#resultsTable tbody {font-size:${user.fontSize}px;}` +
                `.shine td {border:1px dotted #fff; font-size:${(+user.fontSize) + (+user.shineOffset)}px; font-weight:bold}`,
              //{{{ body
              body   = `
          <audio id="ding"> <source src=${ding}> </audio>
          <audio id="squee"> <source src=${squee}> </audio>
          <div id="curtain" style="position:fixed;width:100%;height:100%;display:none;z-index:10"></div>
          <div id="controlpanel" class="controlpanel cpdefault">
           <p>
            Auto-refresh delay: <input id="refresh" type="number" title="${titles.refresh}" min="0" value="${user.refresh}" /><i></i>
            Pages to scrape: <input id="pages" type="number" title="${titles.pages}" min="1" max="100" value="${user.pages}" /><i></i>
            <label class="${user.skips ? 'checked' : ''}" title="${titles.skips}" for="skips">Correct for skips</label>
            <input id="skips" class="${_cb}" type="checkbox" title="${titles.skips}" ${user.skips ? 'checked' : ''} /><i></i>
            Results per page: <input id="resultsPerPage" type="number" title="${titles.resultsPerPage}" 
            min="1" max="100" value="${user.resultsPerPage || 10}" />
           </p></p>
            Min reward: <input id="pay" type="number" title="${titles.pay}" min="0" step="0.05" value="${user.pay}" /><i></i>
            <label class="${user.qual ? 'checked' : ''}" title="${titles.qual}" for="qual">Qualified</label>
            <input id="qual" class="${_cb}" type="checkbox" title="${titles.qual}" ${user.qual ? 'checked' : ''} /><i></i>
            <label class="${user.monly ? 'checked' : ''}" title="${titles.monly}" for="monly">Masters Only</label>
            <input id="monly" class="${_cb}" type="checkbox" title="${titles.monly}" ${user.monly ? 'checked' : ''} /><i></i>
            <label class="${user.mhide ? 'checked' : ''}" title="${titles.mhide}" for="mhide">Hide Masters</label>
            <input id="mhide" class="${_cb}" type="checkbox" title="${titles.mhide}" ${user.mhide ? 'checked' : ''} /><i></i>
            <label class="${user.onlyViable ? 'checked' : ''}" title="${titles.onlyViable}" for="onlyViable">Hide Infeasible</label>
            <input id="onlyViable" class="${_cb}" type="checkbox" title="${titles.onlyViable}" ${user.onlyViable
                ? 'checked'
                : ''} /><i></i>
            Min batch size: <input id="batch" type="number" title="${titles.batch}" min="1" value="${user.batch}" /> - 
            <label class="${user.gbatch ? 'checked' : ''}" title="${titles.gbatch}" for="gbatch">Global</label>
            <input id="gbatch" class="${_cb}" type="checkbox" title="${titles.gbatch}" ${user.gbatch ? 'checked' : ''} />
           </p><p>
            New HIT highlighting: <input id="shine" type="number" title="${titles.shine}" min="0" max="3600" value="${user.shine}" /><i></i>
            <label class="${user.notifySound[0] ? 'checked' : ''}" title="${titles.sound}" for="sound">Sound on new HIT</label>
            <input id="sound" class="${_cb}" type="checkbox" title="${titles.sound}" ${user.notifySound[0]
                ? 'checked'
                : ''} />
            <select id="soundSelect" title="${titles.soundSelect}" style="display:${user.notifySound[0]
                ? 'inline'
                : 'none'}">
             <option value="ding" ${user.notifySound[1] === 'ding' ? 'selected' : ''}>Ding</option>
             <option value="squee" ${user.notifySound[1] === 'squee' ? 'selected' : ''}>Squee</option>
            </select><i></i>
            <label class="${user.disableTO ? 'checked' : ''}" title="${titles.disableTO}" for="disableTO">Disable TO</label>
            <input id="disableTO" class="${_cb}" type="checkbox" title="${titles.disableTO}" ${user.disableTO
                ? 'checked'
                : ''} /><i></i>
            Search by: <select id="searchBy" title="${titles.searchBy}">
             <option value="late"   ${user.searchBy === 0 ? 'selected' : ''}>Latest</option>
             <option value="most"   ${user.searchBy === 1 ? 'selected' : ''}>Most Available</option>
             <option value="amount" ${user.searchBy === 2 ? 'selected' : ''}>Reward</option>
             <option value="alpha"  ${user.searchBy === 3 ? 'selected' : ''}>Title</option>
            </select> - 
            <label class="${user.invert ? 'checked' : ''}" title="${titles.invert}" for="invert">Invert</label>
            <input id="invert" class="${_cb}" type="checkbox" title="${titles.invert}" ${user.invert ? 'checked' : ''} />
           </p><p>
            Min pay TO: <input id="minTOPay" type="number" title="${titles.minTOPay}" min="1" max="5" step="0.25" value="${user.minTOPay}" /><i></i>
            <label class="${user.hideNoTO ? 'checked' : ''}" title="${titles.hideNoTO}" for="hideNoTO">Hide no TO</label>
            <input id="hideNoTO" class="${_cb}" type="checkbox" title="${titles.hideNoTO}" ${user.hideNoTO
                ? 'checked'
                : ''} /><i></i>
            <label class="${user.sortPay ? 'checked' : ''}" title="${titles.sortPay}" for="sortPay">Sort by TO pay</label>
            <input id="sortPay" class="${_cb}" type="checkbox" title="${titles.sortPay}" name="sort" ${user.sortPay
                ? 'checked'
                : ''} /><i></i>
            <label class="${user.sortAll ? 'checked' : ''}" title="${titles.sortAll}" for="sortAll">Sort by overall TO</label>
            <input id="sortAll" class="${_cb}" type="checkbox" title="${titles.sortAll}" name="sort" ${user.sortAll
                ? 'checked'
                : ''} />
            <div id="sortdirs" style="font-size:15px;display:${user.sortPay || user.sortAll ? 'inline' : 'none'}">
              <label class="${user.sortAsc ? 'checked' : ''}" for="sortAsc" title="${titles.sortAsc}">&nbsp;&#9650;&nbsp;</label>
              <input id="sortAsc" class="${_cb}" type="radio" title="${titles.sortAsc}" name="sortDir" ${user.sortAsc
                ? 'checked'
                : ''} />
              <label class="${user.sortDsc ? 'checked' : ''}" for="sortDsc" title="${titles.sortDsc}">&nbsp;&#9660;&nbsp;</label>
              <input id="sortDsc" class="${_cb}" type="radio" title="${titles.sortDsc}" name="sortDir" ${user.sortDsc
                ? 'checked'
                : ''} />
            </div>
           </p><p>
            Search Terms: <input id="search" title="${titles.search}" placeholder="Enter search terms here" value="${user.search}" /><i></i>
            <label class="${user.hideBlock ? 'checked' : ''}" title="${titles.hideBlock}" for="hideBlock">Hide blocklisted</label>
            <input id="hideBlock" class="${_cb}" type="checkbox" title="${titles.hideBlock}" ${user.hideBlock
                ? 'checked'
                : ''} /><i></i>
            <label class="${user.onlyIncludes ? 'checked' : ''}" title="${titles.onlyIncludes}" for="onlyIncludes">Restrict to includelist</label>
            <input id="onlyIncludes" class="${_cb}" type="checkbox" title="${titles.onlyIncludes}" ${user.onlyIncludes
                ? 'checked'
                : ''} /><i></i>
            <label class="${user.shineInc ? 'checked' : ''}" title="${titles.shineInc}" for="shineInc">Highlight Includelisted</label>
            <input id="shineInc" class="${_cb}" type="checkbox" title="${titles.shineInc}" ${user.shineInc
                ? 'checked'
                : ''} />
           </p>
          </div><div id="controlbuttons" class="controlpanel" style="margin-top:5px">
           <button id="btnMain">Start</button> <button id="btnHide">Hide Panel</button> <button id="btnBlocks">Edit Blocklist</button>
           <button id="btnIncs">Edit Includelist</button> <button id="btnIgnores">Toggle Ignored HITs</button> &nbsp; 
           <button id="btnSettings">Settings</button>
          </div>
          <div id="loggedout" style="font-size:11px;margin-left:10px;text-transform:uppercase"></div>
          <div id="status" style="height:34px"><p>Stopped</p></div>
          <div id="results">
           <table id="resultsTable" style="width:100%">
            <caption style="font-weight:800;line-height:1.25em;font-size:1.5em;">
             <a class="mainlink" target="_blank" href="${URL_SELF}" title="${titles.mainlink}">HIT Scraper</a> Results
            </caption>
            <thead><tr style="font-weight:800;font-size:0.87em;text-align:center">
             <td>Requester</td><td>Title</td><td style="width:70px">Reward &amp; PandA</td><td style="width:35px"># Avail</td>
             <td style="width:30px">TO Pay</td><td style="width:15px">M</td>
             <td style="width:15px"></td><td style="width:15px"></td>
            </tr></thead>
            <tbody></tbody>
           </table>
          </div>`,//}}}
              head   = `<title>${DOC_TITLE}</title>` +
                       `<style type="text/css" id="lazyfont">${fCss}</style>` +
                       `<style type="text/css">${css.join('')}</style>` +
                       `<link rel="icon" type="image/png" href="${ico}" /><link rel="stylesheet" type="text/css" />`;

          document.head.innerHTML = head;
          document.body.innerHTML = body;
          this.elkeys = Object.keys(titles);
          return this;
        },//}}} Interface::draw
        init          : function() {//{{{
          this.panel = {};
          this.buttons = {};
          var get          = (q, all) => document['querySelector' + (all ? 'All' : '')](q),
              sortdirs     = get('#sortdirs'),
              moveSortdirs = function(node) {
                if (!node.checked) {
                  sortdirs.style.display = 'none';
                  return;
                }
                sortdirs.style.display = 'inline';
                sortdirs.remove();
                node.parentNode.insertBefore(sortdirs, node.nextSibling);
              },
              kdFn         = e => { if (e.keyCode === kb.ENTER) setTimeout(() => this.buttons.main.click(), 30); },
              optChangeFn  = function(e) {//{{{
                var tag                                                       = e.target.tagName, type = e.target.type, id          = e.target.id,
                    isChecked = e.target.checked, name = e.target.name, value = e.target.value;

                switch (tag) {
                  case 'SELECT':
                    if (id === 'soundSelect')
                      this.user.notifySound[1] = e.target.value;
                    else
                      this.user[id] = e.target.selectedIndex;
                    break;
                  case 'INPUT':
                    switch (type) {
                      case 'number':
                      case 'text':
                        this.user[id] = value;
                        break;
                      case 'radio':
                        Array.from(get(`input[name=${name}]`, true))
                             .forEach(v => {
                               this.user[v.id] = v.checked;
                               get(`label[for=${v.id}]`).classList.toggle('checked');
                             });
                        break;
                      case 'checkbox':
                        if (name === 'sort') {
                          Array.from(get(`input[name=${name}]`, true)).forEach(v => {
                            if (e.target !== v) v.checked = false;
                            get(`label[for=${v.id}]`).className = v.checked ? 'checked' : '';
                            this.user[v.id] = v.checked;
                          });
                          moveSortdirs(e.target);
                          break;
                        } else if (id === 'sound') {
                          this.user.notifySound[0] = isChecked;
                          e.target.nextElementSibling.style.display = isChecked ? 'inline' : 'none';
                        }
                        this.user[id] = isChecked;
                        get(`label[for=${id}]`).classList.toggle('checked');
                        break;
                    }
                    break;
                }
                Settings.save();
              }.bind(this);//}}}

          'ding squee'.split(' ').forEach(v => get(`#${v}`).volume = this.user.volume[v]);

          Themes.apply(this.user.themes.name);
          if (this.isLoggedout) get('#loggedout').textContent = 'you are currently logged out of mturk';
          // get references to control panel elements and set up click events
          this.Status = {
            node  : get('#status').firstChild,
            push  : function(t) { this.node.innerHTML = t; },
            append: function(t) { this.node.innerHTML += t; },
            cd    : function() { this.node.innerHTML = this.node.innerHTML.replace(/\d+(?= seconds)/, m => +m - 1); }
          };
          for (var k of this.elkeys) {
            if (k === 'mainlink') continue;
            this.panel[k] = document.getElementById(k);
            this.panel[k].onchange = optChangeFn;
            if (k === 'pay' || k === 'search') this.panel[k].onkeydown = kdFn;
            if ((k === 'sortPay' || k === 'sortAll') && this.panel[k].checked) moveSortdirs(this.panel[k]);
          }

          // get references to buttons
          Array.from(get('button', true)).forEach(v => this.buttons[v.id.slice(3).toLowerCase()] = v);
          // set up button click events
          this.buttons.main.onclick = function(e) {
            e.target.textContent = e.target.textContent === 'Start' ? 'Stop' : 'Start';
            Core.run();
          };
          this.buttons.hide.onclick = function(e) {
            get('#controlpanel').classList.toggle('hiddenpanel');
            e.target.textContent = e.target.textContent === 'Hide Panel' ? 'Show Panel' : 'Hide Panel';
          };
          this.buttons.blocks.onclick = () => {
            this.toggleOverflow('on');
            new Editor('ignore');
          };
          this.buttons.incs.onclick = () => {
            this.toggleOverflow('on');
            new Editor('include');
          };
          this.buttons.ignores.onclick = () => Array.from(get('.ignored:not(.blocklisted)', true)).forEach(v => v.classList.toggle('hidden'));
          this.buttons.settings.onclick = () => {
            this.toggleOverflow('on');
            Settings.draw().init();
          };
          get('#hideBlock').addEventListener('change', () => Array.from(get('.blocklisted', true)).forEach(v => v.classList.toggle('hidden')));
          document.body.onblur = () => this.focused = false;
          document.body.onfocus = () => {
            this.focused = true;
            this.resetTitle();
          };
        }//}}} Interface::init
      },//}}} Interface

      Editor      = function(type) {//{{{
        if (!type) return { setDefaultBlocks: setDefaultBlocks };
        Interface.toggleOverflow('on');
        this.node = document.body.appendChild(document.createElement('DIV'));
        this.node.classList.add('pop');
        this.die = () => {
          Interface.toggleOverflow('off');
          this.node.remove();
        };
        this.type = type;
        this.caller = arguments[1] || null;

        function setDefaultBlocks() {
          return localStorage.setItem('scraper_ignore_list',
            'oscar smith^diamond tip research llc^jonathan weber^jerry torres^' +
            'crowdsource^we-pay-you-fast^turk experiment^jon brelig^p9r^scoutit');
        }

        switch (type) {
          case 'include':
          case 'ignore':
            if (type === 'ignore' && !localStorage.getItem('scraper_ignore_list')) setDefaultBlocks();
            var titleText = type === 'ignore'
              ? '<b>BLOCKLIST</b> - Edit the blocklist with what you want to ignore/hide. Separate requester names and HIT titles with the ' +
                '<code>^</code> character. After clicking "Save", you\'ll need to scrape again to apply the changes.'
              : '<b>INCLUDELIST</b> - Focus the results on your favorite requesters. Separate requester names and HIT titles with the ' +
                '<code>^</code> character. When the "Restrict to includelist" option is selected, ' +
                'HIT Scraper only shows results matching the includelist.';
            this.node.innerHTML = '<div style="width:500px">' + titleText + '</div>' +
                                  '<textarea style="display:block;height:200px;width:500px;font:12px monospace" placeholder="nothing here yet">' +
                                  (localStorage.getItem(`scraper_${type}_list`) || '') + '</textarea>' +
                                  '<button id="edSave" style="margin:5px auto;width:50%;color:white;background:black">Save</button>' +
                                  '<button id="edCancel" style="margin:5px auto;width:50%;color:white;background:black">Cancel</button>';
            this.node.querySelector('#edSave').onclick = () => {
              localStorage.setItem(`scraper_${type}_list`, this.node.querySelector('textarea').value.trim());
              this.die();
            };
            break;
          case 'theme':
            var dlbody = [], _th = Settings.user.themes, split = obj => {
                  var a = [];
                  for (var k in obj) if (obj.hasOwnProperty(k)) a.push({ k: k, v: obj[k] });
                  return a.sort((a, b) => a.k < b.k ? -1 : 1);
                }, _colors                                     = split(_th.colors[_th.name]),
                define                                         = k => '<div style="margin-left:37px">' + _dd[k] + '</div>',
                _dd                                            = {//{{{
                  highlight   : 'Distinguishes between active and inactive states in the control panel',
                  background  : 'Background color',
                  accent      : 'Color of spacer text (and control panel buttons on themes other than \'classic\')',
                  bodytable   : 'Default color of text elements in the results table (this is ignored if HIT coloring is set to \'cell\')',
                  cpBackground: 'Background color of the control panel',
                  toHigh      : 'Color for results with high TO',
                  toGood      : 'Color for results with good TO',
                  toAverage   : 'Color for results with average TO',
                  toLow       : 'Color for results with low TO',
                  toPoor      : 'Color for results with poor TO',
                  toNone      : 'Color for results with no TO',
                  hitDB       : 'Designates that a match was found in your HITdb',
                  nohitDB     : 'Designates that a match was not found in your HITdb',
                  unqualified : 'Designates that you do not have the qualifications necessary to work on the HIT',
                  reqmaster   : 'Designates HITs that require Masters',
                  nomaster    : 'Designates HITs that do not require Masters',
                  defaultText : 'Default text color',
                  inputText   : 'Color of input boxes in the control panel',
                  secondText  : 'Color for text used on selected control panel items',
                  link        : 'Default color of unvisited links',
                  vlink       : 'Default color of visited links',
                  export      : 'Color of buttons in the results table--export and block buttons',
                  hover       : 'Color of control panel options on mouseover'
                };//}}}
            for (var r of _colors)
              dlbody.push(`<dt>${r.k}</dt><dd><div class="icbutt"><input data-key="${r.k}" type="color" value="${r.v}" /></div>${define(r.k)}</dd>`);
            this.node.innerHTML = '<b>THEME EDITOR</b><p></p><div style="height:87%;overflow:auto"><dl>' + dlbody.join('') + '</dl></div>' +
                                  '<button id="edSave" style="margin:5px auto;width:33%;color:white;background:black">Save</button>' +
                                  '<button id="edDefault" style="margin:5px auto;width:33%;color:white;background:black">Restore Default</button>' +
                                  '<button id="edCancel" style="margin:5px auto;width:33%;color:white;background:black">Cancel</button>';
            this.node.style.height = '57%';
            Array.from(this.node.querySelectorAll('.icbutt')).forEach(v => {
              v.style.background = v.firstChild.value;
              v.firstChild.onchange = e => {
                var k = e.target.dataset.key;
                v.style.background = e.target.value;
                _th.colors[_th.name][k] = e.target.value;
                Themes.apply(_th.name, Settings.user.hitColor);
              };
            });
            this.node.querySelector('#edDefault').onclick = () => {
              _th.colors[_th.name] = Themes.default[_th.name];
              Themes.apply(_th.name, Settings.user.hitColor);
              this.die();
              new Editor('theme');
            };
            this.node.querySelector('#edSave').onclick = () => {
              Settings.save();
              this.die();
            };
            break;
          case 'vbTemplate':
            this.node.innerHTML = '<b>VBULLETIN TEMPLATE</b><div style="float:right;margin-bottom:5px">Ratings Symbol: ' +
                                  `<input style="text-align:center" type="text" size="1" maxlength="1" value="${Settings.user.vbSym}" /></div>` +
                                  '<textarea style="display:block;height:200px;width:500px;font:12px monospace">' +
                                  Settings.user.vbTemplate + '</textarea>' +
                                  '<button id="edSave" style="margin:5px auto;width:33%;color:white;background:black">Save</button>' +
                                  '<button id="edDefault" style="margin:5px auto;width:33%;color:white;background:black">Restore Default</button>' +
                                  '<button id="edCancel" style="margin:5px auto;width:33%;color:white;background:black">Cancel</button>';
            this.node.querySelector('#edDefault').onclick = () => {
              this.node.querySelector('textarea').value = Settings.defaults.vbTemplate;
              this.node.querySelector('#edSave').click();
            };
            this.node.querySelector('#edSave').onclick = () => {
              Settings.user.vbTemplate = this.node.querySelector('textarea').value.trim();
              Settings.user.vbSym = this.node.querySelector('input').value;
              Settings.save();
              this.die();
              new Exporter({ target: this.caller });
            };
            break;
        }
        this.node.querySelector('#edCancel').onclick = () => this.die();
      },//}}}

      Core        = {//{{{
        active    : false,
        timer     : null,
        cooldown  : null,
        lastScrape: null,
        getPayload: function(page=1) {//{{{
          const user    = Settings.user,
                payload = {
                  legacy: {
                    searchWords       : user.search,
                    minReward         : user.pay,
                    qualifiedFor      : Interface.isLoggedout ? 'off' : (user.qual ? 'on' : 'off'),
                    requiresMasterQual: user.monly ? 'on' : 'off',
                    sortType          : '',
                    pageNumber        : page,
                    pageSize          : user.resultsPerPage || 50
                  },
                  next  : {
                    filters    : {
                      search_term: user.search,
                      qualified  : user.qual,
                      masters    : user.monly,
                      min_reward : user.pay
                    },
                    page_size  : user.resultsPerPage || 50,
                    sort       : '',
                    page_number: page,
                    format: 'json'
                  }
                };
          const sort = user.invert ? 'asc' : 'desc';
          switch (user.searchBy) {
            case 0:
              payload.legacy.sortType = `LastUpdatedTime:${+!user.invert}`;
              payload.next.sort = 'updated_' + sort;
              break;
            case 1:
              payload.legacy.sortType = `NumHITs:${+!user.invert}`;
              payload.next.sort = 'num_hits_' + sort;
              break;
            case 2:
              payload.legacy.sortType = `Reward:${+!user.invert}`;
              payload.next.sort = 'reward_' + sort;
              break;
            case 3:
              payload.legacy.sortType = `Title:${+user.invert}`;
              payload.next.sort = 'title_' + sort;
              break;
          }
          return payload;
        },//}}} Core::init
        run       : function(skiptoggle) {//{{{
          if (!skiptoggle) this.active = !this.active;
          this.cooldown = +Settings.user.refresh;
          clearTimeout(this.timer);
          Interface.resetTitle();
          if (this.active) {
            const next = ENV.HOST === ENV.NEXT;
            const path = next ? '/' : '/mturk/searchbar';
            const resType = next ? 'json' : 'document';
            Interface.Status.push('&nbsp;<b class="spinner"></b> Processing page: 1');
            this.fetch(path, this.getPayload(), resType);
          }
        },//}}} Core::run
        cruise    : function() {//{{{
          if (!this.active) return;
          if (--this.cooldown === 0) this.run(true);
          else {
            Interface.Status.cd();
            this.timer = setTimeout(this.cruise.bind(this), 1000);
          }
        },//}}}
        dispatch  : function(type, src) {//{{{
          switch (type) {
            case 'external':
              this.meld(src);
              break;
            case 'internal':
              if (ENV.HOST === ENV.LEGACY) {
                const error = src.querySelector('td[class="error_title"]');
                if (error && /page request/.test(error.textContent))
                  return setTimeout(this.fetch.bind(this), 3000, src.documentURI);
              }
              this.scrape(src);
              break;
            case 'control':
              const blocked   = scraperHistory.filter(v => v.current && v.blocked).length,
                    _rpp      = +Settings.user.resultsPerPage,
                    skiplimit = 5,
                    pagelimit = Settings.user.skips
                      ? ((+Settings.user.pages + Math.floor(blocked / _rpp) + (blocked % _rpp > 0.66 * _rpp
                        ? 1
                        : 0)) || 3)
                      : (+Settings.user.pages || 3);

              if (!this.active || !src.nextPageURL || src.page >= pagelimit || (pagelimit - Settings.user.pages) >= skiplimit || (Interface.isLoggedout && src.page === 20)) {
                if (Settings.user.disableTO)
                  this.meld();
                else {
                  const ids = scraperHistory.filter(v => v.current && v.TO === null && v.requester.id, true)
                                            .filter((v, i, a) => a.indexOf(v) === i).join();
                  if (!ids.length) return this.meld();
                  Interface.Status.push('&nbsp;<b class="spinner"></b> Retrieving TO data');
                  this.fetch(TO_API + ids, null, 'json');
                }
              } else {
                Interface.Status.push(`&nbsp;<b class="spinner"></b> Processing page: ${+src.page + 1}`);
                if (+src.page + 1 > +Settings.user.pages) Interface.Status.append('; Correcting for skips');
                setTimeout(this.fetch.bind(this), 250, src.nextPageURL, src.payload, src.responseType);
              }
              break;
          }
        },//}}} Core::dispatch
        scrapeNext: function(src) {
          src.results.forEach((v, i) => {
            const data = {
              discovery: Date.now(),
              title: v.title,
              index: src.page_number + ('00' + i).slice(-2),
              requester: { name: v.requester_name, id: v.requester_id, link: ENV.ORIGIN + v.requester_url },
              pay: '$' + v.monetary_reward.amount_in_dollars.toFixed(2),
              payRaw: v.monetary_reward.amount_in_dollars,
              time: v.assignment_duration_in_seconds,
              desc: v.description,
              quals: v.project_requirements.length ? v.project_requirements.map(getQuals) : ['None'],
              hit: { preview: ENV.ORIGIN + v.project_tasks_url, panda: ENV.ORIGIN + v.accept_project_task_url },
              groupId: v.hit_set_id,
              TO: null,
              masters: !!~v.project_requirements.findIndex(q => q.qualification_type_id === '2F1QJWKUDD8XADTFD2Q0G6UTO95ALH'),
              numHits: v.assignable_hits_count,
              blocked: false,
              included: false,
              current: true,
              qualified: v.caller_meets_requirements,
              viable: !~v.project_requirements.findIndex(q => q.caller_meets_requirement === false && q.qualification_type.is_requestable === false)
            };

            const listsxr  = this.crossRef(data.requester.name, data.title); //check block/include lists
            data.blocked = listsxr[0];
            data.included = listsxr[1];
            if (Settings.user.searchBy === 1 && +Settings.user.batch > 1 && +data.numHits < +Settings.user.batch) return;
            else if (Settings.user.gbatch && +Settings.user.batch > 1 && +data.numHits < +Settings.user.batch) return;
            else if (Settings.user.onlyViable && !data.viable) return;
            scraperHistory.set(data.groupId, data);
          }, this);

          const dispatchObj = {
            method: 'next',
            page: src.page_number,
            nextPageURL: src.num_results < Settings.user.resultsPerPage ? null : '/',
            payload: this.getPayload(src.page_number+1),
            responseType: 'json'
          };
          this.dispatch('control', dispatchObj);

          function getQuals(qual) {
            return `${qual.qualification_type.name} ${qual.comparator} ${qual.qualification_values.join()}`;
          }
        },
        scrape    : function(src) {//{{{
          if (ENV.HOST === ENV.NEXT) return this.scrapeNext(src);
          let page        = +src.documentURI.match(/pageNumber=(\d+)/)[1],
              nextPageURL = src.querySelector('img[src="/media/right_arrow.gif"]'),
              titles      = Array.from(src.querySelectorAll('a.capsulelink')),
              getCapsule  = n => {
                for (let i = 0; i < 7; i++) n = n.parentNode;
                return n;
              };
          nextPageURL = nextPageURL ? nextPageURL.parentNode.href : null;

          titles.forEach(function(v, i) {
            let capsule  = getCapsule(v),
                get      = q => capsule.querySelector(q),
                pad      = n => ('00' + n).slice(-2),
                qualrows = Array.prototype.slice.call(get('a[id^="qualifications"]').parentNode.parentNode.parentNode.rows, 1),
                viable   = true,
                capData  = {
                  discovery: Date.now(),
                  title    : v.textContent.trim(),
                  index    : page + pad(i),
                  requester: { name: get('.requesterIdentity').textContent, id: null, link: null, linkTemplate: null },
                  pay      : get('span.reward').textContent,
                  time     : get('a[id^="duration"]').parentNode.nextElementSibling.textContent,
                  desc     : get('a[id^="description"]').parentNode.nextElementSibling.textContent,
                  quals    : qualrows.length
                    ? qualrows.map(v => v.cells[0].textContent.trim().replace(/\s+/g, ' '))
                    : ['None'],
                  hit      : { preview: null, previewTemplate: null, panda: null, pandaTemplate: null },
                  groupId  : null,
                  TO       : null,
                  masters  : null,
                  numHits  : null,
                  blocked  : false,
                  included : false,
                  current  : true,
                  qualified: !Boolean(get('a[href*="notqualified?"],a[id^="private_hit"]'))
                },
                listsxr  = this.crossRef(capData.requester.name, capData.title); //check block/include lists
            capData.blocked = listsxr[0];
            capData.included = listsxr[1];
            capData.masters = /Masters/.test(capData.quals.join());

            if (Interface.isLoggedout) {
              capData.TO = '';
              capData.qualified = false;
              capData.numHits = 'n/a';
            } else {
              viable = !qualrows.map(v => v.cells[2].textContent).filter(v => v.includes('do not')).length;
              capData.numHits = get('a[id^="number_of_hits"]').parentNode.nextElementSibling.textContent.trim();
            }

            try { // groupid
              capData.groupId = get('a[href*="roupId="]').href.match(/[A-Z0-9]{30}/)[0];
            } catch(e) {
              void(e);
              capData.groupId = this.getHash(capData.requester.name + capData.title + capData.pay);
            }
            try { // requesterid, requester search link, groupid
              var _r = get('a[href*="requesterId"]');
              capData.requester.link = _r.href;
              capData.requester.id = _r.href.match(/[^=]+$/)[0];
            } catch(e) {
              void(e);
              capData.requester.link = '/mturk/searchbar?searchWords=' + window.encodeURIComponent(capData.requester.name);
            }
            try { // preview/panda links
              var _l = get('a[href*="preview?"]');
              capData.hit.preview = _l.href.split('?')[0] + '?groupId=' + capData.groupId;
              capData.hit.panda = capData.hit.preview.replace(/(\?)/, 'andaccept$1');
            } catch(e) {
              void(e);
              capData.hit.preview = 'https://www.mturk.com/mturk/searchbar?searchWords=' + window.encodeURIComponent(capData.title);
            }

            if (Settings.user.searchBy === 1 && +Settings.user.batch > 1 && +capData.numHits < +Settings.user.batch) return;
            else if (Settings.user.gbatch && +Settings.user.batch > 1 && +capData.numHits < +Settings.user.batch) return;
            else if (Settings.user.onlyViable && !viable) return;
            scraperHistory.set(capData.groupId, capData);
          }, this);

          this.dispatch('control', { method: 'legacy', page: page, nextPageURL: nextPageURL });
        },//}}} Core::scrape
        meld      : function() {//{{{
          let reviews                                                          = arguments.length ? arguments[0] : null,
              table = document.querySelector('#resultsTable').tBodies[0], html = [], field, /*_gp, _gq,*/
              getClassFromValue                                                = (val, type) => type === 'sim' ? (val > 4 ? 'toHigh' : (val > 3 ? 'toGood' : (val > 2
                ? 'toAverage'
                : 'toPoor')))
                : (val > 4.05 ? 'toHigh' : (val > 3.06 ? 'toGood' : (val > 2.4 ? 'toAverage' : (val > 1.7
                  ? 'toLow'
                  : 'toPoor')))),
              addRowHTML                                                       = r => {//{{{
                var _st = Interface.isLoggedout ? 'disabled' : '',
                    _sh = ex => Settings.user['export' + ex] ? '' : 'hidden',
                    _rt = r.blocked
                      ? ''
                      : `<div><button name="block" value="${r.requester.name}" style="width:15px" title="Block this requester">R</button>` +
                        `<button name="block" value="${r.title.replace(/"/g, '&quot;')}" style="width:15px" title="Block this title">T</button></div>`;
                return `<tr class="${r.included ? 'includelisted' : ''} ${shouldHide ? 'ignored hidden' : ''} ` +
                       `${r.blocked ? 'blocklisted' : ''} ${r.rowColor} ${r.shine ? 'shine' : ''}">` +
                       `<td>${_rt}<div><a class="static" target="_blank" href="${r.requester.link}">${r.requester.name}</a><div></td>` +
                       `<td><div><button class="ex vb ${_st} ${_sh('Vb')}" style="width:30px" data-gid="${r.groupId}">vB</button> 
             <button class="ex irc ${_st} ${_sh('Irc')}" style="width:30px" data-gid="${r.groupId}">IRC</button> 
             <button class="ex hwtf ${_st} ${_sh('Hwtf')}" style="width:33px" data-gid="${r.groupId}">HWTF</button></div><div>
             <a title="Description:  ${r.desc.replace(/"/g, '&quot;')}\n\nQualifications:  ${r.quals.join('; ')}" target="_blank" href="${r.hit.preview}">${r.title}</a>
             </div></td>` +
                       `<td style="text-align:center"><a target="_blank" ${r.hit.panda
                         ? 'href="' + r.hit.panda + '"'
                         : ''}>${r.pay}</a></td>` +
                       `<td style="text-align:center" >${r.numHits}</td>` +
                       `<td style="text-align:center"><a class="static toLink" target="_blank" data-rid="${r.requester.id
                         ? r.requester.id
                         : 'null'}" ` +
                       (r.requester.id ? 'href="' + TO_REPORTS + r.requester.id + '"' : '') + '>' +
                       (r.TO ? r.TO.attrs.pay : 'n/a') + createTooltip('to', r.TO) + '</a></td>' +
                       `<td class="${r.masters ? 'reqmaster' : 'nomaster'}" style="text-align:center">${r.masters
                         ? 'Y'
                         : 'N'}</td>` +
                       `<td class="db nohitDB" data-index="requester${r.requester.id ? 'Id' : 'Name'}" 
              data-value="${r.requester[r.requester.id ? 'id' : 'name']}" data-cmp-value="${r.title}" 
              data-cmp-index="title" style="text-align:center;cursor:default">R</td>` +
                       `<td class="db nohitDB" data-index="title" data-value="${r.title}" data-cmp-value="${r.requester.name}" 
              data-cmp-index="requesterName" style="text-align:center;cursor:default">T</td>` +
                       `${r.qualified ? '' : '<td class="tooweak" title="Not qualified to work on this HIT">NQ</td>'}` +
                       '</tr>';
              },//}}}
              setRowColor                                                      = r => {
                var _t = Settings.user.colorType;
                if (!r.TO || r.TO.reviews < 5) {
                  r.rowColor = 'toNone';
                  return;
                }
                r.rowColor = getClassFromValue(_t === 'sim' ? r.TO.attrs.qual : r.TO.attrs.adjQual, _t);
              },
              bubbleNewHits                                                    = a => {
                var _new, _old = [];
                _new = a.filter(v => v.shine ? true : _old.push(v) && false);
                return _new.concat(_old);
              };

          if (reviews) scraperHistory.updateTOData(prepReviews(reviews));
          let results = scraperHistory.filter(v => {
            if (!v.current) return false;
            v.current = false;
            if (Settings.user.mhide && v.masters) return false;
            else return true;
          });

          // sorting
          if (!Interface.isLoggedout && !Settings.user.disableTO && Settings.user.sortPay !== Settings.user.sortAll) {
            if (Settings.user.sortPay)
              field = Settings.user.sortType === 'sim' ? 'pay' : 'adjPay';
            else if (Settings.user.sortAll)
              field = Settings.user.sortType === 'sim' ? 'qual' : 'adjQual';

            results.sort((a, b) => {
              a = a.TO ? +a.TO.attrs[field] : 0;
              b = b.TO ? +b.TO.attrs[field] : 0;
              return b - a;
            });
            if (Settings.user.sortAsc) results.reverse();
          } else
            results.sort((a, b) => a.index - b.index);

          // populating
          const counts = { total: results.length, new: 0, newVis: 0, ignored: 0, blocked: 0, included: 0, incNew: 0 };
          for (let r of (Settings.user.bubbleNew ? bubbleNewHits(results) : results)) {
            var shouldHide = Boolean((Settings.user.hideBlock && r.blocked) || (Settings.user.hideNoTO && !r.TO) ||
                                     (Settings.user.minTOPay && r.TO && +r.TO.attrs.pay < +Settings.user.minTOPay));
            counts.new += r.isNew ? 1 : 0;
            counts.newVis += r.isNew && !shouldHide ? 1 : 0;
            counts.ignored += shouldHide ? 1 : 0;
            counts.blocked += r.blocked ? 1 : 0;
            counts.included += r.included ? 1 : 0;
            counts.incNew += r.included && r.isNew ? 1 : 0;
            setRowColor(r);
            html.push(addRowHTML(r));
          }
          table.innerHTML = html.join('');
          this.notify(counts);

          Array.from(table.querySelectorAll('.db')).forEach(v => HITStorage.test(v));

          if (this.active) {
            if (this.cooldown === 0) Interface.buttons.main.click();
            else {
              this.timer = setTimeout(this.cruise.bind(this), 1000);
              Interface.Status.append(`<br />Scraping again in ${this.cooldown} seconds`);
            }
          }
          results = null;
          reviews = null;
          this.lastScrape = Date.now();
        },//}}}
        getHash   : function(str) {//{{{
          var hash = 0, ch;
          for (var i = 0; i < str.length; i++) {
            ch = str.charCodeAt(i);
            hash = ch + (hash << 6) + (hash << 16) - hash;
          }
          return hash;
        },//}}} Core::getHash
        fetch     : function(url, payload, responseType, inline) {//{{{
          const enc = window.encodeURIComponent;
          responseType = responseType || 'document';
          inline = inline === undefined ? true : inline;
          if (payload) {
            const key = ENV.HOST === ENV.NEXT ? 'next' : 'legacy';
            payload = payload[key];
            url += '?' + Object.entries(payload).map(stringify).join('&');
          }

          function stringify(v) {
            const predicate = typeof v[1] !== 'string' && !(v[1] instanceof Array) ? Object.entries(v[1]) : '';
            if (predicate.length)
              return predicate.map(vp => (vp[0] = enc(`${v[0]}[${vp[0]}]`)) && vp) // 0 = o[i] => o%5Bi%5D
                              .map(stringify)
                              .join('&');
            return `${v[0]}=${enc(v[1])}`;
          }

          const _p = new Promise(function(accept, rej) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = responseType;
            xhr.timeout = 6000;
            xhr.send();
            xhr.onload = function() {
              if (this.status === 200) accept(this.response);
              else rej(new Error(this.status + ' - ' + this.statusText));
            };
            xhr.onerror = function() {
              rej(new Error(this.status + ' - ' + this.statusText));
              console.log('error: ', this);
            };
            xhr.ontimeout = function() {
              rej(new Error('Request timed out - ' + url));
              console.log('timeout: ', this);
            };
          });
          const source = url.split('?')[0].includes('turkopticon') ? 'external' : 'internal';
          if (inline) _p.then(this.dispatch.bind(this, source), err => {
            console.warn(err);
            this.meld.apply(this);
          });
          else return _p;
        },//}}} Core::fetch
        crossRef  : function(...needles) {//{{{
          var found = [false, false], s;
          if (Settings.user.onlyIncludes) { // everything not in includelist gets blocked, unless includelist is empty or doesn't exist
            var list = (localStorage.getItem('scraper_include_list') || '').toLowerCase().split('^');
            if (list.length === 1 && !list[0].length) return found; // includelist is empty
            for (s of needles) {
              found[1] = Boolean(~list.indexOf(s.toLowerCase().replace(/\s+/g, ' ')));
              if (found[1]) {
                found[0] = false;
                break;
              } else
                found[0] = true;
            }
            return found;
          } else {
            if (localStorage.getItem('scraper_ignore_list') === null) new Editor().setDefaultBlocks();
            var blist      = (localStorage.getItem('scraper_ignore_list') || '').toLowerCase().split('^'),
                ilist      = (localStorage.getItem('scraper_include_list') || '').toLowerCase().split('^'),
                blist_wild = Settings.user.wildblocks ? blist.filter(v => /.*?[*].*/.test(v)) : null;
            if (blist_wild) blist_wild.forEach((v, i, a) =>
                                                 a[i] = new RegExp('^' + (v.replace(/([+${}[\](\)^|?.\\])/g, '\\$1') // escape non wildcard special chars
                                                                           .replace(/([^*]|^)[*](?!\*)/g, '$1.*') // turn
                                                                           // glob
                                                                           // into
                                                                           // regex
                                                                           .replace(/\*{2,}/g, s => s.replace(/\*/g, '\\$&'))) + '$'), 'i'); // escape consecutive asterisks
            for (s of needles) {
              found[0] = found[0] || Boolean(~blist.indexOf(s.toLowerCase().replace(/\s+/g, ' ')));
              found[1] = found[1] || Boolean(~ilist.indexOf(s.toLowerCase().replace(/\s+/g, ' ')));
              if (blist_wild && blist_wild.length && !found[0])
                for (var i = 0; !found[0] && i < blist_wild.length; i++) found[0] = blist_wild[i].test(s.toLowerCase().replace(/\s+/g, ' '));
            }
            return found; // [ blocklist,includelist ]
          }
        },//}}} Core::crossRef
        notify    : function(c) {//{{{
          var s = ['Scrape Complete: '];
          s.push(c.total > 0 ? `${c.total} HIT${c.total > 1 ? 's' : ''}` : '<b>No HITs found.</b>');
          if (c.new) s.push(`<i></i>${c.new} new`);
          if (c.newVis !== c.new) s.push(` (${c.newVis} shown)`);
          if (c.included) s.push(`<i></i><b>${c.included} from includelist</b>`);
          if (c.ignored) s.push(`<i></i>${c.ignored} hidden -- `);
          if (c.blocked) s.push(`${c.ignored ? '' : '<i></i>'}${c.blocked} from blocklist`);
          if (c.ignored - c.blocked > 0) s.push(`${c.blocked
            ? '<i></i>'
            : ''}${c.ignored - c.blocked} below TO threshold`);
          Interface.Status.push(s.join(''));

          if (c.newVis && Settings.user.notifySound[0]) document.getElementById(Settings.user.notifySound[1]).play();
          if (!c.newVis || Interface.focused) return;
          document.title = `[${c.newVis} new]` + DOC_TITLE;
          if (Settings.user.notifyBlink) Interface.blackhole.blink =
            setInterval(() => document.title = /scraper/i.test(document.title)
              ? `${c.newVis} new HITs`
              : DOC_TITLE, 1000);
          if (Settings.user.notifyTaskbar && Notification.permission === 'granted') {
            var inc = c.incNew ? ` (${c.incNew} from includelist)` : '',
                n   = new Notification('HITScraper found ' + c.newVis + ' new HITs' + inc);
            n.onclick = n.close;
            setTimeout(n.close.bind(n), 5000);
          }
        }//}}} Core::notify
      },//}}} Core

      Exporter    = function(e) {//{{{
        Interface.toggleOverflow('on');
        this.caller = e.target;
        this.node = document.body.appendChild(document.createElement('DIV'));
        this.node.classList.add('pop');
        this.die = () => {
          Interface.toggleOverflow('off');
          this.node.remove();
        };
        this.record = scraperHistory.get(this.caller.dataset.gid);

        if (Interface.isLoggedout) return this.die();

        var _vb   = () => {//{{{
              var
                getColor       = attr => {
                  switch (attr) {
                    case 5:
                    case 4:
                      return 'green';
                    case 3:
                      return 'yellow';
                    case 2:
                      return 'orange';
                    case 1:
                      return 'red';
                    default:
                      return 'white';
                  }
                },
                templateVars   = {//{{{
                  title        : this.record.title,
                  requesterName: this.record.requester.name,
                  requesterLink: this.record.requester.link,
                  requesterId  : this.record.requester.id,
                  description  : this.record.desc,
                  reward       : this.record.pay,
                  quals        : this.record.quals.join(';').replace(/(;?)(\w* ?Masters.+?)(;?)/g, '$1[COLOR=red][b]$2[/b][/COLOR]$3'),
                  previewLink  : this.record.hit.preview,
                  pandaLink    : this.record.hit.panda,
                  time         : this.record.time,
                  numHits      : this.record.numHits,
                  toImg        : '', // deprecated
                  toCompact    : (function() {//{{{
                    var _to = this.record.TO, txt = ['[b]'], color;
                    if (!_to) return 'TO Unavailable';
                    for (var a of ['comm', 'pay', 'fair', 'fast']) {
                      color = getColor(Math.floor(_to.attrs[a]));
                      txt.push(`[ ${a}: [COLOR=${color}]${_to.attrs[a]}[/COLOR] ]`);
                    }
                    return txt.join('') + '[/b]';
                  }).apply(this),//}}} toCompact
                  toVerbose    : (function() {//{{{
                    var _to = this.record.TO, txt = [], color, _attr, sym = Settings.user.vbSym,
                        _long                                             = { comm: 'Communicativity', pay: 'Generosity', fair: 'Fairness', fast: 'Promptness' };
                    if (!_to) return 'TO Unavailable';
                    for (var a of ['comm', 'pay', 'fair', 'fast']) {
                      _attr = Math.floor(_to.attrs[a]);
                      color = getColor(_attr);
                      txt.push((_attr > 0 ? (`[COLOR=${color}]${sym.repeat(_attr)}[/COLOR]` + (_attr < 5
                        ? `[COLOR=white]${sym.repeat(5 - _attr)}[/COLOR]`
                        : ''))
                        : '[COLOR=white]' + sym.repeat(5) + '[/COLOR]') + ` ${_to.attrs[a]} ${_long[a]}`);
                    }
                    return txt.join('\n');
                  }).apply(this),//}}} toText
                  toFoot       : (function() {//{{{
                    var _to       = this.record.TO,
                        payload   = `requester[amzn_id]=${this.record.requester.id}&requester[amzn_name]=${this.record.requester.name}`,
                        newReview = `[URL="${TO_BASE + 'report?' + payload}"]Submit a new TO review[/URL]`;
                    if (!_to) return newReview;
                    return `Number of Reviews: ${_to.reviews} | TOS Flags: ${_to.tos_flags}\n` + newReview;
                  }).apply(this)//}}} toFoot
                },//}}} templateVars obj
                createTemplate = function(str) {
                  /*jshint -W054*/ // ignore evil due to required eval (function constructor)
                  // TODO: find a concise way to dynamically generate a template without using eval
                  var _str = str.replace(/\$\{ *([-\w\d.]+) *\}/g, (_, p1) => `\$\{vars.${p1}\}`);
                  return new Function('vars', `try {return \`${_str}\`} catch(e) {return "Error in template: "+e.message}`);
                };
              templateVars.toText = templateVars.toVerbose; // temporary backwards compatibility
              this.node.innerHTML = '<p>vB Export</p>' +
                                    '<textarea style="display:block;padding:2px;margin:auto;height:250px;width:500px" tabindex="1">' +
                                    createTemplate(Settings.user.vbTemplate)(templateVars) + '</textarea>' +
                                    '<button id="exTemplate" style="margin-top:5px;width:50%;color:white;background:black">Edit Template</button>' +
                                    '<button id="exClose" style="margin-top:5px;width:50%;color:white;background:black">Close</button>';
              this.node.querySelector('#exTemplate').onclick = () => {
                this.die();
                new Editor('vbTemplate', this.caller);
              };
              this.node.querySelector('#exClose').onclick = this.die;
              this.node.querySelector('textarea').select();
            },//}}}
            _irc  = () => {//{{{
              // custom MTurk/TO url shortener courtesy of Tjololo
              var api                       = 'https://ns4t.net/yourls-api.php?action=bulkshortener&title=MTurk&signature=39f6cf4959',
                  urlArr = [], payload, sym = '\u2022', // sym = bullet
                  getTO                     = () => {
                    var _to = this.record.TO;
                    if (!_to) return 'Unavailable';
                    else return `Pay=${_to.attrs.pay} Fair=${_to.attrs.fair} Comm=${_to.attrs.comm}`;
                  };

              urlArr.push(window.encodeURIComponent(this.record.requester.link));
              urlArr.push(window.encodeURIComponent(this.record.hit.preview));
              urlArr.push(window.encodeURIComponent(TO_REPORTS + this.record.requester.id));
              urlArr.push(window.encodeURIComponent(this.record.hit.panda));
              payload = '&urls[]=' + urlArr.join('&urls[]=');

              this.node.innerHTML = '<span style="font-size:16px">Shortening URLs... <i class="spinner"></i></span>';
              Core.fetch(api + payload, null, 'text', false).then(r => {
                urlArr = r.split(';').slice(0, 4);
                this.node.innerHTML = '<p>IRC Export</p>' +
                                      '<textarea style="display:block;padding:2px;margin:auto;height:130px;width:500px" tabindex="1">' +
                                      (/masters/i.test(this.record.quals.join()) ? `MASTERS ${sym} ` : '') +
                                      `Requester: ${this.record.requester.name} ${urlArr[0]} ${sym} HIT: ${this.record.title} ` +
                                      `${urlArr[1]} ${sym} Pay: ${this.record.pay} ${sym} Avail: ${this.record.numHits} ${sym} ` +
                                      `Limit: ${this.record.time} ${sym} TO: ${getTO()} ${urlArr[2]} ${sym} PandA: ${urlArr[3]}</textarea>` +
                                      '<button id="exClose" style="width:100%;padding:5px;margin-top:5px;background:black;color:white">Close</button>';
                this.node.querySelector('textarea').select();
                this.node.querySelector('#exClose').onclick = this.die;
              }, err => {
                console.error(err);
                this.die();
              });
            },//}}}
            _hwtf = () => {//{{{
              var _location = 'ICA', _quals, _masters = '', _title, _r = this.record, tIndex;
              // format qualifications string
              _quals = _r.quals.map(v => {
                if (/(is US|: US$)/.test(v))
                  _location = 'US';
                else if (/Masters/.test(v))
                  _masters = `[${v.match(/.*Masters/)[0].toUpperCase()}]`;
                else if (/approv[aled]+ (rate|HITs)/.test(v))
                  return v.replace(/.+ is (.+) than (\d+)/, (_, p1, p2) => {
                    if (/^(not g|less)/.test(p1)) return '<' + p2 + (/%/.test(_) ? '%' : '');
                    else if (/^(not l|greater)/.test(p1)) return '>' + p2 + (/%/.test(_) ? '%' : '');
                    else console.error('match error', [_, p1, p2]);
                    return _;
                  });
                else
                  return v;
              }).filter(v => v).sort(a => /[><]/.test(a) ? -1 : 1);
              _title = `${_location} - ${_r.title} - ${_r.requester.name} - ${_r.pay}/COMTIME - (${_quals.join(', ') || 'None'}) ${_masters}`;
              tIndex = _title.search(/COMTIME/);
              this.node.style.whiteSpace = 'nowrap';
              this.node.innerHTML = '<p style="width:500px;white-space:normal">' +
                                    '/r/HitsWorthTurkingFor Export: Use the buttons on the left for single-click copying. ' +
                                    'Before you post, please remember to replace "COMTIME" with how long it took you to complete the HIT.</p>' +
                                    '<button class="exhwtf" style="height:65px">Title</button>' +
                                    '<textarea style="padding:2px;margin:auto;height:60px;width:430px;resize:none" tabindex="1" autofocus>' +
                                    _title + '</textarea><br />' + '<button class="exhwtf" style="height:35px">Preview</button>' +
                                    '<textarea style="padding:2px;margin:auto;height:30px;width:430px;resize:none" tabindex="2">' +
                                    'Preview: ' + _r.hit.preview + '</textarea><br />' + '<button class="exhwtf" style="height:35px;">Req</button>' +
                                    '<textarea style="padding:2px;margin:auto;height:30px;width:430px;resize:none" tabindex="3">' +
                                    'Req: ' + _r.requester.link + '</textarea><br />' + '<button class="exhwtf" style="height:35px;">PandA</button>' +
                                    '<textarea style="padding:2px;margin:auto;height:30px;width:430px;resize:none" tabindex="4">' +
                                    'PandA: ' + _r.hit.panda + '</textarea><br />' + '<button class="exhwtf" style="height:35px;">TO</button>' +
                                    '<textarea style="padding:2px;margin:auto;height:30px;width:430px;resize:none" tabindex="5">' +
                                    'TO: ' + TO_REPORTS + _r.requester.id + '</textarea><br />' +
                                    '<button id="exClose" style="width:100%;padding:5px;margin-top:5px;background:black;color:white">Close</button>';

              var copyfn = function(e) {
                e.target.nextSibling.select();
                document.execCommand('copy');
              };
              Array.from(this.node.querySelectorAll('.exhwtf')).forEach(v => v.onclick = copyfn);
              this.node.querySelector('#exClose').onclick = this.die;
              this.node.querySelector('textarea').setSelectionRange(tIndex, tIndex + 7);
            };//}}}

        switch (this.caller.textContent.toLowerCase()) {
          case 'vb':
            _vb();
            break;
          case 'irc':
            _irc();
            break;
          case 'hwtf':
            _hwtf();
            break;
        }
      },//}}} Exporter

      HITStorage  = {//{{{
        db    : null,
        attach: function(name) {//{{{
          var dbh = window.indexedDB.open(name);
          dbh.onversionchange = e => {
            e.target.result.close();
            console.info('DB connection closed by external source');
          };
          dbh.onsuccess = e => this.db = e.target.result;
        },//}}} HITStorage::attach
        test  : function(node) {//{{{
          if (!this.db || !this.db.objectStoreNames.contains('HIT')) return;
          this.db.transaction('HIT', 'readonly').objectStore('HIT').index(node.dataset.index).get(node.dataset.value)
            .onsuccess = e => { if (e.target.result) node.className = node.className.replace(/no/, ''); };
        },//}}} HITStorage::test
        query : function(node) {//{{{
          var range = window.IDBKeyRange.only(node.dataset.value), results = [];
          return new Promise((a, r) => {
            if (!this.db || !this.db.objectStoreNames.contains('HIT')) r(0);
            this.db.transaction('HIT', 'readonly').objectStore('HIT').index(node.dataset.index).openCursor(range)
              .onsuccess = e => {
              if (e.target.result) {
                results.push(e.target.result.value);
                e.target.result.continue();
              } else
                a(results.sort((a, b) => a.date > b.date ? 1 : -1));
            };
          });
        }//}}} HITStorage::query
      },//}}} HITStorage

      FileHandler = {//{{{
        exports: function() {//{{{
          var obj  = {
                settings    : JSON.stringify(Settings.user),
                ignore_list : localStorage.getItem('scraper_ignore_list') || '',
                include_list: localStorage.getItem('scraper_include_list') || ''
              },
              blob = new Blob([JSON.stringify(obj)], { type: 'application/json' }),
              a    = document.body.appendChild(document.createElement('a'));
          a.href = URL.createObjectURL(blob);
          a.download = 'hitscraper_settings.json';
          a.click();
          a.remove();
        },//}}}
        imports: function(e) {//{{{
          var f       = e.target.files,
              invalid = () => Settings.main.querySelector('#eisStatus').textContent = 'Invalid file.';
          if (!f.length) return;
          if (!f[0].name.includes('json')) return invalid();
          var reader = new FileReader();
          reader.readAsText(f[0]);
          reader.onload = function() {
            var obj;
            try { obj = JSON.parse(this.result); } catch(err) { return invalid(); }
            for (var key of ['settings', 'ignore_list', 'include_list']) {
              if (key in obj && typeof obj[key] === 'string')
                localStorage.setItem('scraper_' + key, obj[key]);
            }
            initialize();
          };
        }//}}}
      };//}}} FileHandler

  function initialize() {//{{{
    Settings.user = Object.assign({}, Settings.defaults, JSON.parse(localStorage.getItem('scraper_settings')));
    Interface.draw().init();
    scraperHistory = new ScraperCache(650);
  }//}}}

  function createTooltip(type, obj) {//{{{
    var html, bullet = li => `<ul><li>${li}</li></ul>`,
        reason       = Settings.user.disableTO ? bullet('TO disabled in user settings')
          : (Interface.isLoggedout ? bullet('Cannot retrieve TO while logged out')
            : (obj === '' ? bullet('Requester has not been reviewed yet') : bullet('Invalid response from server'))),
        _genMeters   = function() {
          var attrmap = { comm: 'Communicativity', pay: 'Generosity', fair: 'Fairness', fast: 'Promptness' }, html = [];
          for (var k in attrmap) {
            if (attrmap.hasOwnProperty(k)) {
              html.push(`<meter min="0.8" low="2.5" high="3.4" optimum="5" max="5" value=${obj.attrs[k]} data-attr=${attrmap[k]}></meter>`);
            }
          }
          if (ENV.ISFF) // firefox is shitty and doesn't support ::after/::before pseudo-elements on meter elements
            html.forEach((v, i, a) => a[i] = '<div style="position:relative">' + v +
                                             `<span class="ffmb">${attrmap[Object.keys(attrmap)[i]]}</span>` +
                                             `<span class="ffma">${obj.attrs[Object.keys(attrmap)[i]]}</span></div>`);
          return html.join('');
        };

    if (!obj) {
      html = `<div class="tooltip" style="width:260px;"><p style="padding-left:5px">Turkopticon data unavailable:${reason}</p></div>`;
    } else if (type === 'to')
      html = `<div class="tooltip" style="width:260px">
        <p style="padding-left:5px"><b>${obj.name}</b><br />Reviews: ${obj.reviews} | TOS Flags: ${obj.tos_flags}</p>
        ${_genMeters()}</div>`;
    /*<table style="margin-top:6px;width:100%;font-size:10px"><tr><td>Adjusted Pay</td><td>${obj.attrs.adjPay}</td>
    <td>${getClassFromValue(obj.attrs.adjPay, 'adj').slice(2)}</td></tr><tr><td>Weighted Score</td><td>${obj.attrs.qual}</td>
    <td>${getClassFromValue(obj.attrs.qual, 'sim').slice(2)}</td></tr><tr><td>Adjusted Score</td><td>${obj.attrs.adjQual}</td>
    <td>${getClassFromValue(obj.attrs.adjQual, 'adj').slice(2)}</td></tr></table></div>;*/
    else // XXX not used atm
      html = `<div class="tooltip" style="width:300px"><dl><dt>description</dt><dd>${obj.desc}</dd>
        <dt>qualifications</dt><dd>${obj.quals}</dd></dl>`;

    return html;
  }//}}}

  function prepReviews(reviews) {
    const adj = (x, n) => ((x * n + 15) / (n + 5)) - 1.645 * Math.sqrt((Math.pow(1.0693 * x, 2) - Math.pow(x, 2)) / (n + 5));
    Object.keys(reviews).forEach(rid => {
      if (typeof reviews[rid] === 'string') return delete reviews[rid]; // no reviews yet

      //adjust ratings
      let n = 0, d = 0;
      Object.keys(reviews[rid].attrs).forEach(attr => {
        n += reviews[rid].attrs[attr] * Settings.user.toWeights[attr];
        d += +Settings.user.toWeights[attr];
      });
      reviews[rid].attrs.qual = (n / d).toPrecision(4);
      reviews[rid].attrs.adjQual = adj(n / d, +reviews[rid].reviews).toPrecision(4);
      reviews[rid].attrs.adjPay = adj(+reviews[rid].attrs.pay, +reviews[rid].reviews).toPrecision(4);
    });
    return reviews;
  }

  class Cache {
    constructor(limit = 500) {
      this.limit = limit;
      this._length = 0;
      this._cache = Object.create(null);
      this._tmp = Object.create(null);
    }

    get(key) {
      let val = this._cache[key];
      if (val)
        return val;
      else if ((val = this._tmp[key]))
        return this._update(key, val);
      else
        return null;
    }

    set(key, value) {
      if (this._cache[key])
        return (this._cache[key] = value);
      else
        this._update(key, value);
    }

    has(key) {
      return !!this.get(key);
    }

    _update(key, value) {
      this._cache[key] = value;
      if (++this._length > this.limit) {
        this._length = 0;
        this._tmp = this._cache;
        this._cache = Object.create(null);
      }
      return value;
    }
  }

  class ScraperCache extends Cache {
    constructor(limit = 500) {
      super(limit);
      this._toCache = new TOCache();
    }

    set(key, value) {
      const first = !Core.lastScrape;
      if (this.get(key)) { // exists
        const age = Math.floor((Date.now() - this._cache[key].discovery) / 1000),
              obj = { isNew: false, shine: !!(this._cache[key].shine && age < +Settings.user.shine && !first) };
        value.discovery = this._cache[key].discovery;
        return (this._cache[key] = Object.assign(value, obj));
      } else { // new
        const obj = { isNew: !first, shine: !first, TO: this._toCache.get(value.requester.id) };
        this._update(key, Object.assign(value, obj));
      }
    }

    filter(callback, rids = false) {
      const results = [], keys = Object.keys(this._cache);
      Object.keys(this._cache).forEach(key => {
        const val = this.get(key);
        if (callback(val, key, this._cache))
          results.push(rids ? val.requester.id : val);
      });
      return results;
    }

    updateTOData(reviews) {
      this._toCache.setBatch(reviews);
      this.filter(v => v.current && v.TO === null).forEach(group => {
        if (this._toCache.has(group.requester.id))
          this._cache[group.groupId].TO = Object.assign(this._toCache.get(group.requester.id), { name: group.requester.name });
      });
    }
  }

  class TOCache extends Cache {
    setBatch(reviews) {
      if (!reviews) return null;
      Object.keys(reviews).forEach(rid => this._update(rid, reviews[rid]));
      return reviews;
    }
  }

  const kb = { ESC: 27, ENTER: 13 };

  function Dialogue(caller) {//{{{
    Interface.toggleOverflow('on');
    this.node = document.body.appendChild(document.createElement('DIV'));
    this.die = () => {
      Interface.toggleOverflow('off');
      this.node.remove();
    };
    this.node.style.cssText = 'position:fixed;z-index:20;top:15%;left:50%;width:320px;padding:20px;transform:translate(-50%);' +
                              'background:#000;color:#fff;box-shadow:0px 0px 6px 1px #fff';
    var target = caller.textContent === 'R' ? 'requester' : 'title';
    this.node.innerHTML = `<p><b>Add this ${target} to the blocklist?</b></p><p>"${caller.value}"</p>
      <div style="text-align:right;margin-right:30px;margin-top:10px;padding-top:10px">
      <button id="confirm" style="font-weight:bold;padding:7px;width:65px">OK</button>
      <button id="cancel" style="padding:7px;width:65px;">Cancel</button></div>`;
    this.node.querySelector('#confirm').onclick = () => {
      var bl = localStorage.getItem('scraper_ignore_list'), bstr = caller.value.toLowerCase().replace(/\s+/g, ' ');
      if (!bl) bl = bstr;
      else if (bl.slice(-1) === '^') bl += bstr;
      else bl += '^' + bstr;
      localStorage.setItem('scraper_ignore_list', bl);

      Array.prototype.forEach.call(document.getElementById('resultsTable').tBodies[0].rows, v => {
        var c0 = v.cells[0].lastChild.textContent, c1 = v.cells[1].lastChild.textContent.trim();
        if (v.classList.contains('blocklisted') || c0 !== caller.value && c1 !== caller.value) return;
        v.cells[0].firstChild.remove();
        return v.classList.add('blocklisted') || Settings.user.hideBlock && v.classList.add('hidden');
      });
      this.die();
    };
    this.node.querySelector('#cancel').onclick = this.die;
    this.node.addEventListener('keydown', e => {
      if (e.keyCode === kb.ESC)
        this.die();
    }, true);
    this.node.querySelector('#confirm').focus();
  }//}}}

  function DBQuery(node) {//{{{
    Interface.toggleOverflow('on');
    this.node = document.body.appendChild(document.createElement('DIV'));
    this.die = () => {
      this.node.remove();
      Interface.toggleOverflow('off');
    };
    this.node.style.cssText = 'position:fixed;z-index:20;top:50%;left:50%;padding:8px;' +
                              'background:#fff;color:#000;box-shadow:0px 0px 6px 1px #bfbfbf;transform:translate(-50%,-50%);';
    this.node.innerHTML = '<div style="text-align:center;font-size:16px;"><p><b>Querying database... <i class="spinner"></i></b></p></div>';
    HITStorage.query(node).then(r => {
      var _tbody = [], _tfoot, t = { hits: 0, app: 0, rej: 0, pen: 0 },
          _thead                 = '<tr style="background:lightgrey;color:black"><th style="width:90px;padding:5px">Date</th>' +
                                   '<th style="width:120px">Requester</th><th>Title</th><th>Pay</th><th>Bonus</th><th>Status</th><th>Feedback</th></tr>',
          html                   = '<div style="position:absolute;top:0;left:0;margin:0;text-align:right;padding:0px;border:none;width:100%">' +
                                   '<label id="close" class="close" title="Close">&#160;&#10008;&#160;</label></div>';
      if (!r.length)
        html += `<h2>Nothing found matching "${node.dataset.value}"</h2>`;
      else {
        r.forEach((v, i) => {
          var _pay, _bonus, _sc, _bg;
          if (typeof v.reward === 'object') {
            _pay = '$' + v.reward.pay.toFixed(2);
            _bonus = v.reward.bonus > 0 ? '$' + v.reward.bonus.toFixed(2) : '';
          } else {
            _pay = '$' + v.reward.toFixed(2);
            _bonus = '';
          }

          _sc = /(paid|approved)/i.test(v.status) ? 'green' : (/approval/i.test(v.status) ? 'orange' : 'red');
          _bg = v[node.dataset.cmpIndex] === node.dataset.cmpValue ? 'lightgreen' : (i % 2 ? '#F1F3EB' : '#fff');
          _tbody.push(`<tr style="background:${_bg}">
            <td>${v.date}</td><td>${v.requesterName}</td><td>${v.title}</td><td>${_pay}</td><td>${_bonus}</td>
            <td style="color:${_sc}">${v.status}</td><td>${v.feedback}</td></tr>`);
          t.hits++;
          t.app += /(paid|approved)/i.test(v.status) ? +_pay.slice(1) : 0;
          t.rej += /rejected/i.test(v.status) ? +_pay.slice(1) : 0;
          t.pen += /approval/i.test(v.status) ? +_pay.slice(1) : 0;
        });
        _tfoot = `<tr style="background:lightgrey;text-align:center"><td colspan="7">${t.hits} HITs: $${t.app.toFixed(2)} approved, 
          $${t.pen.toFixed(2)} pending, $${t.rej.toFixed(2)} rejected</td>`;
        html += `<div style="margin-top:20px;width:100%;height:calc(100% - 20px);overflow:auto">
          <table style="border:1px solid black;border-collapse:collapse;width:100%">
          <thead>${_thead}</thead><tbody>${_tbody.join('')}</tbody><tfoot>${_tfoot}</tfoot></table></div>`;
      }
      this.node.style.cssText += `width:85%;${r.length ? 'height:85%;' : 'max-height:85%;'}`;
      this.node.innerHTML = html;
      this.node.querySelector('#close').onclick = this.die;
    }, () => this.die());
  }//}}}

  // helpers
  function on(target, type, handler) { target.addEventListener(type, handler); }

  function delegate(target, selector, type, handler) {
    function dispatcher(event) {
      const targets = target.querySelectorAll(selector);
      let i = targets.length;

      while (i--) {
        if (event.target === targets[i]) {
          handler(event);
          break;
        }
      }
    }

    on(target, type, dispatcher);
  }

  Object.entries = Object.entries || function(obj) {
    const props = Object.keys(obj);
    let i = props.length;
    const objArray = new Array(i);
    while (i--) objArray[i] = [props[i], obj[props[i]]];
    return objArray;
  };

  // event handlers
  function tomouseover(e) {
    e.target.children[0].style.display = 'block';
    const tt = e.target.children[0], rect = tt.getBoundingClientRect();
    if (rect.height > (window.innerHeight - e.clientY)) tt.style.transform = 'translateY(calc(-100% + 22px))';
  }

  function tomouseout(e) {
    const tt = e.target.querySelector('.tooltip');
    if (!tt) return;
    tt.style.transform = '';
    tt.style.display = 'none';
  }

  // ep
  console.log('HS hook');
  if (document.getElementById('control_panel')) {
    if (confirm('Another version of HITScraper was detected and has already claimed this page. Open HITScraper in a new tab?'))
      window.open('https://www.mturk.com/mturk/findhits?match=true?hit_scraper-dev');
  } else {
    initialize();
    HITStorage.attach('HITDB');
    const rt = document.getElementById('resultsTable');
    delegate(rt, 'tr:not(hidden) .toLink', 'mouseover', tomouseover);
    delegate(rt, 'tr:not(hidden) .toLink', 'mouseout', tomouseout);
    delegate(rt, 'tr:not(hidden) .ex', 'click', e => new Exporter(e));
    delegate(rt, 'tr:not(hidden) button[name=block]', 'click', ({ target }) => new Dialogue(target));
    delegate(rt, 'tr:not(hidden) .db', 'click', ({ target }) => new DBQuery(target));
  }

})();

// vim: ts=2:sw=2:et:fdm=marker:noai
