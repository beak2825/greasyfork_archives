function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightWords(words, highlightClass = 'highlight') {
  if (!words || words.length === 0) return;

  // Create patterns for words and phrases
  const patterns = words.map(word => {
    const trimmed = word.trim();
    if (trimmed.includes(' ')) {
      // Handle phrases
      const parts = trimmed.split(/\s+/);
      const escapedParts = parts.map(escapeRegex);
      const pattern = escapedParts.map(part => `\\b${part}\\b`).join('\\s+');
      return { pattern, numWords: parts.length };
    } else {
      // Handle single words
      const escaped = escapeRegex(trimmed);
      const pattern = `\\b${escaped}\\b`;
      return { pattern, numWords: 1 };
    }
  });

  // Sort patterns by number of words descending to match longer phrases first
  patterns.sort((a, b) => b.numWords - a.numWords);

  // Create the regex pattern by joining all patterns with '|'
  const regexPattern = patterns.map(p => p.pattern).join('|');
  const regex = new RegExp(regexPattern, 'gi');

  // Select text nodes excluding script, style, and already highlighted elements
  const xpath = `//text()[not(ancestor::script) and not(ancestor::style) and not(ancestor::*[contains(concat(" ", normalize-space(@class), " "), " ${highlightClass} ")])]`;
  const textNodes = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

  for (let i = 0; i < textNodes.snapshotLength; i++) {
    const textNode = textNodes.snapshotItem(i);
    const text = textNode.nodeValue;
    const matches = [...text.matchAll(regex)];

    if (matches.length > 0) {
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;

      for (const match of matches) {
        const offset = match.index;
        if (offset > lastIndex) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, offset)));
        }
        const span = document.createElement('span');
        span.className = highlightClass;
        span.textContent = match[0];
        fragment.appendChild(span);
        lastIndex = offset + match[0].length;
      }

      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      }

      textNode.parentNode.replaceChild(fragment, textNode);
    }
  }
}