// ==UserScript==
// @name         Auto Word Code Validator
// @version      1.0
// @description  Detects fpl league codes that match specified patterns, and reloads on error
// @match        https://fantasy.premierleague.com/leagues/*/admin/c
// @namespace    moose
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544448/Auto%20Word%20Code%20Validator.user.js
// @updateURL https://update.greasyfork.org/scripts/544448/Auto%20Word%20Code%20Validator.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function run() {
    let stopped = false;
    let attempts = 0;

    // 🛑 Check for error message
    const bodyText = document.body.textContent || '';
    if (/Sorry, but there has been an unexpected error/i.test(bodyText)) {
      console.warn('⚠️ Detected error page — reloading...');
      setTimeout(() => location.reload(), 2000); // 2 second delay to prevent reload loop
      return;
    }

    // 🧠 Enhanced word sets
    const common6LetterWords = [
    'people', 'should', 'before', 'things', 'public', 'system', 'number', 'policy', 'change', 'family',
    'search', 'really', 'friend', 'around', 'others', 'design', 'office', 'making', 'mother', 'father',
    'course', 'thanks', 'always', 'across', 'action', 'inside', 'trying', 'simple', 'called', 'little',
    'wanted', 'united', 'better', 'entire', 'center', 'middle', 'moment', 'almost', 'itself', 'either',
    'higher', 'enough', 'second', 'reason', 'sister', 'market', 'create', 'source', 'single', 'person',
    'rather', 'figure', 'answer', 'nature', 'become', 'strong', 'pretty', 'secure', 'future', 'reduce',
    'though', 'spread', 'happen', 'street', 'appear', 'supply', 'record', 'issues', 'leader', 'turned',
    'myself', 'remain', 'chance', 'likely', 'notice', 'actual', 'detail', 'opened', 'moving', 'report',
    'result', 'import', 'effort', 'camera', 'couple', 'finger', 'expect', 'bought', 'safety', 'length',
    'island', 'picked', 'garden', 'ground', 'modern', 'broken', 'decide', 'silver', 'wonder', 'weapon',
    'beauty', 'secret', 'summer', 'matter', 'simply', 'artist', 'energy', 'player', 'agreed', 'memory',
    'method', 'pieces', 'weight', 'height', 'growth', 'branch', 'breath', 'bridge', 'bright', 'budget',
    'button', 'cancel', 'carbon', 'career', 'castle', 'caught', 'charge', 'choice', 'choose', 'church',
    'circle', 'client', 'closer', 'coffee', 'column', 'common', 'corner', 'county', 'credit', 'custom',
    'damage', 'danger', 'dealer', 'debate', 'defend', 'degree', 'demand', 'depend', 'desert', 'device',
    'differ', 'dinner', 'direct', 'divide', 'doctor', 'dollar', 'double', 'driver', 'during', 'easily',
    'editor', 'effect', 'employ', 'enable', 'engine', 'ensure', 'escape', 'estate', 'ethnic', 'exceed',
    'except', 'excuse', 'expand', 'expert', 'extend', 'extent', 'fabric', 'facial', 'factor', 'failed',
    'fairly', 'fallen', 'famous', 'farmer', 'fellow', 'female', 'filter', 'finish', 'fiscal', 'flight',
    'flower', 'follow', 'forced', 'forget', 'forgot', 'formal', 'format', 'former', 'fourth', 'freeze',
    'french', 'frozen', 'galaxy', 'garage', 'gather', 'gender', 'gentle', 'global', 'golden', 'guitar',
    'handle', 'headed', 'health', 'hidden', 'holder', 'honest', 'horror', 'hungry', 'hunter', 'impact',
    'income', 'indeed', 'indoor', 'infant', 'inform', 'injury', 'insert', 'insist', 'insure', 'intend',
    'invest', 'invite', 'jacket', 'joseph', 'jungle', 'junior', 'keeper', 'kidney', 'killed', 'killer',
    'kindly', 'knight', 'labour', 'landed', 'latter', 'launch', 'lawyer', 'league', 'leaves', 'legacy',
    'legend', 'lesson', 'letter', 'liable', 'lights', 'linear', 'liquid', 'listen', 'living', 'locate',
    'lonely', 'loving', 'manage', 'manner', 'marble', 'margin', 'marine', 'marked', 'marker', 'master',
    'mature', 'meadow', 'medium', 'member', 'mental', 'merger', 'mining', 'minute', 'mirror', 'missed',
    'mobile', 'modify', 'module', 'months', 'motion', 'muscle', 'museum', 'mutual', 'nation', 'native',
    'nearby', 'nearly', 'needle', 'neural', 'nobody', 'normal', 'object', 'obtain', 'occupy', 'occurs',
    'online', 'oppose', 'option', 'orange', 'origin', 'output', 'oxygen', 'packed', 'palace', 'panels',
    'papers', 'parade', 'parent', 'parish', 'partly', 'passed', 'patent', 'patrol', 'patron', 'paying',
    'period', 'permit', 'petrol', 'phases', 'photos', 'phrase', 'pierce', 'placed', 'planet', 'please',
    'plenty', 'pocket', 'poetry', 'police', 'polish', 'pollen', 'ponder', 'poorly', 'porter', 'poster',
    'potato', 'potent', 'potter', 'pounds', 'powder', 'praise', 'prayer', 'prefer', 'priest', 'prince',
    'prints', 'prison', 'profit', 'proper', 'proven', 'punish', 'purple', 'pursue', 'puzzle', 'quarry',
    'queens', 'quotes', 'rabbit', 'racial', 'racing', 'radius', 'random', 'rarely', 'rating', 'reader',
    'recall', 'recent', 'refers', 'refuse', 'regard', 'regime', 'region', 'relate', 'relief', 'remote',
    'remove', 'repair', 'repeat', 'replay', 'rescue', 'resent', 'resist', 'resort', 'resume', 'retail',
    'retire', 'return', 'reveal', 'review', 'revise', 'revolt', 'reward', 'riding', 'rights', 'rising',
    'ritual', 'rivers', 'accept', 'access', 'active', 'actual', 'advice', 'advise', 'affair', 'afford',
    'afraid', 'agency', 'agenda', 'animal', 'annual', 'anyone', 'anyway', 'appeal', 'arrive', 'artist',
    'asleep', 'aspect', 'assert', 'assess', 'assign', 'assist', 'assume', 'assure', 'attack', 'attain',
    'attend', 'author', 'autumn', 'avenue', 'backup', 'ballet', 'ballot', 'banana', 'banker', 'banner'
  ];
    const common5LetterWords = [
    'about', 'other', 'which', 'their', 'would', 'there', 'could', 'first', 'after', 'these',
    'three', 'every', 'great', 'might', 'still', 'small', 'found', 'those', 'never', 'under',
    'while', 'where', 'right', 'think', 'being', 'place', 'world', 'going', 'state', 'house',
    'group', 'level', 'money', 'today', 'water', 'power', 'light', 'until', 'local', 'party',
    'since', 'white', 'heart', 'music', 'early', 'black', 'human', 'clear', 'quite', 'death',
    'point', 'final', 'order', 'phone', 'learn', 'times', 'given', 'leave', 'woman', 'ready',
    'doing', 'known', 'short', 'using', 'paper', 'table', 'email', 'later', 'maybe', 'young',
    'field', 'story', 'terms', 'price', 'child', 'event', 'words', 'stuff', 'sorry', 'least',
    'night', 'heard', 'thing', 'years', 'women', 'seems', 'taken', 'comes', 'trial', 'makes',
    'offer', 'based', 'below', 'above', 'check', 'video', 'image', 'audio', 'along', 'focus',
    'voice', 'whose', 'movie', 'plant', 'scene', 'stock', 'issue', 'range', 'build', 'chain',
    'blood', 'index', 'raise', 'speak', 'chose', 'radio', 'visit', 'peace', 'apply', 'sleep',
    'entry', 'mouth', 'total', 'brief', 'cause', 'north', 'south', 'space', 'moved', 'stage',
    'green', 'quick', 'close', 'needs', 'cases', 'daily', 'carry', 'lived', 'bring', 'begin',
    'fresh', 'allow', 'alone', 'extra', 'chair', 'chart', 'cheap', 'chief', 'china', 'civil',
    'claim', 'class', 'clean', 'click', 'climb', 'clock', 'cloud', 'coach', 'coast', 'color',
    'comic', 'count', 'court', 'cover', 'craft', 'crash', 'crazy', 'cream', 'crime', 'cross',
    'crowd', 'crown', 'crude', 'curve', 'cycle', 'dance', 'dated', 'dealt', 'debut', 'delay',
    'depth', 'dirty', 'doubt', 'dozen', 'draft', 'drama', 'drank', 'dream', 'dress', 'drill',
    'drink', 'drive', 'drove', 'dying', 'eager', 'earth', 'eight', 'elite', 'empty', 'enemy',
    'enjoy', 'enter', 'equal', 'error', 'exact', 'exist', 'faith', 'false', 'fault', 'fiber',
    'fifth', 'fifty', 'fight', 'fixed', 'flash', 'fleet', 'floor', 'fluid', 'force', 'forth',
    'forty', 'forum', 'frame', 'frank', 'fraud', 'front', 'frost', 'fruit', 'fully', 'funny',
    'giant', 'glass', 'globe', 'glory', 'goods', 'grace', 'grade', 'grain', 'grand', 'grant',
    'grass', 'grave', 'gross', 'grown', 'guard', 'guess', 'guest', 'guide', 'happy', 'harry',
    'heavy', 'henry', 'horse', 'hotel', 'humor', 'hurry', 'ideal', 'inner', 'input', 'japan',
    'jimmy', 'joint', 'jones', 'judge', 'juice', 'label', 'large', 'laser', 'laugh', 'layer',
    'lease', 'legal', 'lewis', 'limit', 'links', 'liver', 'lives', 'logic', 'loose', 'lower',
    'lucky', 'lunch', 'lying', 'magic', 'major', 'maker', 'march', 'maria', 'match', 'mayor',
    'meant', 'media', 'metal', 'minor', 'minus', 'mixed', 'model', 'month', 'moral', 'motor',
    'mount', 'mouse', 'moved', 'needs', 'newly', 'noise', 'noted', 'novel', 'nurse', 'occur',
    'ocean', 'often', 'older', 'olive', 'organ', 'ought', 'owned', 'owner', 'paint', 'panel',
    'paris', 'peter', 'phase', 'photo', 'piano', 'piece', 'pilot', 'pitch', 'pizza', 'plain',
    'plane', 'plate', 'plays', 'plaza', 'pound', 'press', 'pride', 'prime', 'print', 'prior',
    'prize', 'proof', 'proud', 'prove', 'queen', 'quiet', 'rapid', 'ratio', 'reach', 'realm',
    'rebel', 'refer', 'relax', 'reply', 'river', 'robin', 'roger', 'roman', 'rough', 'round',
    'route', 'royal', 'rural', 'sales', 'sarah', 'scale', 'scope', 'score', 'sense', 'serve',
    'seven', 'shall', 'shape', 'share', 'sharp', 'sheet', 'shelf', 'shell', 'shift', 'shine',
    'shirt', 'shock', 'shoot', 'shown', 'sides', 'sight', 'simon', 'sixth', 'sixty', 'sized',
    'skill', 'slide', 'smart', 'smile', 'smith', 'smoke', 'snake', 'solid', 'solve', 'sound',
    'spare', 'speed', 'spend', 'spent', 'split', 'spoke', 'sport', 'squad', 'staff', 'stake',
    'stand', 'start', 'stays', 'steam', 'steel', 'stick', 'stock', 'stone', 'stood', 'store',
    'storm', 'strip', 'stuck', 'study', 'style', 'sugar', 'suite', 'super', 'sweet', 'swing',
    'sword', 'taste', 'taxes', 'teach', 'teeth', 'terry', 'texas', 'thank', 'theft', 'theme',
    'thick', 'third', 'threw', 'throw', 'thumb', 'tiger', 'tight', 'timer', 'tired', 'title',
    'token', 'tommy', 'tooth', 'topic', 'total', 'touch', 'tough', 'tower', 'track', 'trade',
    'train', 'treat', 'trend', 'tribe', 'trick', 'tried', 'tries', 'truly', 'trunk', 'trust',
    'truth', 'tuple', 'twice', 'twist', 'tyler', 'uncle', 'undue', 'union', 'unity', 'upper',
    'upset', 'urban', 'usage', 'usual', 'valid', 'value', 'virus', 'vital', 'vocal', 'waste',
    'watch', 'wheel', 'widow', 'width', 'worry', 'worse', 'worst', 'worth', 'write', 'wrong',
    'wrote', 'yours', 'youth', 'zones', 'adapt', 'admit', 'adopt', 'adult', 'agent', 'agree',
    'ahead', 'alarm', 'album', 'alert', 'alien', 'align', 'alike', 'alive', 'angel', 'anger',
    'angle', 'angry', 'apart', 'apple', 'arena', 'argue', 'arise', 'array', 'arrow', 'aside',
    'asset', 'avoid', 'awake', 'aware', 'badly', 'baker', 'bases', 'basic', 'beach', 'began',
    'blind', 'block', 'board', 'boost', 'booth', 'bound', 'brain', 'brand', 'brass', 'brave',
    'bread', 'break', 'breed', 'cable', 'catch', 'chest', 'actor', 'acute'
  ];
    const common4LetterWords = [
    'that', 'with', 'have', 'this', 'will', 'been', 'from', 'they', 'know', 'want',
    'each', 'make', 'well', 'also', 'back', 'good', 'life', 'work', 'here', 'just',
    'over', 'year', 'some', 'what', 'your', 'when', 'time', 'very', 'help', 'only',
    'come', 'much', 'like', 'need', 'such', 'last', 'long', 'look', 'take', 'data',
    'home', 'show', 'hand', 'part', 'call', 'made', 'find', 'said', 'many', 'name',
    'most', 'used', 'down', 'best', 'same', 'feel', 'able', 'left', 'line', 'free',
    'open', 'both', 'love', 'tell', 'form', 'book', 'read', 'game', 'play', 'live',
    'move', 'talk', 'turn', 'walk', 'case', 'page', 'site', 'news', 'full', 'food',
    'team', 'kind', 'room', 'week', 'hear', 'face', 'idea', 'keep', 'must', 'give',
    'real', 'fact', 'head', 'word', 'area', 'once', 'four', 'sure', 'body', 'mind',
    'eyes', 'door', 'city', 'town', 'road', 'side', 'type', 'sort', 'file', 'code',
    'text', 'mail', 'chat', 'meet', 'date', 'plan', 'goal', 'task', 'done', 'next',
    'soon', 'fast', 'slow', 'easy', 'hard', 'soft', 'warm', 'cold', 'cool', 'nice',
    'fine', 'okay', 'huge', 'tiny', 'tall', 'wide', 'deep', 'high', 'near', 'goes',
    'went', 'stay', 'stop', 'wait', 'jump', 'fall', 'rise', 'grow', 'born', 'dead',
    'kill', 'save', 'care', 'hate', 'hope', 'wish', 'feel', 'seem', 'hear', 'tell',
    'says', 'mean', 'keep', 'hold', 'lost', 'pick', 'drop', 'send', 'came', 'left',
    'took', 'pink', 'blue', 'grey', 'dark', 'rich', 'poor', 'wise', 'wild', 'calm',
    'busy', 'lazy', 'late', 'away', 'girl', 'boys', 'kids', 'baby', 'bear', 'bird',
    'fish', 'cats', 'dogs', 'tree', 'rock', 'sand', 'dirt', 'gold', 'iron', 'wood',
    'fire', 'wind', 'rain', 'snow', 'star', 'moon', 'hill', 'park', 'yard', 'farm',
    'shop', 'bank', 'post', 'mall', 'cafe', 'club', 'math', 'test', 'quiz', 'exam',
    'boss', 'cost', 'sell', 'earn', 'save', 'race', 'bike', 'ride', 'swim', 'cook',
    'bake', 'bite', 'chew', 'pour', 'wash', 'fold', 'iron', 'draw', 'sing', 'joke',
    'yell', 'rest', 'wake', 'wear', 'true', 'fake', 'half', 'lots', 'more', 'less',
    'cute', 'ugly', 'sick', 'well', 'safe', 'hurt', 'glad', 'lady', 'aunt', 'lake',
    'card', 'cash', 'loan', 'debt', 'beat', 'lose', 'hunt', 'fold', 'knit', 'arts',
    'puts', 'sits', 'lies', 'naps', 'gets', 'held', 'seen', 'knew', 'told', 'gave',
    'sold', 'paid', 'wore', 'drew', 'grew', 'flew', 'blew', 'flow', 'glow', 'blow',
    'able', 'army', 'ball', 'band', 'base', 'beat', 'bell', 'bill', 'boat', 'born',
    'camp', 'cars', 'cell', 'char', 'chip', 'cite', 'clay', 'clip', 'coat', 'coin',
    'coke', 'comb', 'cone', 'copy', 'cord', 'core', 'corn', 'coup', 'crew', 'crop',
    'cube', 'cure', 'damn', 'dare', 'dawn', 'dean', 'debt', 'deck', 'deed', 'deer',
    'desk', 'dial', 'dice', 'diet', 'dish', 'dive', 'dock', 'dose', 'dove', 'drag',
    'duck', 'duke', 'dump', 'dust', 'duty', 'echo', 'edit', 'else', 'emit', 'ends',
    'epic', 'euro', 'fade', 'fake', 'fame', 'fare', 'fate', 'fear', 'feed', 'fees',
    'fell', 'fest', 'film', 'fins', 'fist', 'fits', 'flag', 'flat', 'fled', 'flip',
    'folk', 'fond', 'fool', 'fork', 'fort', 'foul', 'fuel', 'gain', 'gang', 'gate',
    'gear', 'gene', 'gift', 'golf', 'grab', 'grid', 'grin', 'grip', 'gulf', 'guys',
    'hack', 'hall', 'hang', 'harm', 'heat', 'heel', 'hell', 'hero', 'hide', 'hint',
    'hire', 'hits', 'hole', 'holy', 'hood', 'hook', 'host', 'hung', 'icon', 'inch',
    'isle', 'jazz', 'june', 'jury', 'keen', 'kilo', 'kiss', 'knee', 'labs', 'lack',
    'lamp', 'lane', 'lawn', 'leak', 'lean', 'lens', 'lied', 'lift', 'limb', 'link',
    'lion', 'lips', 'load', 'loop', 'lord', 'loud', 'luck', 'lung', 'male', 'mars',
    'mask', 'mate', 'meal', 'meat', 'memo', 'mess', 'mice', 'milk', 'mine', 'mint',
    'miss', 'mist', 'mode', 'mood', 'moth', 'myth', 'nail', 'neck', 'nest', 'nets',
    'nick', 'node', 'noon', 'norm', 'nose', 'note', 'odds', 'oils', 'oral', 'oval',
    'pace', 'pack', 'pads', 'pain', 'palm', 'pass', 'past', 'path', 'peak', 'peer',
    'pile', 'pill', 'pine', 'pipe', 'plus', 'pole', 'poll', 'pool', 'pope', 'port',
    'pose', 'prey', 'pump', 'pure', 'push', 'quit', 'rage', 'rang', 'rank', 'rate',
    'rays', 'rely', 'rent', 'ring', 'risk', 'roar', 'rode', 'role', 'roll', 'roof',
    'root', 'rope', 'rose', 'rows', 'ruby', 'rule', 'rush', 'rust', 'sail', 'sake',
    'sale', 'salt', 'seal', 'seat', 'sect', 'seed', 'seek', 'self', 'shed', 'ship',
    'shoe', 'shot', 'shut', 'sing', 'sink', 'size', 'skin', 'skip', 'slip', 'slot',
    'snap', 'sock', 'soil', 'sole', 'song', 'soup', 'spin', 'spot', 'stem', 'step',
    'stir', 'suit', 'sung', 'surf', 'tail', 'tale', 'tank', 'tape', 'taxi', 'tear',
    'tech', 'tens', 'tent', 'term', 'thee', 'them', 'then', 'thin', 'thus', 'tick',
    'tide', 'tied', 'ties', 'till', 'tips', 'tire', 'tone', 'tool', 'tops', 'torn',
    'tour', 'toys', 'trim', 'trip', 'tube', 'tune', 'twin', 'unit', 'upon', 'user',
    'uses', 'vary', 'vast', 'vest', 'view', 'vine', 'vote', 'wage', 'wake', 'wall',
    'ward', 'warn', 'wave', 'ways', 'weak', 'webb', 'west', 'whom', 'wife', 'wind',
    'wine', 'wing', 'wins', 'wire', 'wise', 'wish', 'wolf', 'wool', 'worn', 'yard',
    'yeah', 'yoga', 'zero', 'zone'
  ];

    const wordSets = {
      six: new Set(common6LetterWords),
      five: new Set(common5LetterWords),
      four: new Set(common4LetterWords)
    };

    console.log('✅ Loaded word sets:', {
      '6-letter': wordSets.six.size,
      '5-letter': wordSets.five.size,
      '4-letter': wordSets.four.size
    });

    const container = document.querySelector('div._17scqle0');
    if (!container) {
      console.error('❌ Container div._17scqle0 not found');
      return;
    }

    const codeEl = container.querySelector('strong');
    const buttonEl = container.querySelector('button');
    if (!codeEl || !buttonEl) {
      console.error('❌ Code or button element missing');
      return;
    }

    function mapNumbersToLetters(text) {
      const numberMap = { '0': 'o', '1': 'l', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b' };
      return text.replace(/[0134578]/g, match => numberMap[match]);
    }

    function checkValidCode(code) {
      const clean = code.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (clean.length === 6) {
        const mapped = mapNumbersToLetters(clean);
        if (wordSets.six.has(mapped)) {
          return { valid: true, word: mapped, type: '6-letter (mapped)', original: code };
        }
        if (/\d/.test(clean[0]) && wordSets.five.has(clean.slice(1))) {
          return { valid: true, word: clean.slice(1), type: '5-letter + number prefix', original: code };
        }
        if (/\d/.test(clean[5]) && wordSets.five.has(clean.slice(0, 5))) {
          return { valid: true, word: clean.slice(0, 5), type: '5-letter + number suffix', original: code };
        }
        if (/^\d{2}/.test(clean) && wordSets.four.has(clean.slice(2))) {
          return { valid: true, word: clean.slice(2), type: '4-letter + 2-digit prefix', original: code };
        }
        if (/\d{2}$/.test(clean) && wordSets.four.has(clean.slice(0, 4))) {
          return { valid: true, word: clean.slice(0, 4), type: '4-letter + 2-digit suffix', original: code };
        }
      }
      return { valid: false };
    }

    function stop() {
      if (!stopped) {
        stopped = true;
        observer.disconnect();
        console.log('🛑 Stopped observer.');
      }
    }

    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
      const response = await originalFetch.apply(this, arguments);
      try {
        if (args[0].includes('/api/league/') && args[0].includes('/code/regenerate/')) {
          if (response.status === 503) {
            alert('⚠️ Server returned 503 Service Unavailable!');
            stop();
          }
        }
      } catch (e) { }
      return response;
    };

    const observer = new MutationObserver(() => {
      if (stopped) return;
      const raw = codeEl.textContent.trim();
      const result = checkValidCode(raw);
      attempts++;

      if (attempts % 500 === 0) {
        console.log(`Attempt ${attempts}: checking '${raw}'`);
      }

      if (result.valid) {
        const userAccepted = confirm(`✅ Found valid ${result.type}: '${result.word}' (original: '${result.original}') after ${attempts} attempts.\n\nClick OK to accept this code, or Cancel to keep looking.`);
        if (userAccepted) {
          console.log(`🎉 Accepted: '${result.word}' (${result.original})`);
          stop();
          return;
        } else {
          console.log(`⏭️ Rejected: '${result.word}' (${result.original}), continuing...`);
        }
      }

      try {
        buttonEl.click();
      } catch (e) {
        console.error('⚠️ Click failed, reloading...');
        location.reload();
      }
    });

    observer.observe(codeEl, { characterData: true, subtree: true, childList: true });

    try {
      buttonEl.click();
    } catch (e) {
      console.error('⚠️ Initial click failed, reloading...');
      location.reload();
    }
  }

  // 🧠 Start script
  run();

})();
