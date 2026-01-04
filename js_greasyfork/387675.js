// ==UserScript==
// @name         Beatsaver map highlighter
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Highlights beatsaver maps based on filters
// @author       Revels
// @match        https://beatsaver.com/browse*
// @match        https://beatsaver.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387675/Beatsaver%20map%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/387675/Beatsaver%20map%20highlighter.meta.js
// ==/UserScript==

(function() {
  const DifficultyClasses = {
    1: 'is-easy',
    2: 'is-normal',
    3: 'is-hard',
    4: 'is-expert',
    5: 'is-expert-plus',
  };

  const state = {
    upvotes: 0,
    downvotes: 0,
    difficulty: '1',
  };

  try {
    Object.assign(state, JSON.parse(localStorage.getItem('beatsaver_highlighter_state')));
  } catch (err) {}

  const highlight = (node) => {
    const upvotes = node.querySelector('li[title="Upvotes"]');
    const downvotes = node.querySelector('li[title="Downvotes"]');
    const difficulty = node.querySelector(`.tag.${DifficultyClasses[state.difficulty]}`);

    if (Number(state.upvotes) && upvotes) {
      if (Number(upvotes.textContent.split(' ')[0]) < Number(state.upvotes)) {
        node.style = 'border: none;';
        return;
      };
    }

    if (Number(state.downvotes) && downvotes) {
      if (Number(downvotes.textContent.split(' ')[0]) > Number(state.downvotes)) {
        node.style = 'border: none;';
        return;
      };
    }

    if (!difficulty) {
      node.style = 'border: none;';
      return;
    }

    node.style = 'border: 5px solid green';
  };

  const highlightAll = () => {
    const nodes = Array.from(document.querySelectorAll('.beatmap-result:not(.beatmap-result-hidden)'));
    nodes.forEach(highlight);
  };

  const onChange = (e) => {
    const { name, value } = e.target;

    state[name] = value;

    localStorage.setItem('beatsaver_highlighter_state', JSON.stringify(state));

    highlightAll();
  }

  const div = document.createElement('div');
  div.style = 'position: absolute; right: 100px; top: 100px;';
  div.innerHTML = `
    <h2>Beatsaver Highlighter</h2>
    <form>
      <label for="upvotes">Minimum Upvotes</label>
      <input class="__highlighter_input" name="upvotes" type="number" value="${state.upvotes}" placeholder="Upvotes equal or greater than" />
      <br />
      <label for="downvotes">Maximum downvotes</label>
      <input class="__highlighter_input" name="downvotes" type="number" value="${state.downvotes}" placeholder="Downvotes less than" />
      <br />
      <label for="difficulty" type="text">Difficulty</label>
      <select class="__highlighter_input" name="difficulty" value="${state.difficulty}">
        <option value="1">Easy</option>
        <option value="2">Normal</option>
        <option value="3">Hard</option>
        <option value="4">Expert</option>
        <option value="5">Expert+</option>
      </select>
    </form>
  `;

  document.body.appendChild(div);

  Array.from(document.getElementsByClassName('__highlighter_input')).forEach((el) => {
    el.addEventListener('change', onChange);
  });

  const observe = () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(({ addedNodes, type, target, oldValue }) => {
        if (type === 'attributes') {
          if (oldValue === 'beatmap-result-hidden') {
            highlight(target);
          }
        }
      });
    });

    // Starts the monitoring
    observer.observe(document.documentElement, {
      subtree: true,
      attributeFilter: ['class'],
      attributeOldValue: true,
    });
  };

  window.addEventListener('load', observe);
  })();