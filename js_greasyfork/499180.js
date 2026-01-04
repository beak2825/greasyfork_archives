(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MantineHooks = {}, global.React));
})(this, (function (exports, React) { 'use strict';
  function clamp(value, min, max) {
    if (min === void 0 && max === void 0) {
      return value;
    }
    if (min !== void 0 && max === void 0) {
      return Math.max(value, min);
    }
    if (min === void 0 && max !== void 0) {
      return Math.min(value, max);
    }
    return Math.min(Math.max(value, min), max);
  }
  function lowerFirst(value) {
    return typeof value !== "string" ? "" : value.charAt(0).toLowerCase() + value.slice(1);
  }
  function randomId(prefix = "mantine-") {
    return `${prefix}${Math.random().toString(36).slice(2, 11)}`;
  }
  function range(start, end) {
    const length = Math.abs(end - start) + 1;
    const reversed = start > end;
    if (!reversed) {
      return Array.from({ length }, (_, index) => index + start);
    }
    return Array.from({ length }, (_, index) => start - index);
  }
  function shallowEqual(a, b) {
    if (a === b) {
      return true;
    }
    if (!(a instanceof Object) || !(b instanceof Object)) {
      return false;
    }
    const keys = Object.keys(a);
    const { length } = keys;
    if (length !== Object.keys(b).length) {
      return false;
    }
    for (let i = 0; i < length; i += 1) {
      const key = keys[i];
      if (!(key in b)) {
        return false;
      }
      if (a[key] !== b[key]) {
        return false;
      }
    }
    return true;
  }
  function upperFirst(value) {
    return typeof value !== "string" ? "" : value.charAt(0).toUpperCase() + value.slice(1);
  }
  function useCallbackRef(callback) {
    const callbackRef = React.useRef(callback);
    React.useEffect(() => {
      callbackRef.current = callback;
    });
    return React.useMemo(() => (...args) => callbackRef.current?.(...args), []);
  }
  function useDebouncedCallback(callback, delay) {
    const handleCallback = useCallbackRef(callback);
    const debounceTimerRef = React.useRef(0);
    React.useEffect(() => () => window.clearTimeout(debounceTimerRef.current), []);
    return React.useCallback(
      (...args) => {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = window.setTimeout(() => handleCallback(...args), delay);
      },
      [handleCallback, delay]
    );
  }
  var DEFAULT_EVENTS = ["mousedown", "touchstart"];
  function useClickOutside(handler, events, nodes) {
    const ref = React.useRef(null);
    React.useEffect(() => {
      const listener = (event) => {
        const { target } = event ?? {};
        if (Array.isArray(nodes)) {
          const shouldIgnore = target?.hasAttribute("data-ignore-outside-clicks") || !document.body.contains(target) && target.tagName !== "HTML";
          const shouldTrigger = nodes.every((node) => !!node && !event.composedPath().includes(node));
          shouldTrigger && !shouldIgnore && handler();
        } else if (ref.current && !ref.current.contains(target)) {
          handler();
        }
      };
      (events || DEFAULT_EVENTS).forEach((fn) => document.addEventListener(fn, listener));
      return () => {
        (events || DEFAULT_EVENTS).forEach((fn) => document.removeEventListener(fn, listener));
      };
    }, [ref, handler, nodes]);
    return ref;
  }
  function useClipboard({ timeout = 2e3 } = {}) {
    const [error, setError] = React.useState(null);
    const [copied, setCopied] = React.useState(false);
    const [copyTimeout, setCopyTimeout] = React.useState(null);
    const handleCopyResult = (value) => {
      window.clearTimeout(copyTimeout);
      setCopyTimeout(window.setTimeout(() => setCopied(false), timeout));
      setCopied(value);
    };
    const copy = (valueToCopy) => {
      if ("clipboard" in navigator) {
        navigator.clipboard.writeText(valueToCopy).then(() => handleCopyResult(true)).catch((err) => setError(err));
      } else {
        setError(new Error("useClipboard: navigator.clipboard is not supported"));
      }
    };
    const reset = () => {
      setCopied(false);
      setError(null);
      window.clearTimeout(copyTimeout);
    };
    return { copy, reset, error, copied };
  }
  function attachMediaListener(query, callback) {
    try {
      query.addEventListener("change", callback);
      return () => query.removeEventListener("change", callback);
    } catch (e) {
      query.addListener(callback);
      return () => query.removeListener(callback);
    }
  }
  function getInitialValue(query, initialValue) {
    if (typeof window !== "undefined" && "matchMedia" in window) {
      return window.matchMedia(query).matches;
    }
    return false;
  }
  function useMediaQuery(query, initialValue, { getInitialValueInEffect } = {
    getInitialValueInEffect: true
  }) {
    const [matches, setMatches] = React.useState(
      getInitialValueInEffect ? initialValue : getInitialValue(query)
    );
    const queryRef = React.useRef(null);
    React.useEffect(() => {
      if ("matchMedia" in window) {
        queryRef.current = window.matchMedia(query);
        setMatches(queryRef.current.matches);
        return attachMediaListener(queryRef.current, (event) => setMatches(event.matches));
      }
      return void 0;
    }, [query]);
    return matches;
  }
  function useColorScheme(initialValue, options) {
    return useMediaQuery("(prefers-color-scheme: dark)", initialValue === "dark", options) ? "dark" : "light";
  }
  var DEFAULT_OPTIONS = {
    min: -Infinity,
    max: Infinity
  };
  function useCounter(initialValue = 0, options) {
    const { min, max } = { ...DEFAULT_OPTIONS, ...options };
    const [count, setCount] = React.useState(clamp(initialValue, min, max));
    const increment = () => setCount((current) => clamp(current + 1, min, max));
    const decrement = () => setCount((current) => clamp(current - 1, min, max));
    const set = (value) => setCount(clamp(value, min, max));
    const reset = () => setCount(clamp(initialValue, min, max));
    return [count, { increment, decrement, set, reset }];
  }
  function useDebouncedState(defaultValue, wait, options = { leading: false }) {
    const [value, setValue] = React.useState(defaultValue);
    const timeoutRef = React.useRef(null);
    const leadingRef = React.useRef(true);
    const clearTimeout2 = () => window.clearTimeout(timeoutRef.current);
    React.useEffect(() => clearTimeout2, []);
    const debouncedSetValue = React.useCallback(
      (newValue) => {
        clearTimeout2();
        if (leadingRef.current && options.leading) {
          setValue(newValue);
        } else {
          timeoutRef.current = window.setTimeout(() => {
            leadingRef.current = true;
            setValue(newValue);
          }, wait);
        }
        leadingRef.current = false;
      },
      [options.leading]
    );
    return [value, debouncedSetValue];
  }
  function useDebouncedValue(value, wait, options = { leading: false }) {
    const [_value, setValue] = React.useState(value);
    const mountedRef = React.useRef(false);
    const timeoutRef = React.useRef(null);
    const cooldownRef = React.useRef(false);
    const cancel = () => window.clearTimeout(timeoutRef.current);
    React.useEffect(() => {
      if (mountedRef.current) {
        if (!cooldownRef.current && options.leading) {
          cooldownRef.current = true;
          setValue(value);
        } else {
          cancel();
          timeoutRef.current = window.setTimeout(() => {
            cooldownRef.current = false;
            setValue(value);
          }, wait);
        }
      }
    }, [value, options.leading, wait]);
    React.useEffect(() => {
      mountedRef.current = true;
      return cancel;
    }, []);
    return [_value, cancel];
  }
  var useIsomorphicEffect = typeof document !== "undefined" ? React.useLayoutEffect : React.useEffect;
  function useDocumentTitle(title) {
    useIsomorphicEffect(() => {
      if (typeof title === "string" && title.trim().length > 0) {
        document.title = title.trim();
      }
    }, [title]);
  }
  function useDocumentVisibility() {
    const [documentVisibility, setDocumentVisibility] = React.useState("visible");
    React.useEffect(() => {
      const listener = () => setDocumentVisibility(document.visibilityState);
      document.addEventListener("visibilitychange", listener);
      return () => document.removeEventListener("visibilitychange", listener);
    }, []);
    return documentVisibility;
  }
  function useDidUpdate(fn, dependencies) {
    const mounted = React.useRef(false);
    React.useEffect(
      () => () => {
        mounted.current = false;
      },
      []
    );
    React.useEffect(() => {
      if (mounted.current) {
        return fn();
      }
      mounted.current = true;
      return void 0;
    }, dependencies);
  }
  function useFocusReturn({ opened, shouldReturnFocus = true }) {
    const lastActiveElement = React.useRef(null);
    const returnFocus = () => {
      if (lastActiveElement.current && "focus" in lastActiveElement.current && typeof lastActiveElement.current.focus === "function") {
        lastActiveElement.current?.focus({ preventScroll: true });
      }
    };
    useDidUpdate(() => {
      let timeout = -1;
      const clearFocusTimeout = (event) => {
        if (event.key === "Tab") {
          window.clearTimeout(timeout);
        }
      };
      document.addEventListener("keydown", clearFocusTimeout);
      if (opened) {
        lastActiveElement.current = document.activeElement;
      } else if (shouldReturnFocus) {
        timeout = window.setTimeout(returnFocus, 10);
      }
      return () => {
        window.clearTimeout(timeout);
        document.removeEventListener("keydown", clearFocusTimeout);
      };
    }, [opened, shouldReturnFocus]);
    return returnFocus;
  }
  var TABBABLE_NODES = /input|select|textarea|button|object/;
  var FOCUS_SELECTOR = "a, input, select, textarea, button, object, [tabindex]";
  function hidden(element) {
    return element.style.display === "none";
  }
  function visible(element) {
    const isHidden = element.getAttribute("aria-hidden") || element.getAttribute("hidden") || element.getAttribute("type") === "hidden";
    if (isHidden) {
      return false;
    }
    let parentElement = element;
    while (parentElement) {
      if (parentElement === document.body || parentElement.nodeType === 11) {
        break;
      }
      if (hidden(parentElement)) {
        return false;
      }
      parentElement = parentElement.parentNode;
    }
    return true;
  }
  function getElementTabIndex(element) {
    let tabIndex = element.getAttribute("tabindex");
    if (tabIndex === null) {
      tabIndex = void 0;
    }
    return parseInt(tabIndex, 10);
  }
  function focusable(element) {
    const nodeName = element.nodeName.toLowerCase();
    const isTabIndexNotNaN = !Number.isNaN(getElementTabIndex(element));
    const res = (
      
      TABBABLE_NODES.test(nodeName) && !element.disabled || (element instanceof HTMLAnchorElement ? element.href || isTabIndexNotNaN : isTabIndexNotNaN)
    );
    return res && visible(element);
  }
  function tabbable(element) {
    const tabIndex = getElementTabIndex(element);
    const isTabIndexNaN = Number.isNaN(tabIndex);
    return (isTabIndexNaN || tabIndex >= 0) && focusable(element);
  }
  function findTabbableDescendants(element) {
    return Array.from(element.querySelectorAll(FOCUS_SELECTOR)).filter(tabbable);
  }
  function scopeTab(node, event) {
    const tabbable2 = findTabbableDescendants(node);
    if (!tabbable2.length) {
      event.preventDefault();
      return;
    }
    const finalTabbable = tabbable2[event.shiftKey ? 0 : tabbable2.length - 1];
    const root = node.getRootNode();
    let leavingFinalTabbable = finalTabbable === root.activeElement || node === root.activeElement;
    const activeElement = root.activeElement;
    const activeElementIsRadio = activeElement.tagName === "INPUT" && activeElement.getAttribute("type") === "radio";
    if (activeElementIsRadio) {
      const activeRadioGroup = tabbable2.filter(
        (element) => element.getAttribute("type") === "radio" && element.getAttribute("name") === activeElement.getAttribute("name")
      );
      leavingFinalTabbable = activeRadioGroup.includes(finalTabbable);
    }
    if (!leavingFinalTabbable) {
      return;
    }
    event.preventDefault();
    const target = tabbable2[event.shiftKey ? tabbable2.length - 1 : 0];
    if (target) {
      target.focus();
    }
  }
  function useFocusTrap(active = true) {
    const ref = React.useRef(null);
    const focusNode = (node) => {
      let focusElement = node.querySelector("[data-autofocus]");
      if (!focusElement) {
        const children = Array.from(node.querySelectorAll(FOCUS_SELECTOR));
        focusElement = children.find(tabbable) || children.find(focusable) || null;
        if (!focusElement && focusable(node)) {
          focusElement = node;
        }
      }
      if (focusElement) {
        focusElement.focus({ preventScroll: true });
      } else {
        console.warn(
          "[@mantine/hooks/use-focus-trap] Failed to find focusable element within provided node",
          node
        );
      }
    };
    const setRef = React.useCallback(
      (node) => {
        if (!active) {
          return;
        }
        if (node === null) {
          return;
        }
        if (ref.current === node) {
          return;
        }
        if (node) {
          setTimeout(() => {
            if (node.getRootNode()) {
              focusNode(node);
            } else {
              console.warn("[@mantine/hooks/use-focus-trap] Ref node is not part of the dom", node);
            }
          });
          ref.current = node;
        } else {
          ref.current = null;
        }
      },
      [active]
    );
    React.useEffect(() => {
      if (!active) {
        return void 0;
      }
      ref.current && setTimeout(() => focusNode(ref.current));
      const handleKeyDown = (event) => {
        if (event.key === "Tab" && ref.current) {
          scopeTab(ref.current, event);
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [active]);
    return setRef;
  }
  var reducer = (value) => (value + 1) % 1e6;
  function useForceUpdate() {
    const [, update] = React.useReducer(reducer, 0);
    return update;
  }
  var __useId = React["useId".toString()] || (() => void 0);
  function useReactId() {
    const id = __useId();
    return id ? `mantine-${id.replace(/:/g, "")}` : "";
  }
  function useId(staticId) {
    const reactId = useReactId();
    const [uuid, setUuid] = React.useState(reactId);
    useIsomorphicEffect(() => {
      setUuid(randomId());
    }, []);
    if (typeof staticId === "string") {
      return staticId;
    }
    if (typeof window === "undefined") {
      return reactId;
    }
    return uuid;
  }
  var DEFAULT_EVENTS2 = [
    "keypress",
    "mousemove",
    "touchmove",
    "click",
    "scroll"
  ];
  var DEFAULT_OPTIONS2 = {
    events: DEFAULT_EVENTS2,
    initialState: true
  };
  function useIdle(timeout, options) {
    const { events, initialState } = { ...DEFAULT_OPTIONS2, ...options };
    const [idle, setIdle] = React.useState(initialState);
    const timer = React.useRef(-1);
    React.useEffect(() => {
      const handleEvents = () => {
        setIdle(false);
        if (timer.current) {
          window.clearTimeout(timer.current);
        }
        timer.current = window.setTimeout(() => {
          setIdle(true);
        }, timeout);
      };
      events.forEach((event) => document.addEventListener(event, handleEvents));
      timer.current = window.setTimeout(() => {
        setIdle(true);
      }, timeout);
      return () => {
        events.forEach((event) => document.removeEventListener(event, handleEvents));
      };
    }, [timeout]);
    return idle;
  }
  function useInterval(fn, interval, { autoInvoke = false } = {}) {
    const [active, setActive] = React.useState(false);
    const intervalRef = React.useRef(null);
    const fnRef = React.useRef(null);
    const start = () => {
      setActive((old) => {
        if (!old && (!intervalRef.current || intervalRef.current === -1)) {
          intervalRef.current = window.setInterval(fnRef.current, interval);
        }
        return true;
      });
    };
    const stop = () => {
      setActive(false);
      window.clearInterval(intervalRef.current || -1);
      intervalRef.current = -1;
    };
    const toggle = () => {
      if (active) {
        stop();
      } else {
        start();
      }
    };
    React.useEffect(() => {
      fnRef.current = fn;
      active && start();
      return stop;
    }, [fn, active, interval]);
    React.useEffect(() => {
      if (autoInvoke) {
        start();
      }
    }, []);
    return { start, stop, toggle, active };
  }
  function useListState(initialValue = []) {
    const [state, setState] = React.useState(initialValue);
    const append = (...items) => setState((current) => [...current, ...items]);
    const prepend = (...items) => setState((current) => [...items, ...current]);
    const insert = (index, ...items) => setState((current) => [...current.slice(0, index), ...items, ...current.slice(index)]);
    const apply = (fn) => setState((current) => current.map((item, index) => fn(item, index)));
    const remove = (...indices) => setState((current) => current.filter((_, index) => !indices.includes(index)));
    const pop = () => setState((current) => {
      const cloned = [...current];
      cloned.pop();
      return cloned;
    });
    const shift = () => setState((current) => {
      const cloned = [...current];
      cloned.shift();
      return cloned;
    });
    const reorder = ({ from, to }) => setState((current) => {
      const cloned = [...current];
      const item = current[from];
      cloned.splice(from, 1);
      cloned.splice(to, 0, item);
      return cloned;
    });
    const swap = ({ from, to }) => setState((current) => {
      const cloned = [...current];
      const fromItem = cloned[from];
      const toItem = cloned[to];
      cloned.splice(to, 1, fromItem);
      cloned.splice(from, 1, toItem);
      return cloned;
    });
    const setItem = (index, item) => setState((current) => {
      const cloned = [...current];
      cloned[index] = item;
      return cloned;
    });
    const setItemProp = (index, prop, value) => setState((current) => {
      const cloned = [...current];
      cloned[index] = { ...cloned[index], [prop]: value };
      return cloned;
    });
    const applyWhere = (condition, fn) => setState(
      (current) => current.map((item, index) => condition(item, index) ? fn(item, index) : item)
    );
    const filter = (fn) => {
      setState((current) => current.filter(fn));
    };
    return [
      state,
      {
        setState,
        append,
        prepend,
        insert,
        pop,
        shift,
        apply,
        applyWhere,
        remove,
        reorder,
        swap,
        setItem,
        setItemProp,
        filter
      }
    ];
  }
  function useWindowEvent(type, listener, options) {
    React.useEffect(() => {
      window.addEventListener(type, listener, options);
      return () => window.removeEventListener(type, listener, options);
    }, [type, listener]);
  }
  function serializeJSON(value, hookName = "use-local-storage") {
    try {
      return JSON.stringify(value);
    } catch (error) {
      throw new Error(`@mantine/hooks ${hookName}: Failed to serialize the value`);
    }
  }
  function deserializeJSON(value) {
    try {
      return value && JSON.parse(value);
    } catch {
      return value;
    }
  }
  function createStorageHandler(type) {
    const getItem = (key) => {
      try {
        return window[type].getItem(key);
      } catch (error) {
        console.warn("use-local-storage: Failed to get value from storage, localStorage is blocked");
        return null;
      }
    };
    const setItem = (key, value) => {
      try {
        window[type].setItem(key, value);
      } catch (error) {
        console.warn("use-local-storage: Failed to set value to storage, localStorage is blocked");
      }
    };
    const removeItem = (key) => {
      try {
        window[type].removeItem(key);
      } catch (error) {
        console.warn(
          "use-local-storage: Failed to remove value from storage, localStorage is blocked"
        );
      }
    };
    return { getItem, setItem, removeItem };
  }
  function createStorage(type, hookName) {
    const eventName = type === "localStorage" ? "mantine-local-storage" : "mantine-session-storage";
    const { getItem, setItem, removeItem } = createStorageHandler(type);
    return function useStorage({
      key,
      defaultValue,
      getInitialValueInEffect = true,
      deserialize = deserializeJSON,
      serialize = (value) => serializeJSON(value, hookName)
    }) {
      const readStorageValue = React.useCallback(
        (skipStorage) => {
          let storageBlockedOrSkipped;
          try {
            storageBlockedOrSkipped = typeof window === "undefined" || !(type in window) || window[type] === null || !!skipStorage;
          } catch (_e) {
            storageBlockedOrSkipped = true;
          }
          if (storageBlockedOrSkipped) {
            return defaultValue;
          }
          const storageValue = getItem(key);
          return storageValue !== null ? deserialize(storageValue) : defaultValue;
        },
        [key, defaultValue]
      );
      const [value, setValue] = React.useState(readStorageValue(getInitialValueInEffect));
      const setStorageValue = React.useCallback(
        (val) => {
          if (val instanceof Function) {
            setValue((current) => {
              const result = val(current);
              setItem(key, serialize(result));
              window.dispatchEvent(
                new CustomEvent(eventName, { detail: { key, value: val(current) } })
              );
              return result;
            });
          } else {
            setItem(key, serialize(val));
            window.dispatchEvent(new CustomEvent(eventName, { detail: { key, value: val } }));
            setValue(val);
          }
        },
        [key]
      );
      const removeStorageValue = React.useCallback(() => {
        removeItem(key);
        window.dispatchEvent(new CustomEvent(eventName, { detail: { key, value: defaultValue } }));
      }, []);
      useWindowEvent("storage", (event) => {
        if (event.storageArea === window[type] && event.key === key) {
          setValue(deserialize(event.newValue ?? void 0));
        }
      });
      useWindowEvent(eventName, (event) => {
        if (event.detail.key === key) {
          setValue(event.detail.value);
        }
      });
      React.useEffect(() => {
        if (defaultValue !== void 0 && value === void 0) {
          setStorageValue(defaultValue);
        }
      }, [defaultValue, value, setStorageValue]);
      React.useEffect(() => {
        const val = readStorageValue();
        val !== void 0 && setStorageValue(val);
      }, [key]);
      return [value === void 0 ? defaultValue : value, setStorageValue, removeStorageValue];
    };
  }
  function readValue(type) {
    const { getItem } = createStorageHandler(type);
    return function read({
      key,
      defaultValue,
      deserialize = deserializeJSON
    }) {
      let storageBlockedOrSkipped;
      try {
        storageBlockedOrSkipped = typeof window === "undefined" || !(type in window) || window[type] === null;
      } catch (_e) {
        storageBlockedOrSkipped = true;
      }
      if (storageBlockedOrSkipped) {
        return defaultValue;
      }
      const storageValue = getItem(key);
      return storageValue !== null ? deserialize(storageValue) : defaultValue;
    };
  }
  function useLocalStorage(props) {
    return createStorage("localStorage", "use-local-storage")(props);
  }
  var readLocalStorageValue = readValue("localStorage");
  function useSessionStorage(props) {
    return createStorage("sessionStorage", "use-session-storage")(props);
  }
  var readSessionStorageValue = readValue("sessionStorage");
  function assignRef(ref, value) {
    if (typeof ref === "function") {
      ref(value);
    } else if (typeof ref === "object" && ref !== null && "current" in ref) {
      ref.current = value;
    }
  }
  function mergeRefs(...refs) {
    return (node) => {
      refs.forEach((ref) => assignRef(ref, node));
    };
  }
  function useMergedRef(...refs) {
    return React.useCallback(mergeRefs(...refs), refs);
  }
  function useMouse(options = { resetOnExit: false }) {
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const ref = React.useRef(null);
    const setMousePosition = (event) => {
      if (ref.current) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = Math.max(
          0,
          Math.round(event.pageX - rect.left - (window.pageXOffset || window.scrollX))
        );
        const y = Math.max(
          0,
          Math.round(event.pageY - rect.top - (window.pageYOffset || window.scrollY))
        );
        setPosition({ x, y });
      } else {
        setPosition({ x: event.clientX, y: event.clientY });
      }
    };
    const resetMousePosition = () => setPosition({ x: 0, y: 0 });
    React.useEffect(() => {
      const element = ref?.current ? ref.current : document;
      element.addEventListener("mousemove", setMousePosition);
      if (options.resetOnExit) {
        element.addEventListener("mouseleave", resetMousePosition);
      }
      return () => {
        element.removeEventListener("mousemove", setMousePosition);
        if (options.resetOnExit) {
          element.removeEventListener("mouseleave", resetMousePosition);
        }
      };
    }, [ref.current]);
    return { ref, ...position };
  }
  function clampUseMovePosition(position) {
    return {
      x: clamp(position.x, 0, 1),
      y: clamp(position.y, 0, 1)
    };
  }
  function useMove(onChange, handlers, dir = "ltr") {
    const ref = React.useRef(null);
    const mounted = React.useRef(false);
    const isSliding = React.useRef(false);
    const frame = React.useRef(0);
    const [active, setActive] = React.useState(false);
    React.useEffect(() => {
      mounted.current = true;
    }, []);
    React.useEffect(() => {
      const onScrub = ({ x, y }) => {
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
          if (mounted.current && ref.current) {
            ref.current.style.userSelect = "none";
            const rect = ref.current.getBoundingClientRect();
            if (rect.width && rect.height) {
              const _x = clamp((x - rect.left) / rect.width, 0, 1);
              onChange({
                x: dir === "ltr" ? _x : 1 - _x,
                y: clamp((y - rect.top) / rect.height, 0, 1)
              });
            }
          }
        });
      };
      const bindEvents = () => {
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", stopScrubbing);
        document.addEventListener("touchmove", onTouchMove);
        document.addEventListener("touchend", stopScrubbing);
      };
      const unbindEvents = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", stopScrubbing);
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("touchend", stopScrubbing);
      };
      const startScrubbing = () => {
        if (!isSliding.current && mounted.current) {
          isSliding.current = true;
          typeof handlers?.onScrubStart === "function" && handlers.onScrubStart();
          setActive(true);
          bindEvents();
        }
      };
      const stopScrubbing = () => {
        if (isSliding.current && mounted.current) {
          isSliding.current = false;
          setActive(false);
          unbindEvents();
          setTimeout(() => {
            typeof handlers?.onScrubEnd === "function" && handlers.onScrubEnd();
          }, 0);
        }
      };
      const onMouseDown = (event) => {
        startScrubbing();
        event.preventDefault();
        onMouseMove(event);
      };
      const onMouseMove = (event) => onScrub({ x: event.clientX, y: event.clientY });
      const onTouchStart = (event) => {
        if (event.cancelable) {
          event.preventDefault();
        }
        startScrubbing();
        onTouchMove(event);
      };
      const onTouchMove = (event) => {
        if (event.cancelable) {
          event.preventDefault();
        }
        onScrub({ x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY });
      };
      ref.current?.addEventListener("mousedown", onMouseDown);
      ref.current?.addEventListener("touchstart", onTouchStart, { passive: false });
      return () => {
        if (ref.current) {
          ref.current.removeEventListener("mousedown", onMouseDown);
          ref.current.removeEventListener("touchstart", onTouchStart);
        }
      };
    }, [dir, onChange]);
    return { ref, active };
  }
  function useUncontrolled({
    value,
    defaultValue,
    finalValue,
    onChange = () => {
    }
  }) {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      defaultValue !== void 0 ? defaultValue : finalValue
    );
    const handleUncontrolledChange = (val, ...payload) => {
      setUncontrolledValue(val);
      onChange?.(val, ...payload);
    };
    if (value !== void 0) {
      return [value, onChange, true];
    }
    return [uncontrolledValue, handleUncontrolledChange, false];
  }
  function range2(start, end) {
    const length = end - start + 1;
    return Array.from({ length }, (_, index) => index + start);
  }
  var DOTS = "dots";
  function usePagination({
    total,
    siblings = 1,
    boundaries = 1,
    page,
    initialPage = 1,
    onChange
  }) {
    const _total = Math.max(Math.trunc(total), 0);
    const [activePage, setActivePage] = useUncontrolled({
      value: page,
      onChange,
      defaultValue: initialPage,
      finalValue: initialPage
    });
    const setPage = (pageNumber) => {
      if (pageNumber <= 0) {
        setActivePage(1);
      } else if (pageNumber > _total) {
        setActivePage(_total);
      } else {
        setActivePage(pageNumber);
      }
    };
    const next = () => setPage(activePage + 1);
    const previous = () => setPage(activePage - 1);
    const first = () => setPage(1);
    const last = () => setPage(_total);
    const paginationRange = React.useMemo(() => {
      const totalPageNumbers = siblings * 2 + 3 + boundaries * 2;
      if (totalPageNumbers >= _total) {
        return range2(1, _total);
      }
      const leftSiblingIndex = Math.max(activePage - siblings, boundaries);
      const rightSiblingIndex = Math.min(activePage + siblings, _total - boundaries);
      const shouldShowLeftDots = leftSiblingIndex > boundaries + 2;
      const shouldShowRightDots = rightSiblingIndex < _total - (boundaries + 1);
      if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItemCount = siblings * 2 + boundaries + 2;
        return [...range2(1, leftItemCount), DOTS, ...range2(_total - (boundaries - 1), _total)];
      }
      if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightItemCount = boundaries + 1 + 2 * siblings;
        return [...range2(1, boundaries), DOTS, ...range2(_total - rightItemCount, _total)];
      }
      return [
        ...range2(1, boundaries),
        DOTS,
        ...range2(leftSiblingIndex, rightSiblingIndex),
        DOTS,
        ...range2(_total - boundaries + 1, _total)
      ];
    }, [_total, siblings, activePage]);
    return {
      range: paginationRange,
      active: activePage,
      setPage,
      next,
      previous,
      first,
      last
    };
  }
  function useQueue({ initialValues = [], limit }) {
    const [state, setState] = React.useState({
      state: initialValues.slice(0, limit),
      queue: initialValues.slice(limit)
    });
    const add = (...items) => setState((current) => {
      const results = [...current.state, ...current.queue, ...items];
      return {
        state: results.slice(0, limit),
        queue: results.slice(limit)
      };
    });
    const update = (fn) => setState((current) => {
      const results = fn([...current.state, ...current.queue]);
      return {
        state: results.slice(0, limit),
        queue: results.slice(limit)
      };
    });
    const cleanQueue = () => setState((current) => ({ state: current.state, queue: [] }));
    return {
      state: state.state,
      queue: state.queue,
      add,
      update,
      cleanQueue
    };
  }
  function usePageLeave(onPageLeave) {
    React.useEffect(() => {
      document.documentElement.addEventListener("mouseleave", onPageLeave);
      return () => document.documentElement.removeEventListener("mouseleave", onPageLeave);
    }, []);
  }
  function useReducedMotion(initialValue, options) {
    return useMediaQuery("(prefers-reduced-motion: reduce)", initialValue, options);
  }
  var easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  var getRelativePosition = ({
    axis,
    target,
    parent,
    alignment,
    offset,
    isList
  }) => {
    if (!target || !parent && typeof document === "undefined") {
      return 0;
    }
    const isCustomParent = !!parent;
    const parentElement = parent || document.body;
    const parentPosition = parentElement.getBoundingClientRect();
    const targetPosition = target.getBoundingClientRect();
    const getDiff = (property) => targetPosition[property] - parentPosition[property];
    if (axis === "y") {
      const diff = getDiff("top");
      if (diff === 0) {
        return 0;
      }
      if (alignment === "start") {
        const distance = diff - offset;
        const shouldScroll = distance <= targetPosition.height * (isList ? 0 : 1) || !isList;
        return shouldScroll ? distance : 0;
      }
      const parentHeight = isCustomParent ? parentPosition.height : window.innerHeight;
      if (alignment === "end") {
        const distance = diff + offset - parentHeight + targetPosition.height;
        const shouldScroll = distance >= -targetPosition.height * (isList ? 0 : 1) || !isList;
        return shouldScroll ? distance : 0;
      }
      if (alignment === "center") {
        return diff - parentHeight / 2 + targetPosition.height / 2;
      }
      return 0;
    }
    if (axis === "x") {
      const diff = getDiff("left");
      if (diff === 0) {
        return 0;
      }
      if (alignment === "start") {
        const distance = diff - offset;
        const shouldScroll = distance <= targetPosition.width || !isList;
        return shouldScroll ? distance : 0;
      }
      const parentWidth = isCustomParent ? parentPosition.width : window.innerWidth;
      if (alignment === "end") {
        const distance = diff + offset - parentWidth + targetPosition.width;
        const shouldScroll = distance >= -targetPosition.width || !isList;
        return shouldScroll ? distance : 0;
      }
      if (alignment === "center") {
        return diff - parentWidth / 2 + targetPosition.width / 2;
      }
      return 0;
    }
    return 0;
  };
  var getScrollStart = ({ axis, parent }) => {
    if (!parent && typeof document === "undefined") {
      return 0;
    }
    const method = axis === "y" ? "scrollTop" : "scrollLeft";
    if (parent) {
      return parent[method];
    }
    const { body, documentElement } = document;
    return body[method] + documentElement[method];
  };
  var setScrollParam = ({ axis, parent, distance }) => {
    if (!parent && typeof document === "undefined") {
      return;
    }
    const method = axis === "y" ? "scrollTop" : "scrollLeft";
    if (parent) {
      parent[method] = distance;
    } else {
      const { body, documentElement } = document;
      body[method] = distance;
      documentElement[method] = distance;
    }
  };
  function useScrollIntoView({
    duration = 1250,
    axis = "y",
    onScrollFinish,
    easing = easeInOutQuad,
    offset = 0,
    cancelable = true,
    isList = false
  } = {}) {
    const frameID = React.useRef(0);
    const startTime = React.useRef(0);
    const shouldStop = React.useRef(false);
    const scrollableRef = React.useRef(null);
    const targetRef = React.useRef(null);
    const reducedMotion = useReducedMotion();
    const cancel = () => {
      if (frameID.current) {
        cancelAnimationFrame(frameID.current);
      }
    };
    const scrollIntoView = React.useCallback(
      ({ alignment = "start" } = {}) => {
        shouldStop.current = false;
        if (frameID.current) {
          cancel();
        }
        const start = getScrollStart({ parent: scrollableRef.current, axis }) ?? 0;
        const change = getRelativePosition({
          parent: scrollableRef.current,
          target: targetRef.current,
          axis,
          alignment,
          offset,
          isList
        }) - (scrollableRef.current ? 0 : start);
        function animateScroll() {
          if (startTime.current === 0) {
            startTime.current = performance.now();
          }
          const now = performance.now();
          const elapsed = now - startTime.current;
          const t = reducedMotion || duration === 0 ? 1 : elapsed / duration;
          const distance = start + change * easing(t);
          setScrollParam({
            parent: scrollableRef.current,
            axis,
            distance
          });
          if (!shouldStop.current && t < 1) {
            frameID.current = requestAnimationFrame(animateScroll);
          } else {
            typeof onScrollFinish === "function" && onScrollFinish();
            startTime.current = 0;
            frameID.current = 0;
            cancel();
          }
        }
        animateScroll();
      },
      [axis, duration, easing, isList, offset, onScrollFinish, reducedMotion]
    );
    const handleStop = () => {
      if (cancelable) {
        shouldStop.current = true;
      }
    };
    useWindowEvent("wheel", handleStop, {
      passive: true
    });
    useWindowEvent("touchmove", handleStop, {
      passive: true
    });
    React.useEffect(() => cancel, []);
    return {
      scrollableRef,
      targetRef,
      scrollIntoView,
      cancel
    };
  }
  var defaultState = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  };
  function useResizeObserver(options) {
    const frameID = React.useRef(0);
    const ref = React.useRef(null);
    const [rect, setRect] = React.useState(defaultState);
    const observer = React.useMemo(
      () => typeof window !== "undefined" ? new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          cancelAnimationFrame(frameID.current);
          frameID.current = requestAnimationFrame(() => {
            if (ref.current) {
              setRect(entry.contentRect);
            }
          });
        }
      }) : null,
      []
    );
    React.useEffect(() => {
      if (ref.current) {
        observer?.observe(ref.current, options);
      }
      return () => {
        observer?.disconnect();
        if (frameID.current) {
          cancelAnimationFrame(frameID.current);
        }
      };
    }, [ref.current]);
    return [ref, rect];
  }
  function useElementSize(options) {
    const [ref, { width, height }] = useResizeObserver(options);
    return { ref, width, height };
  }
  function shallowCompare(prevValue, currValue) {
    if (!prevValue || !currValue) {
      return false;
    }
    if (prevValue === currValue) {
      return true;
    }
    if (prevValue.length !== currValue.length) {
      return false;
    }
    for (let i = 0; i < prevValue.length; i += 1) {
      if (!shallowEqual(prevValue[i], currValue[i])) {
        return false;
      }
    }
    return true;
  }
  function useShallowCompare(dependencies) {
    const ref = React.useRef([]);
    const updateRef = React.useRef(0);
    if (!shallowCompare(ref.current, dependencies)) {
      ref.current = dependencies;
      updateRef.current += 1;
    }
    return [updateRef.current];
  }
  function useShallowEffect(cb, dependencies) {
    React.useEffect(cb, useShallowCompare(dependencies));
  }
  function useToggle(options = [false, true]) {
    const [[option], toggle] = React.useReducer((state, action) => {
      const value = action instanceof Function ? action(state[0]) : action;
      const index = Math.abs(state.indexOf(value));
      return state.slice(index).concat(state.slice(0, index));
    }, options);
    return [option, toggle];
  }
  var eventListerOptions = {
    passive: true
  };
  function useViewportSize() {
    const [windowSize, setWindowSize] = React.useState({
      width: 0,
      height: 0
    });
    const setSize = React.useCallback(() => {
      setWindowSize({ width: window.innerWidth || 0, height: window.innerHeight || 0 });
    }, []);
    useWindowEvent("resize", setSize, eventListerOptions);
    useWindowEvent("orientationchange", setSize, eventListerOptions);
    React.useEffect(setSize, []);
    return windowSize;
  }
  function getScrollPosition() {
    return typeof window !== "undefined" ? { x: window.pageXOffset, y: window.pageYOffset } : { x: 0, y: 0 };
  }
  function scrollTo({ x, y }) {
    if (typeof window !== "undefined") {
      const scrollOptions = { behavior: "smooth" };
      if (typeof x === "number") {
        scrollOptions.left = x;
      }
      if (typeof y === "number") {
        scrollOptions.top = y;
      }
      window.scrollTo(scrollOptions);
    }
  }
  function useWindowScroll() {
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    useWindowEvent("scroll", () => setPosition(getScrollPosition()));
    useWindowEvent("resize", () => setPosition(getScrollPosition()));
    React.useEffect(() => {
      setPosition(getScrollPosition());
    }, []);
    return [position, scrollTo];
  }
  function useIntersection(options) {
    const [entry, setEntry] = React.useState(null);
    const observer = React.useRef(null);
    const ref = React.useCallback(
      (element) => {
        if (observer.current) {
          observer.current.disconnect();
          observer.current = null;
        }
        if (element === null) {
          setEntry(null);
          return;
        }
        observer.current = new IntersectionObserver(([_entry]) => {
          setEntry(_entry);
        }, options);
        observer.current.observe(element);
      },
      [options?.rootMargin, options?.root, options?.threshold]
    );
    return { ref, entry };
  }
  function useHash({ getInitialValueInEffect = true } = {}) {
    const [hash, setHash] = React.useState(
      getInitialValueInEffect ? "" : window.location.hash || ""
    );
    const setHashHandler = (value) => {
      const valueWithHash = value.startsWith("#") ? value : `#${value}`;
      window.location.hash = valueWithHash;
      setHash(valueWithHash);
    };
    useWindowEvent("hashchange", () => {
      const newHash = window.location.hash;
      if (hash !== newHash) {
        setHash(newHash);
      }
    });
    React.useEffect(() => {
      if (getInitialValueInEffect) {
        setHash(window.location.hash);
      }
    }, []);
    return [hash, setHashHandler];
  }
  function parseHotkey(hotkey) {
    const keys = hotkey.toLowerCase().split("+").map((part) => part.trim());
    const modifiers = {
      alt: keys.includes("alt"),
      ctrl: keys.includes("ctrl"),
      meta: keys.includes("meta"),
      mod: keys.includes("mod"),
      shift: keys.includes("shift"),
      plus: keys.includes("[plus]")
    };
    const reservedKeys = ["alt", "ctrl", "meta", "shift", "mod"];
    const freeKey = keys.find((key) => !reservedKeys.includes(key));
    return {
      ...modifiers,
      key: freeKey === "[plus]" ? "+" : freeKey
    };
  }
  function isExactHotkey(hotkey, event) {
    const { alt, ctrl, meta, mod, shift, key } = hotkey;
    const { altKey, ctrlKey, metaKey, shiftKey, key: pressedKey } = event;
    if (alt !== altKey) {
      return false;
    }
    if (mod) {
      if (!ctrlKey && !metaKey) {
        return false;
      }
    } else {
      if (ctrl !== ctrlKey) {
        return false;
      }
      if (meta !== metaKey) {
        return false;
      }
    }
    if (shift !== shiftKey) {
      return false;
    }
    if (key && (pressedKey.toLowerCase() === key.toLowerCase() || event.code.replace("Key", "").toLowerCase() === key.toLowerCase())) {
      return true;
    }
    return false;
  }
  function getHotkeyMatcher(hotkey) {
    return (event) => isExactHotkey(parseHotkey(hotkey), event);
  }
  function getHotkeyHandler(hotkeys) {
    return (event) => {
      const _event = "nativeEvent" in event ? event.nativeEvent : event;
      hotkeys.forEach(([hotkey, handler, options = { preventDefault: true }]) => {
        if (getHotkeyMatcher(hotkey)(_event)) {
          if (options.preventDefault) {
            event.preventDefault();
          }
          handler(_event);
        }
      });
    };
  }
  function shouldFireEvent(event, tagsToIgnore, triggerOnContentEditable = false) {
    if (event.target instanceof HTMLElement) {
      if (triggerOnContentEditable) {
        return !tagsToIgnore.includes(event.target.tagName);
      }
      return !event.target.isContentEditable && !tagsToIgnore.includes(event.target.tagName);
    }
    return true;
  }
  function useHotkeys(hotkeys, tagsToIgnore = ["INPUT", "TEXTAREA", "SELECT"], triggerOnContentEditable = false) {
    React.useEffect(() => {
      const keydownListener = (event) => {
        hotkeys.forEach(([hotkey, handler, options = { preventDefault: true }]) => {
          if (getHotkeyMatcher(hotkey)(event) && shouldFireEvent(event, tagsToIgnore, triggerOnContentEditable)) {
            if (options.preventDefault) {
              event.preventDefault();
            }
            handler(event);
          }
        });
      };
      document.documentElement.addEventListener("keydown", keydownListener);
      return () => document.documentElement.removeEventListener("keydown", keydownListener);
    }, [hotkeys]);
  }
  function getFullscreenElement() {
    const _document = window.document;
    const fullscreenElement = _document.fullscreenElement || _document.webkitFullscreenElement || _document.mozFullScreenElement || _document.msFullscreenElement;
    return fullscreenElement;
  }
  function exitFullscreen() {
    const _document = window.document;
    if (typeof _document.exitFullscreen === "function") {
      return _document.exitFullscreen();
    }
    if (typeof _document.msExitFullscreen === "function") {
      return _document.msExitFullscreen();
    }
    if (typeof _document.webkitExitFullscreen === "function") {
      return _document.webkitExitFullscreen();
    }
    if (typeof _document.mozCancelFullScreen === "function") {
      return _document.mozCancelFullScreen();
    }
    return null;
  }
  function enterFullScreen(element) {
    const _element = element;
    return _element.requestFullscreen?.() || _element.msRequestFullscreen?.() || _element.webkitEnterFullscreen?.() || _element.webkitRequestFullscreen?.() || _element.mozRequestFullscreen?.();
  }
  var prefixes = ["", "webkit", "moz", "ms"];
  function addEvents(element, {
    onFullScreen,
    onError
  }) {
    prefixes.forEach((prefix) => {
      element.addEventListener(`${prefix}fullscreenchange`, onFullScreen);
      element.addEventListener(`${prefix}fullscreenerror`, onError);
    });
    return () => {
      prefixes.forEach((prefix) => {
        element.removeEventListener(`${prefix}fullscreenchange`, onFullScreen);
        element.removeEventListener(`${prefix}fullscreenerror`, onError);
      });
    };
  }
  function useFullscreen() {
    const [fullscreen, setFullscreen] = React.useState(false);
    const _ref = React.useRef(null);
    const handleFullscreenChange = React.useCallback(
      (event) => {
        setFullscreen(event.target === getFullscreenElement());
      },
      [setFullscreen]
    );
    const handleFullscreenError = React.useCallback(
      (event) => {
        setFullscreen(false);
        console.error(
          `[@mantine/hooks] use-fullscreen: Error attempting full-screen mode method: ${event} (${event.target})`
        );
      },
      [setFullscreen]
    );
    const toggle = React.useCallback(async () => {
      if (!getFullscreenElement()) {
        await enterFullScreen(_ref.current);
      } else {
        await exitFullscreen();
      }
    }, []);
    const ref = React.useCallback((element) => {
      if (element === null) {
        _ref.current = window.document.documentElement;
      } else {
        _ref.current = element;
      }
    }, []);
    React.useEffect(() => {
      if (!_ref.current && window.document) {
        _ref.current = window.document.documentElement;
        return addEvents(_ref.current, {
          onFullScreen: handleFullscreenChange,
          onError: handleFullscreenError
        });
      }
      if (_ref.current) {
        return addEvents(_ref.current, {
          onFullScreen: handleFullscreenChange,
          onError: handleFullscreenError
        });
      }
      return void 0;
    }, [_ref.current]);
    return { ref, toggle, fullscreen };
  }
  function useLogger(componentName, props) {
    React.useEffect(() => {
      console.log(`${componentName} mounted`, ...props);
      return () => console.log(`${componentName} unmounted`);
    }, []);
    useDidUpdate(() => {
      console.log(`${componentName} updated`, ...props);
    }, props);
    return null;
  }
  function useHover() {
    const [hovered, setHovered] = React.useState(false);
    const ref = React.useRef(null);
    const onMouseEnter = React.useCallback(() => setHovered(true), []);
    const onMouseLeave = React.useCallback(() => setHovered(false), []);
    React.useEffect(() => {
      if (ref.current) {
        ref.current.addEventListener("mouseenter", onMouseEnter);
        ref.current.addEventListener("mouseleave", onMouseLeave);
        return () => {
          ref.current?.removeEventListener("mouseenter", onMouseEnter);
          ref.current?.removeEventListener("mouseleave", onMouseLeave);
        };
      }
      return void 0;
    }, [ref.current]);
    return { ref, hovered };
  }
  function useValidatedState(initialValue, validation, initialValidationState) {
    const [value, setValue] = React.useState(initialValue);
    const [lastValidValue, setLastValidValue] = React.useState(
      validation(initialValue) ? initialValue : void 0
    );
    const [valid, setValid] = React.useState(
      typeof initialValidationState === "boolean" ? initialValidationState : validation(initialValue)
    );
    const onChange = (val) => {
      if (validation(val)) {
        setLastValidValue(val);
        setValid(true);
      } else {
        setValid(false);
      }
      setValue(val);
    };
    return [{ value, lastValidValue, valid }, onChange];
  }
  function isMacOS(userAgent) {
    const macosPattern = /(Macintosh)|(MacIntel)|(MacPPC)|(Mac68K)/i;
    return macosPattern.test(userAgent);
  }
  function isIOS(userAgent) {
    const iosPattern = /(iPhone)|(iPad)|(iPod)/i;
    return iosPattern.test(userAgent);
  }
  function isWindows(userAgent) {
    const windowsPattern = /(Win32)|(Win64)|(Windows)|(WinCE)/i;
    return windowsPattern.test(userAgent);
  }
  function isAndroid(userAgent) {
    const androidPattern = /Android/i;
    return androidPattern.test(userAgent);
  }
  function isLinux(userAgent) {
    const linuxPattern = /Linux/i;
    return linuxPattern.test(userAgent);
  }
  function getOS() {
    if (typeof window === "undefined") {
      return "undetermined";
    }
    const { userAgent } = window.navigator;
    if (isIOS(userAgent) || isMacOS(userAgent) && "ontouchend" in document) {
      return "ios";
    }
    if (isMacOS(userAgent)) {
      return "macos";
    }
    if (isWindows(userAgent)) {
      return "windows";
    }
    if (isAndroid(userAgent)) {
      return "android";
    }
    if (isLinux(userAgent)) {
      return "linux";
    }
    return "undetermined";
  }
  function useOs(options = { getValueInEffect: true }) {
    const [value, setValue] = React.useState(options.getValueInEffect ? "undetermined" : getOS());
    useIsomorphicEffect(() => {
      if (options.getValueInEffect) {
        setValue(getOS);
      }
    }, []);
    return value;
  }
  function useSetState(initialState) {
    const [state, setState] = React.useState(initialState);
    const _setState = React.useCallback(
      (statePartial) => setState((current) => ({
        ...current,
        ...typeof statePartial === "function" ? statePartial(current) : statePartial
      })),
      []
    );
    return [state, _setState];
  }
  function getInputOnChange(setValue) {
    return (val) => {
      if (!val) {
        setValue(val);
      } else if (typeof val === "function") {
        setValue(val);
      } else if (typeof val === "object" && "nativeEvent" in val) {
        const { currentTarget } = val;
        if (currentTarget.type === "checkbox") {
          setValue(currentTarget.checked);
        } else {
          setValue(currentTarget.value);
        }
      } else {
        setValue(val);
      }
    };
  }
  function useInputState(initialState) {
    const [value, setValue] = React.useState(initialState);
    return [value, getInputOnChange(setValue)];
  }
  function useEventListener(type, listener, options) {
    const ref = React.useRef(null);
    React.useEffect(() => {
      if (ref.current) {
        ref.current.addEventListener(type, listener, options);
        return () => ref.current?.removeEventListener(type, listener, options);
      }
      return void 0;
    }, [listener, options]);
    return ref;
  }
  function useDisclosure(initialState = false, callbacks) {
    const { onOpen, onClose } = callbacks || {};
    const [opened, setOpened] = React.useState(initialState);
    const open = React.useCallback(() => {
      setOpened((isOpened) => {
        if (!isOpened) {
          onOpen?.();
          return true;
        }
        return isOpened;
      });
    }, [onOpen]);
    const close = React.useCallback(() => {
      setOpened((isOpened) => {
        if (isOpened) {
          onClose?.();
          return false;
        }
        return isOpened;
      });
    }, [onClose]);
    const toggle = React.useCallback(() => {
      opened ? close() : open();
    }, [close, open, opened]);
    return [opened, { open, close, toggle }];
  }
  function containsRelatedTarget(event) {
    if (event.currentTarget instanceof HTMLElement && event.relatedTarget instanceof HTMLElement) {
      return event.currentTarget.contains(event.relatedTarget);
    }
    return false;
  }
  function useFocusWithin({
    onBlur,
    onFocus
  } = {}) {
    const ref = React.useRef(null);
    const [focused, setFocused] = React.useState(false);
    const focusedRef = React.useRef(false);
    const _setFocused = (value) => {
      setFocused(value);
      focusedRef.current = value;
    };
    const handleFocusIn = (event) => {
      if (!focusedRef.current) {
        _setFocused(true);
        onFocus?.(event);
      }
    };
    const handleFocusOut = (event) => {
      if (focusedRef.current && !containsRelatedTarget(event)) {
        _setFocused(false);
        onBlur?.(event);
      }
    };
    React.useEffect(() => {
      if (ref.current) {
        ref.current.addEventListener("focusin", handleFocusIn);
        ref.current.addEventListener("focusout", handleFocusOut);
        return () => {
          ref.current?.removeEventListener("focusin", handleFocusIn);
          ref.current?.removeEventListener("focusout", handleFocusOut);
        };
      }
      return void 0;
    }, [handleFocusIn, handleFocusOut]);
    return { ref, focused };
  }
  function getConnection() {
    if (typeof navigator === "undefined") {
      return {};
    }
    const _navigator = navigator;
    const connection = _navigator.connection || _navigator.mozConnection || _navigator.webkitConnection;
    if (!connection) {
      return {};
    }
    return {
      downlink: connection?.downlink,
      downlinkMax: connection?.downlinkMax,
      effectiveType: connection?.effectiveType,
      rtt: connection?.rtt,
      saveData: connection?.saveData,
      type: connection?.type
    };
  }
  function useNetwork() {
    const [status, setStatus] = React.useState({
      online: true
    });
    const handleConnectionChange = React.useCallback(
      () => setStatus((current) => ({ ...current, ...getConnection() })),
      []
    );
    useWindowEvent("online", () => setStatus({ online: true, ...getConnection() }));
    useWindowEvent("offline", () => setStatus({ online: false, ...getConnection() }));
    React.useEffect(() => {
      const _navigator = navigator;
      if (_navigator.connection) {
        setStatus({ online: _navigator.onLine, ...getConnection() });
        _navigator.connection.addEventListener("change", handleConnectionChange);
        return () => _navigator.connection.removeEventListener("change", handleConnectionChange);
      }
      if (typeof _navigator.onLine === "boolean") {
        setStatus((current) => ({ ...current, online: _navigator.onLine }));
      }
      return void 0;
    }, []);
    return status;
  }
  function useTimeout(callback, delay, options = { autoInvoke: false }) {
    const timeoutRef = React.useRef(null);
    const start = React.useCallback(
      (...callbackParams) => {
        if (!timeoutRef.current) {
          timeoutRef.current = window.setTimeout(() => {
            callback(callbackParams);
            timeoutRef.current = null;
          }, delay);
        }
      },
      [delay]
    );
    const clear = React.useCallback(() => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }, []);
    React.useEffect(() => {
      if (options.autoInvoke) {
        start();
      }
      return clear;
    }, [clear, start]);
    return { start, clear };
  }
  function useTextSelection() {
    const forceUpdate = useForceUpdate();
    const [selection, setSelection] = React.useState(null);
    const handleSelectionChange = () => {
      setSelection(document.getSelection());
      forceUpdate();
    };
    React.useEffect(() => {
      setSelection(document.getSelection());
      document.addEventListener("selectionchange", handleSelectionChange);
      return () => document.removeEventListener("selectionchange", handleSelectionChange);
    }, []);
    return selection;
  }
  function usePrevious(value) {
    const ref = React.useRef(void 0);
    React.useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }
  var MIME_TYPES = {
    ico: "image/x-icon",
    png: "image/png",
    svg: "image/svg+xml",
    gif: "image/gif"
  };
  function useFavicon(url) {
    const link = React.useRef(null);
    useIsomorphicEffect(() => {
      if (!url) {
        return;
      }
      if (!link.current) {
        const existingElements = document.querySelectorAll('link[rel*="icon"]');
        existingElements.forEach((element2) => document.head.removeChild(element2));
        const element = document.createElement("link");
        element.rel = "shortcut icon";
        link.current = element;
        document.querySelector("head").appendChild(element);
      }
      const splittedUrl = url.split(".");
      link.current.setAttribute(
        "type",
        MIME_TYPES[splittedUrl[splittedUrl.length - 1].toLowerCase()]
      );
      link.current.setAttribute("href", url);
    }, [url]);
  }
  var isFixed = (current, fixedAt) => current <= fixedAt;
  var isPinnedOrReleased = (current, fixedAt, isCurrentlyPinnedRef, isScrollingUp, onPin, onRelease) => {
    const isInFixedPosition = isFixed(current, fixedAt);
    if (isInFixedPosition && !isCurrentlyPinnedRef.current) {
      isCurrentlyPinnedRef.current = true;
      onPin?.();
    } else if (!isInFixedPosition && isScrollingUp && !isCurrentlyPinnedRef.current) {
      isCurrentlyPinnedRef.current = true;
      onPin?.();
    } else if (!isInFixedPosition && isCurrentlyPinnedRef.current) {
      isCurrentlyPinnedRef.current = false;
      onRelease?.();
    }
  };
  var useScrollDirection = () => {
    const [lastScrollTop, setLastScrollTop] = React.useState(0);
    const [isScrollingUp, setIsScrollingUp] = React.useState(false);
    const [isResizing, setIsResizing] = React.useState(false);
    React.useEffect(() => {
      let resizeTimer;
      const onResize = () => {
        setIsResizing(true);
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          setIsResizing(false);
        }, 300);
      };
      const onScroll = () => {
        if (isResizing) {
          return;
        }
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        setIsScrollingUp(currentScrollTop < lastScrollTop);
        setLastScrollTop(currentScrollTop);
      };
      window.addEventListener("scroll", onScroll);
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
      };
    }, [lastScrollTop, isResizing]);
    return isScrollingUp;
  };
  function useHeadroom({ fixedAt = 0, onPin, onFix, onRelease } = {}) {
    const isCurrentlyPinnedRef = React.useRef(false);
    const isScrollingUp = useScrollDirection();
    const [{ y: scrollPosition }] = useWindowScroll();
    useIsomorphicEffect(() => {
      isPinnedOrReleased(
        scrollPosition,
        fixedAt,
        isCurrentlyPinnedRef,
        isScrollingUp,
        onPin,
        onRelease
      );
    }, [scrollPosition]);
    useIsomorphicEffect(() => {
      if (isFixed(scrollPosition, fixedAt)) {
        onFix?.();
      }
    }, [scrollPosition, fixedAt, onFix]);
    if (isFixed(scrollPosition, fixedAt) || isScrollingUp) {
      return true;
    }
    return false;
  }
  function isOpera() {
    return navigator.userAgent.includes("OPR");
  }
  function useEyeDropper() {
    const [supported, setSupported] = React.useState(false);
    useIsomorphicEffect(() => {
      setSupported(typeof window !== "undefined" && !isOpera() && "EyeDropper" in window);
    }, []);
    const open = React.useCallback(
      (options = {}) => {
        if (supported) {
          const eyeDropper = new window.EyeDropper();
          return eyeDropper.open(options);
        }
        return Promise.resolve(void 0);
      },
      [supported]
    );
    return { supported, open };
  }
  function useInViewport() {
    const observer = React.useRef(null);
    const [inViewport, setInViewport] = React.useState(false);
    const ref = React.useCallback((node) => {
      if (typeof IntersectionObserver !== "undefined") {
        if (node && !observer.current) {
          observer.current = new IntersectionObserver(
            ([entry]) => setInViewport(entry.isIntersecting)
          );
        } else {
          observer.current?.disconnect();
        }
        if (node) {
          observer.current?.observe(node);
        } else {
          setInViewport(false);
        }
      }
    }, []);
    return { ref, inViewport };
  }
  function useMutationObserver(callback, options, target) {
    const observer = React.useRef(null);
    const ref = React.useRef(null);
    React.useEffect(() => {
      const targetElement = typeof target === "function" ? target() : target;
      if (targetElement || ref.current) {
        observer.current = new MutationObserver(callback);
        observer.current.observe(targetElement || ref.current, options);
      }
      return () => {
        observer.current?.disconnect();
      };
    }, [callback, options]);
    return ref;
  }
  function useMounted() {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    return mounted;
  }
  function useStateHistory(initialValue) {
    const [state, setState] = React.useState({
      history: [initialValue],
      current: 0
    });
    const set = React.useCallback(
      (val) => setState((currentState) => {
        const nextState = [...currentState.history.slice(0, currentState.current + 1), val];
        return {
          history: nextState,
          current: nextState.length - 1
        };
      }),
      []
    );
    const back = React.useCallback(
      (steps = 1) => setState((currentState) => ({
        history: currentState.history,
        current: Math.max(0, currentState.current - steps)
      })),
      []
    );
    const forward = React.useCallback(
      (steps = 1) => setState((currentState) => ({
        history: currentState.history,
        current: Math.min(currentState.history.length - 1, currentState.current + steps)
      })),
      []
    );
    const reset = React.useCallback(() => {
      setState({ history: [initialValue], current: 0 });
    }, [initialValue]);
    const handlers = React.useMemo(() => ({ back, forward, reset, set }), [back, forward, reset, set]);
    return [state.history[state.current], handlers, state];
  }
  function useMap(initialState) {
    const mapRef = React.useRef(new Map(initialState));
    const forceUpdate = useForceUpdate();
    mapRef.current.set = (...args) => {
      Map.prototype.set.apply(mapRef.current, args);
      forceUpdate();
      return mapRef.current;
    };
    mapRef.current.clear = (...args) => {
      Map.prototype.clear.apply(mapRef.current, args);
      forceUpdate();
    };
    mapRef.current.delete = (...args) => {
      const res = Map.prototype.delete.apply(mapRef.current, args);
      forceUpdate();
      return res;
    };
    return mapRef.current;
  }
  function useSet(values) {
    const setRef = React.useRef(new Set(values));
    const forceUpdate = useForceUpdate();
    setRef.current.add = (...args) => {
      const res = Set.prototype.add.apply(setRef.current, args);
      forceUpdate();
      return res;
    };
    setRef.current.clear = (...args) => {
      Set.prototype.clear.apply(setRef.current, args);
      forceUpdate();
    };
    setRef.current.delete = (...args) => {
      const res = Set.prototype.delete.apply(setRef.current, args);
      forceUpdate();
      return res;
    };
    return setRef.current;
  }
  function useThrottledCallbackWithClearTimeout(callback, wait) {
    const handleCallback = useCallbackRef(callback);
    const latestInArgsRef = React.useRef(null);
    const latestOutArgsRef = React.useRef(null);
    const active = React.useRef(true);
    const waitRef = React.useRef(wait);
    const timeoutRef = React.useRef(-1);
    const clearTimeout2 = () => window.clearTimeout(timeoutRef.current);
    const callThrottledCallback = React.useCallback(
      (...args) => {
        handleCallback(...args);
        latestInArgsRef.current = args;
        latestOutArgsRef.current = args;
        active.current = false;
      },
      [handleCallback]
    );
    const timerCallback = React.useCallback(() => {
      if (latestInArgsRef.current && latestInArgsRef.current !== latestOutArgsRef.current) {
        callThrottledCallback(...latestInArgsRef.current);
        timeoutRef.current = window.setTimeout(timerCallback, waitRef.current);
      } else {
        active.current = true;
      }
    }, [callThrottledCallback]);
    const throttled = React.useCallback(
      (...args) => {
        if (active.current) {
          callThrottledCallback(...args);
          timeoutRef.current = window.setTimeout(timerCallback, waitRef.current);
        } else {
          latestInArgsRef.current = args;
        }
      },
      [callThrottledCallback, timerCallback]
    );
    React.useEffect(() => {
      waitRef.current = wait;
    }, [wait]);
    return [throttled, clearTimeout2];
  }
  function useThrottledCallback(callback, wait) {
    return useThrottledCallbackWithClearTimeout(callback, wait)[0];
  }
  function useThrottledState(defaultValue, wait) {
    const [value, setValue] = React.useState(defaultValue);
    const [setThrottledValue, clearTimeout2] = useThrottledCallbackWithClearTimeout(setValue, wait);
    React.useEffect(() => clearTimeout2, []);
    return [value, setThrottledValue];
  }
  function useThrottledValue(value, wait) {
    const [throttledValue, setThrottledValue] = React.useState(value);
    const valueRef = React.useRef(value);
    const [throttledSetValue, clearTimeout2] = useThrottledCallbackWithClearTimeout(
      setThrottledValue,
      wait
    );
    React.useEffect(() => {
      if (value !== valueRef.current) {
        valueRef.current = value;
        throttledSetValue(value);
      }
    }, [throttledSetValue, value]);
    React.useEffect(() => clearTimeout2, []);
    return throttledValue;
  }
  function useIsFirstRender() {
    const renderRef = React.useRef(true);
    if (renderRef.current === true) {
      renderRef.current = false;
      return true;
    }
    return renderRef.current;
  }
  function useOrientation() {
    const [orientation, setOrientation] = React.useState({ angle: 0, type: "landscape-primary" });
    const handleOrientationChange = (event) => {
      const target = event.currentTarget;
      setOrientation({ angle: target?.angle || 0, type: target?.type || "landscape-primary" });
    };
    useIsomorphicEffect(() => {
      window.screen.orientation?.addEventListener("change", handleOrientationChange);
      return () => window.screen.orientation?.removeEventListener("change", handleOrientationChange);
    }, []);
    return orientation;
  }
  function useFetch(url, { autoInvoke = true, ...options } = {}) {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const controller = React.useRef(null);
    const refetch = React.useCallback(() => {
      if (!url) {
        return;
      }
      if (controller.current) {
        controller.current.abort();
      }
      controller.current = new AbortController();
      setLoading(true);
      return fetch(url, { signal: controller.current.signal, ...options }).then((res) => res.json()).then((res) => {
        setData(res);
        setLoading(false);
        return res;
      }).catch((err) => {
        setLoading(false);
        if (err.name !== "AbortError") {
          setError(err);
        }
        return err;
      });
    }, [url]);
    const abort = React.useCallback(() => {
      if (controller.current) {
        controller.current?.abort("");
      }
    }, []);
    React.useEffect(() => {
      if (autoInvoke) {
        refetch();
      }
      return () => {
        if (controller.current) {
          controller.current.abort("");
        }
      };
    }, [refetch, autoInvoke]);
    return { data, loading, error, refetch, abort };
  }
  function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
  }
  function getElementCenter(element) {
    const rect = element.getBoundingClientRect();
    return [rect.left + rect.width / 2, rect.top + rect.height / 2];
  }
  function getAngle(coordinates, element) {
    const center = getElementCenter(element);
    const x = coordinates[0] - center[0];
    const y = coordinates[1] - center[1];
    const deg = radiansToDegrees(Math.atan2(x, y)) + 180;
    return 360 - deg;
  }
  function toFixed(value, digits) {
    return parseFloat(value.toFixed(digits));
  }
  function getDigitsAfterDot(value) {
    return value.toString().split(".")[1]?.length || 0;
  }
  function normalizeRadialValue(degree, step) {
    const clamped = clamp(degree, 0, 360);
    const high = Math.ceil(clamped / step);
    const low = Math.round(clamped / step);
    return toFixed(
      high >= clamped / step ? high * step === 360 ? 0 : high * step : low * step,
      getDigitsAfterDot(step)
    );
  }
  function useRadialMove(onChange, { step = 0.01, onChangeEnd, onScrubStart, onScrubEnd } = {}) {
    const ref = React.useRef(null);
    const mounted = React.useRef(false);
    const [active, setActive] = React.useState(false);
    React.useEffect(() => {
      mounted.current = true;
    }, []);
    React.useEffect(() => {
      const update = (event, done = false) => {
        if (ref.current) {
          ref.current.style.userSelect = "none";
          const deg = getAngle([event.clientX, event.clientY], ref.current);
          const newValue = normalizeRadialValue(deg, step || 1);
          onChange(newValue);
          done && onChangeEnd?.(newValue);
        }
      };
      const beginTracking = () => {
        onScrubStart?.();
        setActive(true);
        document.addEventListener("mousemove", handleMouseMove, false);
        document.addEventListener("mouseup", handleMouseUp, false);
        document.addEventListener("touchmove", handleTouchMove, { passive: false });
        document.addEventListener("touchend", handleTouchEnd, false);
      };
      const endTracking = () => {
        onScrubEnd?.();
        setActive(false);
        document.removeEventListener("mousemove", handleMouseMove, false);
        document.removeEventListener("mouseup", handleMouseUp, false);
        document.removeEventListener("touchmove", handleTouchMove, false);
        document.removeEventListener("touchend", handleTouchEnd, false);
      };
      const onMouseDown = (event) => {
        beginTracking();
        update(event);
      };
      const handleMouseMove = (event) => {
        update(event);
      };
      const handleMouseUp = (event) => {
        update(event, true);
        endTracking();
      };
      const handleTouchMove = (event) => {
        event.preventDefault();
        update(event.touches[0]);
      };
      const handleTouchEnd = (event) => {
        update(event.changedTouches[0], true);
        endTracking();
      };
      const handleTouchStart = (event) => {
        event.preventDefault();
        beginTracking();
        update(event.touches[0]);
      };
      ref.current?.addEventListener("mousedown", onMouseDown);
      ref.current?.addEventListener("touchstart", handleTouchStart, { passive: false });
      return () => {
        if (ref.current) {
          ref.current.removeEventListener("mousedown", onMouseDown);
          ref.current.removeEventListener("touchstart", handleTouchStart);
        }
      };
    }, [onChange]);
    return { ref, active };
  }
  exports.assignRef = assignRef;
  exports.clamp = clamp;
  exports.clampUseMovePosition = clampUseMovePosition;
  exports.getHotkeyHandler = getHotkeyHandler;
  exports.lowerFirst = lowerFirst;
  exports.mergeRefs = mergeRefs;
  exports.normalizeRadialValue = normalizeRadialValue;
  exports.randomId = randomId;
  exports.range = range;
  exports.readLocalStorageValue = readLocalStorageValue;
  exports.readSessionStorageValue = readSessionStorageValue;
  exports.shallowEqual = shallowEqual;
  exports.upperFirst = upperFirst;
  exports.useCallbackRef = useCallbackRef;
  exports.useClickOutside = useClickOutside;
  exports.useClipboard = useClipboard;
  exports.useColorScheme = useColorScheme;
  exports.useCounter = useCounter;
  exports.useDebouncedCallback = useDebouncedCallback;
  exports.useDebouncedState = useDebouncedState;
  exports.useDebouncedValue = useDebouncedValue;
  exports.useDidUpdate = useDidUpdate;
  exports.useDisclosure = useDisclosure;
  exports.useDocumentTitle = useDocumentTitle;
  exports.useDocumentVisibility = useDocumentVisibility;
  exports.useElementSize = useElementSize;
  exports.useEventListener = useEventListener;
  exports.useEyeDropper = useEyeDropper;
  exports.useFavicon = useFavicon;
  exports.useFetch = useFetch;
  exports.useFocusReturn = useFocusReturn;
  exports.useFocusTrap = useFocusTrap;
  exports.useFocusWithin = useFocusWithin;
  exports.useForceUpdate = useForceUpdate;
  exports.useFullscreen = useFullscreen;
  exports.useHash = useHash;
  exports.useHeadroom = useHeadroom;
  exports.useHotkeys = useHotkeys;
  exports.useHover = useHover;
  exports.useId = useId;
  exports.useIdle = useIdle;
  exports.useInViewport = useInViewport;
  exports.useInputState = useInputState;
  exports.useIntersection = useIntersection;
  exports.useInterval = useInterval;
  exports.useIsFirstRender = useIsFirstRender;
  exports.useIsomorphicEffect = useIsomorphicEffect;
  exports.useListState = useListState;
  exports.useLocalStorage = useLocalStorage;
  exports.useLogger = useLogger;
  exports.useMap = useMap;
  exports.useMediaQuery = useMediaQuery;
  exports.useMergedRef = useMergedRef;
  exports.useMounted = useMounted;
  exports.useMouse = useMouse;
  exports.useMove = useMove;
  exports.useMutationObserver = useMutationObserver;
  exports.useNetwork = useNetwork;
  exports.useOrientation = useOrientation;
  exports.useOs = useOs;
  exports.usePageLeave = usePageLeave;
  exports.usePagination = usePagination;
  exports.usePrevious = usePrevious;
  exports.useQueue = useQueue;
  exports.useRadialMove = useRadialMove;
  exports.useReducedMotion = useReducedMotion;
  exports.useResizeObserver = useResizeObserver;
  exports.useScrollIntoView = useScrollIntoView;
  exports.useSessionStorage = useSessionStorage;
  exports.useSet = useSet;
  exports.useSetState = useSetState;
  exports.useShallowEffect = useShallowEffect;
  exports.useStateHistory = useStateHistory;
  exports.useTextSelection = useTextSelection;
  exports.useThrottledCallback = useThrottledCallback;
  exports.useThrottledState = useThrottledState;
  exports.useThrottledValue = useThrottledValue;
  exports.useTimeout = useTimeout;
  exports.useToggle = useToggle;
  exports.useUncontrolled = useUncontrolled;
  exports.useValidatedState = useValidatedState;
  exports.useViewportSize = useViewportSize;
  exports.useWindowEvent = useWindowEvent;
  exports.useWindowScroll = useWindowScroll;
}));