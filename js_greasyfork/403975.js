// Helpers
  
  function templateDOMElement({
    tag = null,
    classList = null,
    innerHTML = null,
    id = null,
    style = null,
  }) {
    if (tag !== null && tag !== undefined) {
      let elm = document.createElement(`${tag}`);
      if (classList) {
        elm.classList.add(classList);
      }
  
      for (let [key, value] of Object.entries(arguments[0])) {
        if (value !== null && key !== "classList" && key !== "tag") {
          elm[key] = value;
        }
      }
      return elm;
    } else {
      throw new Error(`Tag not provided in ${arguments[0]}.`);
    }
  }
  