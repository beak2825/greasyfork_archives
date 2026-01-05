// ==UserScript==
// @name        Fallen London - Visible Air
// @namespace   fallenlondon/airs
// @description Uses the Airs of London text to display the Airs range in the result summary.
// @author      Travers
// @include     http://*fallenlondon.com/Gap/Load*
// @include     http://fallenlondon.storynexus.com/Gap/Load*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14149/Fallen%20London%20-%20Visible%20Air.user.js
// @updateURL https://update.greasyfork.org/scripts/14149/Fallen%20London%20-%20Visible%20Air.meta.js
// ==/UserScript==

var airs = [
['0', "Out on the city's edge, zee-bats cry where black waves break on a black shore."],
['1 - 10', "A bat zips past, not far overhead."],
['11 - 13', "The softest of rains falls in the street: the cobbles glisten like fish-skin."],
['14 - 15', "In the street outside, fly-drivers squabble in a half-dozen different tongues"],
['16 - 17', "A small child meditatively pings stones off a butcher's shop-window."],
['18 - 19', "A shuttered black coach passes. The horses' hooves are muffled with sacking."],
['20', "A devil lounges against a lamp-post, picking his teeth with a needle. He eyes you speculatively."],
['21 - 30', "Shadows lie still, here where there is no sun to move them. Sometimes they shiver in candle-light."],
['31 - 32', "A raven caws, coughs, and breaks into song. Something eighteenth-century?"],
['33 - 40', "The wall here is splotched with luxuriant russet fungus, like the fur of something mythical."],
['41 - 42', "Passers-by watch you with narrow eyes. What do they see?"],
['43 - 44', "Someone speaks your name. But when you turn, there is only a mirror."],
['45 - 46', "High above, the false-stars glimmer. Did one of them - move?"],
['47 - 50', "A window glows with the amber light of tallow-candles. Voices are raised in song."],
['51 - 60', "Today, something in the air makes the gas-lamps slink low, burn marsh-green."],
['61 - 62', "On the roof-tops at day's end, urchins whistle a tune from Mahogany Hall."],
['63 - 65', "Oof! That reek is a tannery. Hold your breath a moment."],
['66 - 68', "A glove-maker passes, holding his bag at arm's-length."],
['69 - 70', "The cobbles are slippery with a thick black moss."],
['71 - 72', "A cat's eyes glint on a high window-ledge."],
['73', "Stray dogs fight over something in the gutter. A human hand?"],
['74 - 75', "A barouche passes, drawn by a pair of perfectly matched greys."],
['76 - 80', "A scuffle! A pool of blood! A wild-eyed girl with a knife in either hand!"],
['81 - 82', "The light from the false-stars clings to every surface like oil."],
['83', "A phaeton roars past! The crowd scatters, the horses roll their eyes desperately!"],
['84 - 88', "Two costermongers stagger past, roaring drunk, their neckerchiefs alive with the colours of night."],
['89', "A portly man sits weeping in the road."],
['90', "A rat runs along an iron railing, leaping each spike like an acrobat."],
['91', "Today, water has a metallic taste. It generally does. But is this a different metal? Copper? Silver?"],
['92', "A cry goes up: \"Thief!\" A pale young woman hurdles a barrel and is gone into the endless night."],
['93', "A church bell tolls."],
['94', "Drizzle is falling all around, like slow glass, or tears."],
['95', "A huddled bundle lies in the gutter. Movement squirms beneath a blanket."],
['96', "The wind toys with paper-scraps in the gutter."],
['97', "A governess passes with a child on a leash. No! No, only a young woman and a little dog."],
['98', "A beetle the size of a boot sits atop a tar-barrel, nonchalantly twiddling its antennae."],
['99', "A scowling boy distributes hand-bills."],
['100', "All shall be well, and all manner of thing shall be well."]
];
    
setUpObserver();

function setUpObserver()
{
  var target = document.querySelector('#mainContentLoading');
  var peeper = new MutationObserver(markAirs);
  peeper.observe(target, {attributes: true, childList: false, characterData: false});
}

function markAirs()
{
  //Check all span element nodes for the Airs description text
  var spans = document.getElementsByTagName('span');
  for (var i = 0; i < spans.length; i++)
  {
    if (spans[i].hasAttribute('class'))
    { 
      if (spans[i].getAttribute('class').startsWith('tt'))
      {
        if (spans[i].innerHTML.startsWith('Not every day in the Neath is the same'))
        {
          //Based on the current structure of Fallen London results, this should be the node that we need.
          var airsTextNode = spans[i].parentNode.parentNode.parentNode.nextSibling;
          
          //However, we may need to skip over non-element nodes.
          while (airsTextNode.nodeType !== 1)
          {
            airsTextNode = airsTextNode.nextSibling;
          }
          
          //Compare the text that we found to the standard Airs texts and append the Airs range if found.
          var airsText = airsTextNode.innerHTML;
          for (var j = 0; j < airs.length; j++)
          {
            if (airsText.startsWith(airs[j][1]))
            {
              airsTextNode.innerHTML = airsText + "[" + airs[j][0] + "]";
            }
          }
        }    
      }
    }
  }
}