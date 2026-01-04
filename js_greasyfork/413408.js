const Easings = {
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => --t * t * t + 1,
  easeInOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t) => t * t * t * t,
  easeOutQuart: (t) => 1 - --t * t * t * t,
  easeInOutQuart: (t) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  easeInQuint: (t) => t * t * t * t * t,
  easeOutQuint: (t) => 1 + --t * t * t * t * t,
  easeInOutQuint: (t) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
};

const Hues = {
  Error: 10,
  Warning: 50,
  Success: 80,
  Neutral: 212
}

function animIn(elem, easing) {
  elem.style.position = "relative";

  var anim = function (elem, d) {
    let eased = easing(d);
    d <= 1 &&
      (elem.style.top = 10 * -(1 - eased) + "px") &&
      (elem.style.opacity = eased + "") &&
      setTimeout(() => anim(elem, d + 0.02), 1);
  };

  anim(elem, 0);
}

function animOut(elem, easing) {
  elem.dataset.isAnimating = "yes";

  let tc;
  let rect = elem.getBoundingClientRect();
  let isFirst = elem === toastContainer.children[0];
  let height = rect.height;
  let top = rect.top;
  let fakeDiv = document.createElement("div");
  fakeDiv.style.display = "inline-block";
  fakeDiv.style.width = rect.width;
  fakeDiv.style.marginBottom = "10px";

  elem.style.position = "absolute";
  elem.style.width = rect.width - 30 + "px";
  if (!isFirst) elem.style.top = top - 5 + "px";

  toastContainer.insertBefore(fakeDiv, elem);

  var anim = function (elem, d) {
    let eased = easing(d);
    d >= 0
      ? (elem.style.opacity = eased + "") &&
        (fakeDiv.style.height = height * eased + "px") &&
        setTimeout(() => anim(elem, d - 0.02), 1)
      : (tc = document.getElementById("toastContainer")).removeChild(elem) &&
        tc.removeChild(fakeDiv);
  };

  anim(elem, 1);
}

function createToast(
  text,
  duration = 1600,
  closable = true,
  easing = (num) => num,
  hue = 212
) {
  if (!window.toastContainer) {
    tc = document.createElement("div");
    tc.id = "toastContainer";
    tc.style.position = "fixed";
    tc.style.top = "5px";
    tc.style.left = "5px";
    tc.style.display = "flex";
    tc.style.flexDirection = "column";
    tc.style.zIndex = "2147483647";

    document.body.appendChild(tc);
  }

  let toast = document.createElement("div");
  toast.textContent = text;

  toast.style.borderRadius = "2px";
  toast.style.background = `linear-gradient(315deg, hsl(${hue}, 81%, 30%), hsl(${hue}, 81%, 40%))`;
  toast.style.boxShadow = `hsla(${hue}, 81%, 70%, 0.5) 0 1px 10px 2px`;
  toast.style.color = "white";
  toast.style.overflow = "hidden";
  toast.style.display = "inline-block";
  toast.style.padding = "10px 15px";
  toast.style.fontSize = "12pt";
  toast.style.userSelect = "none";
  toast.style.marginBottom = "10px";
  toast.style.fontFamily =
    "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif";

  document.getElementById("toastContainer").appendChild(toast);
  animIn(toast, easing);

  setTimeout(
    () => toast.dataset.isAnimating || animOut(toast, easing),
    duration
  );

  if (closable) {
    toast.style.cursor = "pointer";
    toast.onclick = () => toast.dataset.isAnimating || animOut(toast, easing);
  }

  return toast;
}

window.toast = window.createNotification = window.notify = window.createToast = createToast;