// ==UserScript==
// @name         哔哩哔哩新版首页排版调整和去广告(bilibili)
// @namespace    http://tampermonkey.net/
// @version      2.2.1
// @author       Ling2Ling4
// @description  调整B站首页每行的视频数, 可屏蔽首页和视频页的广告, 可自定义过滤视频
// @license      MIT
// @icon         data:image/png;base64,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
// @match        *://www.bilibili.com/
// @match        *://www.bilibili.com/?*
// @match        *://www.bilibili.com/video/*
// @require      https://cdn.jsdelivr.net/npm/spark-md5@3.0.2/spark-md5.min.js
// @require      https://cdn.jsdelivr.net/npm/umd-react@19.2.1/dist/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/umd-react@19.2.1/dist/react-dom.production.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/477487/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%96%B0%E7%89%88%E9%A6%96%E9%A1%B5%E6%8E%92%E7%89%88%E8%B0%83%E6%95%B4%E5%92%8C%E5%8E%BB%E5%B9%BF%E5%91%8A%28bilibili%29.user.js
// @updateURL https://update.greasyfork.org/scripts/477487/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%96%B0%E7%89%88%E9%A6%96%E9%A1%B5%E6%8E%92%E7%89%88%E8%B0%83%E6%95%B4%E5%92%8C%E5%8E%BB%E5%B9%BF%E5%91%8A%28bilibili%29.meta.js
// ==/UserScript==

(function (React, ReactDOM) {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

  /**
   * @license lucide-react v0.475.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  const mergeClasses = (...classes) => classes.filter((className, index, array) => {
    return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
  }).join(" ").trim();
  /**
   * @license lucide-react v0.475.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  /**
   * @license lucide-react v0.475.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const Icon = React.forwardRef(
    ({
      color = "currentColor",
      size = 24,
      strokeWidth = 2,
      absoluteStrokeWidth,
      className = "",
      children,
      iconNode,
      ...rest
    }, ref) => {
      return React.createElement(
        "svg",
        {
          ref,
          ...defaultAttributes,
          width: size,
          height: size,
          stroke: color,
          strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
          className: mergeClasses("lucide", className),
          ...rest
        },
        [
          ...iconNode.map(([tag, attrs]) => React.createElement(tag, attrs)),
          ...Array.isArray(children) ? children : [children]
        ]
      );
    }
  );
  /**
   * @license lucide-react v0.475.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const createLucideIcon = (iconName, iconNode) => {
    const Component = React.forwardRef(
      ({ className, ...props }, ref) => React.createElement(Icon, {
        ref,
        iconNode,
        className: mergeClasses(`lucide-${toKebabCase(iconName)}`, className),
        ...props
      })
    );
    Component.displayName = `${iconName}`;
    return Component;
  };
  /**
   * @license lucide-react v0.475.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const __iconNode$4 = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
  const ChevronDown = createLucideIcon("ChevronDown", __iconNode$4);
  /**
   * @license lucide-react v0.475.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const __iconNode$3 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
  const ChevronRight = createLucideIcon("ChevronRight", __iconNode$3);
  /**
   * @license lucide-react v0.475.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const __iconNode$2 = [
    [
      "path",
      {
        d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
        key: "1qme2f"
      }
    ],
    ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
  ];
  const Settings = createLucideIcon("Settings", __iconNode$2);
  /**
   * @license lucide-react v0.475.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const __iconNode$1 = [
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
    ["polyline", { points: "17 8 12 3 7 8", key: "t8dd8p" }],
    ["line", { x1: "12", x2: "12", y1: "3", y2: "15", key: "widbto" }]
  ];
  const Upload = createLucideIcon("Upload", __iconNode$1);
  /**
   * @license lucide-react v0.475.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   */
  const __iconNode = [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
  ];
  const X = createLucideIcon("X", __iconNode);
  class SettingsUtils {
static convert(value, targetType, options = {}) {
      const { fromType, reference = 0 } = options;
      const strVal = String(value).trim();
      const timeTypes = ["time", "seconds", "hour", "minute", "second"];
      const isTimeTarget = timeTypes.includes(targetType);
      const isSourceTime = fromType && timeTypes.includes(fromType) || strVal.includes(":");
      if (isTimeTarget || isSourceTime) {
        let totalSeconds = 0;
        if (strVal.includes(":")) {
          const sign = strVal.startsWith("-") ? -1 : 1;
          const cleanStr = strVal.replace(/^-/, "");
          const parts = cleanStr.split(":").map((v) => parseFloat(v) || 0).reverse();
          const s = parts[0] || 0;
          const m = parts[1] || 0;
          const h = parts[2] || 0;
          totalSeconds = (h * 3600 + m * 60 + s) * sign;
        } else {
          const valNum = parseFloat(strVal);
          if (isNaN(valNum)) {
            totalSeconds = 0;
          } else {
            switch (fromType) {
              case "hour":
                totalSeconds = valNum * 3600;
                break;
              case "minute":
                totalSeconds = valNum * 60;
                break;
              case "second":
              case "seconds":
                totalSeconds = valNum;
                break;
              default:
                totalSeconds = valNum;
                break;
            }
          }
        }
        switch (targetType) {
          case "hour":
            return Number((totalSeconds / 3600).toFixed(4));
          case "minute":
            return Number((totalSeconds / 60).toFixed(2));
          case "second":
          case "seconds":
          case "value":
            return Number(totalSeconds.toFixed(2));
          case "time":
            const sign = totalSeconds < 0 ? "-" : "";
            const absSec = Math.abs(totalSeconds);
            const h = Math.floor(absSec / 3600);
            const m = Math.floor(absSec % 3600 / 60);
            const s = Math.floor(absSec % 60);
            const mStr = m.toString().padStart(2, "0");
            const sStr = s.toString().padStart(2, "0");
            if (h > 0) {
              const hStr = h.toString().padStart(2, "0");
              return `${sign}${hStr}:${mStr}:${sStr}`;
            } else {
              return `${sign}${mStr}:${sStr}`;
            }
          default:
            return totalSeconds;
        }
      }
      const num = parseFloat(strVal);
      if (isNaN(num)) return 0;
      const isSourcePercent = fromType === "%" || fromType === void 0 && strVal.endsWith("%");
      const isTargetPercent = targetType === "%";
      if (isSourcePercent && !isTargetPercent) {
        return Number((num / 100 * reference).toFixed(2));
      }
      if (!isSourcePercent && isTargetPercent) {
        if (reference === 0) return 0;
        return Number((num / reference * 100).toFixed(2));
      }
      return Number(num.toFixed(2));
    }
static contrlUnitChange(currentVal, newUnit, referenceType, component, context) {
      let refSize = currentVal;
      switch (referenceType) {
        case "w":
          refSize = component?.width || 0;
          break;
        case "h":
          refSize = component?.height || 0;
          break;
        case "cw":
          refSize = context?.width || 0;
          break;
        case "ch":
          refSize = context?.height || 0;
          break;
      }
      const fromUnit = newUnit === "%" ? "px" : "%";
      return this.convert(currentVal, newUnit, { fromType: fromUnit, reference: refSize });
    }
static createUnitChangeHandler(unitKey, valueKey, referenceType) {
      return (newUnit, currentVal, component, context) => {
        let newVal = currentVal;
        if (component[unitKey] !== newUnit) {
          newVal = this.contrlUnitChange(currentVal, newUnit, referenceType, component, context);
        }
        return { [unitKey]: newUnit, [valueKey]: newVal };
      };
    }
static createAspectRatioHandler(changedKey) {
      return (newValue, component, context) => {
        if (!component.lockAspectRatio) return {};
        const ctxW = context?.width || 0;
        const ctxH = context?.height || 0;
        const getPx = (val, unit, ref) => {
          return unit === "px" ? val : this.convert(val, "px", { fromType: "%", reference: ref });
        };
        const oldW = getPx(component.width, component.widthUnit, ctxW);
        const oldH = getPx(component.height, component.heightUnit, ctxH);
        if (oldW === 0 || oldH === 0) return {};
        const ratio = oldW / oldH;
        const isWidthChange = changedKey === "width";
        const refSize = isWidthChange ? ctxW : ctxH;
        const currentUnit = component[changedKey + "Unit"];
        const newPx = getPx(newValue, currentUnit, refSize);
        let targetPx = 0;
        if (isWidthChange) {
          targetPx = newPx / ratio;
        } else {
          targetPx = newPx * ratio;
        }
        const targetKey = isWidthChange ? "height" : "width";
        const targetUnitKey = targetKey + "Unit";
        const targetUnit = component[targetUnitKey];
        const targetRefSize = isWidthChange ? ctxH : ctxW;
        let targetVal = targetUnit === "px" ? targetPx : this.convert(targetPx, "%", { fromType: "px", reference: targetRefSize });
        return { [targetKey]: targetVal };
      };
    }
static extractDefaults(groups) {
      const defaults = {};
      groups.forEach((group) => {
        group.controls.forEach((control) => {
          if (control.defaultValue !== void 0) {
            defaults[control.key] = control.defaultValue;
          }
          if (control.type === "unit" && control.unitKey) {
            defaults[control.unitKey] = "%";
          }
        });
      });
      return defaults;
    }
static extractPropsFromSettings(instance, groups, excludeKeys = []) {
      const props = {};
      groups.forEach((group) => {
        group.controls.forEach((control) => {
          if (control.type.startsWith("ui-")) return;
          if (excludeKeys.includes(control.key)) return;
          if (control.key && instance[control.key] !== void 0) {
            props[control.key] = instance[control.key];
          }
          if (control.type === "unit" && control.unitKey && instance[control.unitKey] !== void 0) {
            props[control.unitKey] = instance[control.unitKey];
          }
          if (control.persistenceKey && instance[control.persistenceKey] !== void 0) {
            if (!excludeKeys.includes(control.persistenceKey)) {
              props[control.persistenceKey] = instance[control.persistenceKey];
            }
          }
        });
      });
      return props;
    }
  }
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  const ControlDescription = ({ text, mb = true }) => {
    if (!text) return null;
    return React.createElement("div", { className: `text-[10px] text-gray-500 leading-tight ${mb ? "mb-1" : ""}` }, text);
  };
  const ControlLabel = ({ label, tooltip, disabled }) => {
    if (!label) return null;
    return React.createElement(
      "label",
      {
        className: `block text-[10px] transition-colors ${disabled ? "text-gray-600" : "text-gray-400"} ${tooltip && !disabled ? "cursor-help decoration-dashed underline underline-offset-2 decoration-gray-600 hover:text-primary hover:decoration-primary" : ""}`,
        title: tooltip
      },
      label
    );
  };
  const Divider = ({ style }) => {
    const defaultStyle = {
      borderTop: "1px solid #ffffff0d",
      margin: "0.25rem 0",
      width: "100%",
      height: "1px"
    };
    return React.createElement("div", { style: { ...defaultStyle, ...style } });
  };
  const InfoText = ({ text, style, hyperlink, url }) => {
    const defaultStyle = {
      color: "#9ca3af",
      fontSize: "10px",
      margin: "0.25rem 0",
      lineHeight: "1.25rem",
      whiteSpace: "pre-wrap"
    };
    if (hyperlink && url) {
      return React.createElement(
        "a",
        {
          href: url,
          target: "_blank",
          rel: "noopener noreferrer",
          style: { ...defaultStyle, ...style, textDecoration: "underline", cursor: "pointer" },
          className: "hover:opacity-80 transition-opacity block"
        },
        text
      );
    }
    return React.createElement("div", { style: { ...defaultStyle, ...style } }, text);
  };
  const useWheelInput = (value, onChange, step = 1, min, max) => {
    const ref = React.useRef(null);
    const propsRef = React.useRef({ value, onChange, step, min, max });
    propsRef.current = { value, onChange, step, min, max };
    React.useEffect(() => {
      const element = ref.current;
      if (!element) return;
      const handleWheel = (e) => {
        if (document.activeElement !== element) return;
        e.preventDefault();
        e.stopPropagation();
        const { value: value2, onChange: onChange2, step: step2, min: min2, max: max2 } = propsRef.current;
        let multiplier = 1;
        if (e.shiftKey) multiplier = 10;
        if (e.ctrlKey) multiplier = 100;
        const direction = e.deltaY > 0 ? -1 : 1;
        let nextValue = value2 + step2 * multiplier * direction;
        if (max2 !== void 0) nextValue = Math.min(max2, nextValue);
        if (min2 !== void 0) nextValue = Math.max(min2, nextValue);
        onChange2(Number(nextValue.toFixed(2)));
      };
      element.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        element.removeEventListener("wheel", handleWheel);
      };
    });
    return ref;
  };
  const NumberInput = ({ value, onChange, step = 1, min, max, label, description, className, labelTooltip, inputTooltip, disabled }) => {
    const [localValue, setLocalValue] = React.useState(String(value));
    const [isFocused, setIsFocused] = React.useState(false);
    React.useEffect(() => {
      if (!isFocused) {
        setLocalValue(String(value));
      }
    }, [value, isFocused]);
    const handleExternalUpdate = (newVal) => {
      onChange(newVal);
      setLocalValue(String(newVal));
    };
    const inputRef = useWheelInput(value, handleExternalUpdate, step, min, max);
    const handleChange = (e) => {
      const raw = e.target.value;
      setLocalValue(raw);
      if (raw === "" || raw === "-") return;
      const parsed = parseFloat(raw);
      if (!isNaN(parsed)) {
        if (!raw.endsWith(".") && !raw.endsWith(".0")) {
          onChange(parsed);
        }
      }
    };
    const handleBlur = () => {
      setIsFocused(false);
      let parsed = parseFloat(localValue);
      if (isNaN(parsed) || localValue === "") {
        parsed = value;
      }
      if (max !== void 0) parsed = Math.min(max, parsed);
      if (min !== void 0) parsed = Math.max(min, parsed);
      const finalVal = Number(parsed.toFixed(2));
      onChange(finalVal);
      setLocalValue(String(finalVal));
    };
    return React.createElement("div", { className: label ? "group" : "" }, React.createElement(ControlLabel, { label, tooltip: labelTooltip, disabled }), React.createElement(ControlDescription, { text: description }), React.createElement(
      "input",
      {
        ref: inputRef,
        type: "number",
        value: localValue,
        title: inputTooltip,
        disabled,
        onChange: handleChange,
        onFocus: () => setIsFocused(true),
        onBlur: handleBlur,
        onKeyDown: (e) => e.key === "Enter" && inputRef.current?.blur(),
        step,
        min,
        max,
        className: `${className || "w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-white focus:border-primary outline-none transition-all text-xs"} ${disabled ? "opacity-50 cursor-not-allowed text-gray-500" : ""}`
      }
    ));
  };
  const UnitInput = ({ label, description, value, unit, onChange, onUnitChange, min, max, labelTooltip, inputTooltip, disabled }) => {
    const [localValue, setLocalValue] = React.useState(String(Number(value.toFixed(2))));
    const [isFocused, setIsFocused] = React.useState(false);
    React.useEffect(() => {
      if (!isFocused) {
        setLocalValue(String(Number(value.toFixed(2))));
      }
    }, [value, isFocused]);
    const handleExternalUpdate = (newVal) => {
      onChange(newVal);
      setLocalValue(String(newVal));
    };
    const inputRef = useWheelInput(value, handleExternalUpdate, 1, min, max);
    const handleUnitSwitch = (newUnit) => {
      if (newUnit === unit) return;
      onUnitChange(newUnit);
    };
    const handleChange = (e) => {
      const raw = e.target.value;
      setLocalValue(raw);
      if (raw === "" || raw === "-") return;
      const parsed = parseFloat(raw);
      if (!isNaN(parsed)) {
        if (!raw.endsWith(".") && !raw.endsWith(".0")) {
          onChange(parsed);
        }
      }
    };
    const handleBlur = () => {
      setIsFocused(false);
      let parsed = parseFloat(localValue);
      if (isNaN(parsed) || localValue === "") {
        parsed = value;
      }
      if (min !== void 0) parsed = Math.max(min, parsed);
      if (max !== void 0) parsed = Math.min(max, parsed);
      const finalVal = Number(parsed.toFixed(2));
      onChange(finalVal);
      setLocalValue(String(finalVal));
    };
    return React.createElement("div", { className: "group" }, React.createElement(ControlLabel, { label, tooltip: labelTooltip, disabled }), React.createElement(ControlDescription, { text: description }), React.createElement("div", { className: `relative flex items-center h-[26px] ${disabled ? "opacity-50 cursor-not-allowed" : ""}` }, React.createElement(
      "input",
      {
        ref: inputRef,
        type: "number",
        value: localValue,
        title: inputTooltip,
        disabled,
        onChange: handleChange,
        onFocus: () => setIsFocused(true),
        onBlur: handleBlur,
        onKeyDown: (e) => e.key === "Enter" && inputRef.current?.blur(),
        className: "w-full h-full bg-black/30 border border-white/10 rounded-l px-2 text-white focus:border-primary outline-none transition-all text-xs disabled:cursor-not-allowed disabled:text-gray-500"
      }
    ), React.createElement("div", { className: "relative group/select h-full" }, React.createElement(
      "select",
      {
        value: unit,
        disabled,
        onChange: (e) => handleUnitSwitch(e.target.value),
        className: "appearance-none h-full bg-black/30 border-y border-r border-white/10 rounded-r px-2 pl-1 text-[10px] text-white hover:text-white focus:border-primary outline-none cursor-pointer w-10 text-center disabled:cursor-not-allowed disabled:text-gray-500"
      },
React.createElement("option", { value: "%", className: "bg-surface" }, "%"),
React.createElement("option", { value: "px", className: "bg-surface" }, "px")
    ), React.createElement(ChevronDown, { size: 10, className: "absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" }))));
  };
  const ColorPicker = ({ value, onChange, label, description, labelTooltip, inputTooltip, disabled }) => {
    let propHex = "#000000";
    let propAlpha = 100;
    if (value) {
      if (value.length === 9) {
        propHex = value.substring(0, 7);
        const aVal = parseInt(value.substring(7), 16);
        if (!isNaN(aVal)) {
          propAlpha = Math.round(aVal / 255 * 100);
        }
      } else if (value.length === 7) {
        propHex = value;
      }
    }
    const [localHex, setLocalHex] = React.useState(propHex);
    const [localAlpha, setLocalAlpha] = React.useState(String(propAlpha));
    const [isHexFocused, setIsHexFocused] = React.useState(false);
    const [isAlphaFocused, setIsAlphaFocused] = React.useState(false);
    React.useEffect(() => {
      if (!isHexFocused) {
        setLocalHex(propHex);
      }
    }, [propHex, isHexFocused]);
    React.useEffect(() => {
      if (!isAlphaFocused) {
        setLocalAlpha(String(propAlpha));
      }
    }, [propAlpha, isAlphaFocused]);
    const updateParent = (h, a) => {
      const aHex = Math.round(Math.max(0, Math.min(100, a)) / 100 * 255).toString(16).padStart(2, "0");
      if (/^#[0-9A-F]{6}$/i.test(h)) {
        onChange(`${h}${aHex}`);
      }
    };
    const handleHexInputChange = (e) => {
      const val = e.target.value;
      setLocalHex(val);
      if (/^#[0-9A-F]{6}$/i.test(val)) {
        updateParent(val, Number(localAlpha) || propAlpha);
      } else if (/^[0-9A-F]{6}$/i.test(val)) {
        updateParent(`#${val}`, Number(localAlpha) || propAlpha);
      }
    };
    const handleHexBlur = () => {
      setIsHexFocused(false);
      let finalHex = localHex;
      if (/^[0-9A-F]{6}$/i.test(finalHex)) {
        finalHex = `#${finalHex}`;
      }
      if (/^#[0-9A-F]{6}$/i.test(finalHex)) {
        setLocalHex(finalHex.toUpperCase());
        updateParent(finalHex, Number(localAlpha) || propAlpha);
      } else {
        setLocalHex(propHex);
      }
    };
    const handleAlphaInputChange = (e) => {
      const val = e.target.value;
      setLocalAlpha(val);
      if (val !== "" && val !== "-") {
        const num = parseFloat(val);
        if (!isNaN(num)) {
          updateParent(localHex.length === 7 ? localHex : propHex, num);
        }
      }
    };
    const handleAlphaBlur = () => {
      setIsAlphaFocused(false);
      let num = parseFloat(localAlpha);
      if (isNaN(num) || localAlpha === "") {
        num = propAlpha;
      }
      num = Math.max(0, Math.min(100, num));
      setLocalAlpha(String(num));
      updateParent(localHex.length === 7 ? localHex : propHex, num);
    };
    const handleNativeColorChange = (e) => {
      const val = e.target.value;
      setLocalHex(val.toUpperCase());
      updateParent(val, Number(localAlpha) || propAlpha);
    };
    const handleAlphaWheelChange = (newVal) => {
      setLocalAlpha(String(newVal));
      updateParent(localHex.length === 7 ? localHex : propHex, newVal);
    };
    const alphaInputRef = useWheelInput(propAlpha, handleAlphaWheelChange, 1, 0, 100);
    return React.createElement("div", { className: disabled ? "opacity-50 pointer-events-none" : "" }, React.createElement(ControlLabel, { label, tooltip: labelTooltip, disabled }), React.createElement(ControlDescription, { text: description }), React.createElement("div", { className: "flex gap-2", title: inputTooltip }, React.createElement("div", { className: "flex-1 flex items-center gap-2 bg-black/30 border border-white/10 rounded px-2 py-1" }, React.createElement(
      "input",
      {
        type: "color",
        value: propHex,
        disabled,
        onChange: handleNativeColorChange,
        className: "w-6 h-6 rounded cursor-pointer bg-transparent border-none p-0 disabled:cursor-not-allowed"
      }
    ), React.createElement(
      "input",
      {
        type: "text",
        value: localHex,
        disabled,
        onChange: handleHexInputChange,
        onFocus: () => setIsHexFocused(true),
        onBlur: handleHexBlur,
        className: "w-full bg-transparent text-xs text-gray-300 font-mono outline-none uppercase disabled:text-gray-600"
      }
    )), React.createElement("div", { className: "w-1/3.2 flex items-center bg-black/30 border border-white/10 rounded px-2", title: "透明度" }, React.createElement("span", { className: "text-[9px] text-gray-500 mr-1" }, "A"), React.createElement(
      "input",
      {
        ref: alphaInputRef,
        type: "number",
        min: "0",
        max: "100",
        value: localAlpha,
        disabled,
        onChange: handleAlphaInputChange,
        onFocus: () => setIsAlphaFocused(true),
        onBlur: handleAlphaBlur,
        onKeyDown: (e) => e.key === "Enter" && e.currentTarget.blur(),
        className: "w-full bg-transparent text-xs text-center outline-none disabled:text-gray-600 appearance-none m-0"
      }
    ), React.createElement("span", { className: "text-[9px] text-gray-500 ml-0.5" }, "%"))));
  };
  const SliderInput = ({ value, onChange, min, max, step, label, description, labelTooltip, inputTooltip, disabled }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editValue, setEditValue] = React.useState("");
    const handleWheelChange = (newVal) => {
      onChange(newVal);
      setEditValue(String(newVal));
    };
    const inputRef = useWheelInput(value, handleWheelChange, step, min, max);
    React.useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [isEditing]);
    const handleStartEdit = (e) => {
      if (disabled) return;
      e.stopPropagation();
      setEditValue(String(value));
      setIsEditing(true);
    };
    const handleCommit = () => {
      setIsEditing(false);
      const valStr = editValue.trim();
      if (valStr === "" || valStr === "-") return;
      let num = parseFloat(valStr);
      if (isNaN(num)) return;
      num = Math.max(min, Math.min(max, num));
      onChange(num);
    };
    const handleKeyDown = (e) => {
      if (e.key === "Enter") handleCommit();
      if (e.key === "Escape") setIsEditing(false);
    };
    return React.createElement("div", { className: disabled ? "opacity-50" : "" }, label && React.createElement("div", { className: "flex justify-between mb-1 items-center h-4" }, React.createElement(ControlLabel, { label, tooltip: labelTooltip, disabled }), isEditing ? React.createElement(
      "input",
      {
        ref: inputRef,
        type: "number",
        value: editValue,
        step,
        onChange: (e) => setEditValue(e.target.value),
        onBlur: handleCommit,
        onKeyDown: handleKeyDown,
        className: "w-16 h-5 text-[10px] bg-black/50 border border-primary/50 rounded px-1 text-center outline-none text-white font-mono focus:border-primary"
      }
    ) : React.createElement(
      "span",
      {
        onClick: handleStartEdit,
        className: `text-[10px] tabular-nums px-1 rounded -mr-1 transition-colors ${disabled ? "text-gray-500" : "text-primary cursor-pointer hover:bg-white/10 hover:text-white"}`,
        title: "点击手动输入数值"
      },
      value
    )), React.createElement(ControlDescription, { text: description }), React.createElement(
      "input",
      {
        type: "range",
        min,
        max,
        step,
        value,
        disabled,
        title: inputTooltip,
        onChange: (e) => onChange(parseFloat(e.target.value)),
        className: `w-full h-1 mt-0.5 mb-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer ${disabled ? "cursor-not-allowed accent-gray-600" : "accent-primary"}`
      }
    ));
  };
  const TagSelect = ({ value, onChange, options, label, description, columnCount = 3, labelTooltip, inputTooltip, disabled, multi = false }) => {
    const currentValues = multi ? Array.isArray(value) ? value : value !== void 0 && value !== null ? [value] : [] : [value];
    const isSelected = (optVal) => {
      return currentValues.some((v) => String(v) === String(optVal));
    };
    const selectedOption = !multi ? options.find((opt) => String(opt.value) === String(value)) : null;
    const handleClick = (optVal) => {
      if (multi) {
        let newValues = [...currentValues];
        if (isSelected(optVal)) {
          newValues = newValues.filter((v) => String(v) !== String(optVal));
        } else {
          newValues.push(optVal);
        }
        onChange(newValues);
      } else {
        onChange(optVal);
      }
    };
    return React.createElement("div", { className: disabled ? "opacity-50 pointer-events-none" : "" }, React.createElement(ControlLabel, { label, tooltip: labelTooltip, disabled }), React.createElement(ControlDescription, { text: description }), React.createElement(
      "div",
      {
        className: `grid gap-2 ${selectedOption?.description ? "mb-1" : ""}`,
        style: { gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` },
        title: inputTooltip
      },
      options.map((opt) => {
        const active = isSelected(opt.value);
        return React.createElement(
          "button",
          {
            key: opt.value,
            disabled,
            onClick: () => handleClick(opt.value),
            className: `
                                flex items-center justify-center text-center px-1 py-1 rounded border text-[10px] transition-all
                                ${active ? "bg-primary/20 border-primary text-primary font-bold shadow-sm shadow-primary/10" : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-white"}
                                ${disabled ? "cursor-not-allowed" : ""}
                            `
          },
          opt.label
        );
      })
    ), selectedOption?.description && React.createElement(ControlDescription, { text: selectedOption.description }));
  };
  const ImageUpload = ({ value, label, description, tooltip, inputTooltip, disabled, onChange, onPersistenceChange }) => {
    return React.createElement("div", { className: disabled ? "opacity-50 pointer-events-none" : "" }, React.createElement(ControlLabel, { label, tooltip, disabled }), React.createElement(ControlDescription, { text: description }), React.createElement("div", { className: "flex gap-2" }, React.createElement(
      "input",
      {
        type: "text",
        placeholder: "https://...",
        value: value || "",
        title: inputTooltip,
        disabled,
        onChange: (e) => {
          const newVal = e.target.value;
          onChange(newVal);
          if (onPersistenceChange) {
            onPersistenceChange(void 0);
          }
        },
        className: "flex-1 bg-black/30 border border-white/10 rounded px-2 py-1.5 text-white text-xs focus:border-primary outline-none disabled:cursor-not-allowed disabled:text-gray-500"
      }
    ), React.createElement("label", { className: `flex items-center justify-center px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded cursor-pointer transition-colors ${disabled ? "cursor-not-allowed opacity-50" : ""}`, title: "上传本地图片" }, React.createElement(Upload, { size: 14, className: "text-gray-400 hover:text-white" }), React.createElement(
      "input",
      {
        type: "file",
        accept: "image/*",
        disabled,
        className: "hidden",
        onChange: (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const blobUrl = URL.createObjectURL(file);
            onChange(blobUrl);
            if (onPersistenceChange) {
              blobToBase64(file).then((base64) => {
                onPersistenceChange(base64);
              });
            }
          }
        }
      }
    ))));
  };
  const TextInput = ({ value, control, disabled, defaultTip, onUpdate }) => {
    const isTimeMode = control.format === "time";
    const valueUnit = control.valueUnit || "second";
    const formatValue = (val) => {
      if (!isTimeMode) return val || "";
      return SettingsUtils.convert(val, "time", { fromType: valueUnit });
    };
    const parseValue = (str) => {
      if (!isTimeMode) return str;
      return SettingsUtils.convert(str, valueUnit);
    };
    const [localValue, setLocalValue] = React.useState(formatValue(value));
    const [isFocused, setIsFocused] = React.useState(false);
    React.useEffect(() => {
      if (!isFocused) {
        setLocalValue(formatValue(value));
      }
    }, [value, isFocused, control.format, control.valueUnit]);
    const handleChange = (e) => {
      const raw = e.target.value;
      if (isTimeMode) {
        if (/^[\d:]*$/.test(raw)) {
          setLocalValue(raw);
        }
      } else {
        setLocalValue(raw);
        onUpdate(raw);
      }
    };
    const handleBlur = () => {
      setIsFocused(false);
      if (isTimeMode) {
        let parsedNum = parseValue(localValue);
        if (typeof parsedNum === "number" && isNaN(parsedNum)) {
          parsedNum = 0;
        }
        if (control.min !== void 0 && typeof parsedNum === "number") parsedNum = Math.max(control.min, parsedNum);
        if (control.max !== void 0 && typeof parsedNum === "number") parsedNum = Math.min(control.max, parsedNum);
        onUpdate(parsedNum);
        setLocalValue(formatValue(parsedNum));
      }
    };
    return React.createElement("div", { className: disabled ? "opacity-50" : "" }, React.createElement(ControlLabel, { label: control.label, tooltip: control.tooltip, disabled }), React.createElement(ControlDescription, { text: control.description }), React.createElement(
      "input",
      {
        type: "text",
        value: localValue,
        title: defaultTip,
        disabled,
        placeholder: control.placeholder,
        onFocus: () => setIsFocused(true),
        onBlur: handleBlur,
        onChange: handleChange,
        onKeyDown: (e) => e.key === "Enter" && e.currentTarget.blur(),
        className: "w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-white text-xs focus:border-primary outline-none disabled:cursor-not-allowed disabled:text-gray-500 font-mono"
      }
    ));
  };
  const formatDefaultValueTip = (val) => {
    if (val === void 0 || val === null || val === "") return void 0;
    return `默认值: ${val}`;
  };
  const DynamicControl = ({ control, component, context, onUpdate, disabled: externalDisabled }) => {
    const value = component[control.key];
    const isSelfDisabled = control.disabled ? typeof control.disabled === "function" ? control.disabled(component) : control.disabled : false;
    const isDisabled = externalDisabled || isSelfDisabled;
    const defaultVal = control.defaultValue;
    let defaultTip = formatDefaultValueTip(defaultVal);
    if ((control.type === "select" || control.type === "tag-select") && control.options) {
      const option = control.options.find((opt) => opt.value === defaultVal);
      if (option) {
        defaultTip = formatDefaultValueTip(option.label);
      }
    }
    if (control.hidden && control.hidden(component, context)) {
      return null;
    }
    const handleUpdate = (newValue) => {
      if (isDisabled) return;
      if (control.validate) {
        if (!control.validate(newValue, component, context)) {
          return;
        }
      }
      let processedValue = newValue;
      if (control.setter) {
        processedValue = control.setter(newValue, component, context);
      }
      let updates = { [control.key]: processedValue };
      if (control.onValueChange) {
        const sideEffects = control.onValueChange(processedValue, component, context);
        if (sideEffects) {
          updates = { ...updates, ...sideEffects };
        }
      }
      onUpdate(updates);
    };
    switch (control.type) {
      case "ui-divider":
        return React.createElement(Divider, { style: control.style });
      case "ui-info-text":
        const textContent = value !== void 0 ? String(value) : control.defaultValue || "";
        return React.createElement(InfoText, { text: textContent, style: control.style, hyperlink: control.hyperlink, url: control.url });
      case "ui-plain-div":
        const plainContent = value !== void 0 ? String(value) : control.defaultValue || "";
        return React.createElement("div", { style: control.style }, plainContent);
      case "ui-computed-info":
        const displayValue = control.getter ? control.getter(component, context) : "";
        if (!displayValue) return null;
        return React.createElement("div", { className: isDisabled ? "opacity-50" : "" }, React.createElement(ControlLabel, { label: control.label, tooltip: control.tooltip, disabled: isDisabled }), React.createElement(ControlDescription, { text: control.description }), React.createElement("div", { className: "text-xs text-gray-300 font-mono", style: control.style }, displayValue));
      case "text":
        return React.createElement(
          TextInput,
          {
            value,
            control,
            disabled: isDisabled,
            defaultTip,
            onUpdate: handleUpdate
          }
        );
      case "number":
        return React.createElement(
          NumberInput,
          {
            label: control.label,
            description: control.description,
            value,
            onChange: (v) => handleUpdate(v),
            min: control.min,
            max: control.max,
            step: control.step,
            labelTooltip: control.tooltip,
            inputTooltip: defaultTip,
            disabled: isDisabled
          }
        );
      case "slider":
        return React.createElement(
          SliderInput,
          {
            label: control.label,
            description: control.description,
            value,
            onChange: (v) => handleUpdate(v),
            min: control.min || 0,
            max: control.max || 100,
            step: control.step || 1,
            labelTooltip: control.tooltip,
            inputTooltip: defaultTip,
            disabled: isDisabled
          }
        );
      case "unit":
        if (!control.unitKey || !control.propType) return null;
        return React.createElement(
          UnitInput,
          {
            label: control.label,
            description: control.description,
            value,
            unit: component[control.unitKey],
            onChange: (v) => handleUpdate(v),
            onUnitChange: (u) => {
              if (isDisabled) return;
              if (control.unitValidate && !control.unitValidate(u, component, context)) return;
              let finalUnit = u;
              if (control.unitSetter) {
                finalUnit = control.unitSetter(u, component, context);
              }
              if (control.onUnitChange) {
                const updates = control.onUnitChange(finalUnit, value, component, context);
                onUpdate(updates);
              } else {
                const currentUnit = component[control.unitKey];
                let newVal = value;
                if (currentUnit !== finalUnit) {
                  newVal = SettingsUtils.contrlUnitChange(value, finalUnit, control.propType, component, context);
                }
                onUpdate({ [control.unitKey]: finalUnit, [control.key]: newVal });
              }
            },
            min: control.min,
            max: control.max,
            labelTooltip: control.tooltip,
            inputTooltip: defaultTip,
            disabled: isDisabled
          }
        );
      case "color":
        return React.createElement(
          ColorPicker,
          {
            label: control.label,
            description: control.description,
            value,
            onChange: (v) => handleUpdate(v),
            labelTooltip: control.tooltip,
            inputTooltip: defaultTip,
            disabled: isDisabled
          }
        );
      case "boolean":
        return React.createElement("div", { className: `pt-1 pb-1 ${isDisabled ? "opacity-50" : ""}` }, React.createElement(
          "label",
          {
            className: `flex items-center gap-2 text-gray-300 text-xs mb-1 select-none ${isDisabled ? "cursor-not-allowed" : control.tooltip ? "cursor-help" : "cursor-pointer"}`,
            title: control.tooltip || defaultTip
          },
React.createElement(
            "input",
            {
              type: "checkbox",
              checked: value,
              disabled: isDisabled,
              title: defaultTip,
              onChange: (e) => handleUpdate(e.target.checked),
              className: "rounded border-gray-600 text-primary focus:ring-0 bg-black/30 w-4 h-4 disabled:cursor-not-allowed"
            }
          ),
          control.label
        ), React.createElement(ControlDescription, { text: control.description, mb: false }));
      case "select":
        const visibleOptions = control.options?.filter((opt) => !opt.hidden || !opt.hidden(component, context)) || [];
        const isMulti = control.multi;
        const currentSelectValue = isMulti ? Array.isArray(value) ? value.map(String) : [] : value;
        const selectedOption = !isMulti ? visibleOptions.find((opt) => String(opt.value) === String(value)) : null;
        return React.createElement("div", { className: isDisabled ? "opacity-50 pointer-events-none" : "" }, React.createElement(ControlLabel, { label: control.label, tooltip: control.tooltip, disabled: isDisabled }), React.createElement(ControlDescription, { text: control.description }), React.createElement("div", { className: `relative ${selectedOption?.description ? "mb-1" : ""}` }, React.createElement(
          "select",
          {
            value: currentSelectValue,
            title: defaultTip,
            disabled: isDisabled,
            multiple: isMulti,
            onChange: (e) => {
              if (isMulti) {
                const selectedStrings = Array.from(e.target.selectedOptions, (o) => o.value);
                const selectedValues = selectedStrings.map((s) => {
                  const opt = visibleOptions.find((o) => String(o.value) === s);
                  return opt ? opt.value : s;
                });
                handleUpdate(selectedValues);
              } else {
                handleUpdate(e.target.value);
              }
            },
            className: `w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-white text-xs focus:border-primary outline-none ${isMulti ? "h-24 custom-scrollbar" : "appearance-none"} disabled:cursor-not-allowed disabled:text-gray-500`
          },
          visibleOptions.map((opt) => React.createElement("option", { key: opt.value, value: opt.value }, opt.label))
        ), !isMulti && React.createElement(ChevronDown, { size: 12, className: "absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" })), selectedOption?.description && React.createElement(ControlDescription, { text: selectedOption.description }));
      case "tag-select":
        const visibleTagOptions = control.options?.filter((opt) => !opt.hidden || !opt.hidden(component, context)) || [];
        return React.createElement(
          TagSelect,
          {
            label: control.label,
            description: control.description,
            value,
            options: visibleTagOptions,
            columnCount: control.columnCount,
            onChange: (v) => handleUpdate(v),
            labelTooltip: control.tooltip,
            inputTooltip: defaultTip,
            disabled: isDisabled,
            multi: control.multi
          }
        );
      case "textarea":
        return React.createElement("div", { className: isDisabled ? "opacity-50" : "" }, React.createElement(ControlLabel, { label: control.label, tooltip: control.tooltip, disabled: isDisabled }), React.createElement(ControlDescription, { text: control.description }), React.createElement(
          "textarea",
          {
            rows: 3,
            value: value || "",
            title: defaultTip,
            disabled: isDisabled,
            onChange: (e) => handleUpdate(e.target.value),
            placeholder: control.placeholder ?? "",
            className: "w-full bg-black/30 border border-white/10 rounded px-2 py-1.5 text-white text-xs focus:border-primary outline-none resize-y disabled:cursor-not-allowed disabled:text-gray-500"
          }
        ));
      case "image-upload":
        return React.createElement(
          ImageUpload,
          {
            value,
            label: control.label,
            description: control.description,
            tooltip: control.tooltip,
            inputTooltip: defaultTip,
            disabled: isDisabled,
            onChange: handleUpdate,
            onPersistenceChange: control.persistenceKey ? (base64) => {
              onUpdate({ [control.persistenceKey]: base64 });
            } : void 0
          }
        );
      default:
        return null;
    }
  };
  const groupStateCache = new Map();
  function SettingsRendererImpl({
    data,
    onUpdate,
    settingsConfig,
    context,
    className = "",
    cacheKey
  }) {
    const [collapsedGroups, setCollapsedGroups] = React.useState(() => {
      if (cacheKey && groupStateCache.has(cacheKey)) {
        return groupStateCache.get(cacheKey);
      }
      return {};
    });
    const { groups: settingGroups, readonlyControls } = settingsConfig;
    const toggleGroup = (groupId, defaultState) => {
      setCollapsedGroups((prev) => {
        const currentState = prev[groupId] ?? defaultState;
        const nextState = {
          ...prev,
          [groupId]: !currentState
        };
        if (cacheKey) {
          groupStateCache.set(cacheKey, nextState);
        }
        return nextState;
      });
    };
    return React.createElement("div", { className: `space-y-2 ${className}` }, settingGroups.map((group) => {
      const isCollapsible = group.defaultCollapsed !== void 0;
      const isCollapsed = isCollapsible ? collapsedGroups[group.id] ?? group.defaultCollapsed : false;
      if (group.hidden && group.hidden(data, context)) {
        return null;
      }
      return React.createElement("div", { key: group.id, className: "space-y-2" }, React.createElement(
        "button",
        {
          onClick: () => isCollapsible && toggleGroup(group.id, group.defaultCollapsed),
          className: `w-full flex items-center justify-between text-left p-1 -ml-1 rounded transition-colors group/header ${isCollapsible ? "hover:bg-white/5 cursor-pointer" : "cursor-default"}`
        },
React.createElement("h4", { className: "text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-2", style: { color: group.color } }, React.createElement("span", { className: "w-1 h-3 rounded-full", style: { backgroundColor: group.color || "#3b82f6" } }), group.title),
        isCollapsible && React.createElement("div", { className: "text-gray-500 group-hover/header:text-white transition-colors" }, isCollapsed ? React.createElement(ChevronRight, { size: 14 }) : React.createElement(ChevronDown, { size: 14 }))
      ), !isCollapsed && React.createElement("div", { className: "grid grid-cols-2 gap-3 pt-1 animate-in slide-in-from-top-2 duration-200" }, group.controls.map((control) => {
        if (control.hidden && control.hidden(data, context)) {
          return null;
        }
        const isFullWidth = control.fullWidth ?? ["textarea", "image-upload", "slider", "color", "tag-select", "ui-divider", "ui-info-text", "ui-plain-div", "ui-computed-info"].includes(control.type);
        const isReadOnly = readonlyControls?.includes(control.key);
        return React.createElement("div", { key: control.key, className: isFullWidth ? "col-span-2" : "col-span-1" }, React.createElement(
          DynamicControl,
          {
            control,
            component: data,
            context,
            onUpdate,
            disabled: isReadOnly
          }
        ));
      })), React.createElement("div", { className: "w-full h-px bg-white/5 mt-2" }));
    }));
  }
  function SettingsRenderer(props) {
    const uniqueKey = props.data?.id;
    return React.createElement(SettingsRendererImpl, { key: uniqueKey, cacheKey: uniqueKey, ...props });
  }
  const VERSION = "v1.0.0";
  function SettingsModal({
    isOpen,
    onClose,
    title,
    icon: Icon2,
    data,
    onUpdate,
    settingsConfig,
    context,
    confirmText = "确认",
    cancelText = "取消",
    onConfirm,
    isConfirmDisabled = false,
    modalSize,
    children
  }) {
    const { containerClasses, containerStyle } = React.useMemo(() => {
      const baseClasses = "bg-surface border border-white/10 rounded-lg shadow-2xl m-4 animate-in zoom-in-95 duration-200 flex flex-col";
      if (!modalSize) {
        const defaultSizeClasses = "w-[90vw] md:w-[35vh] md:min-w-[440px] max-w-[90vh] h-[540px] max-h-[75vh]";
        return {
          containerClasses: `${defaultSizeClasses} ${baseClasses}`,
          containerStyle: {}
        };
      }
      const { width, height, minWidth, maxWidth, minHeight, maxHeight } = modalSize;
      const style = {};
      if (width) style.width = width;
      if (height) style.height = height;
      if (minWidth) style.minWidth = minWidth;
      if (maxWidth) style.maxWidth = maxWidth;
      if (minHeight) style.minHeight = minHeight;
      if (maxHeight) style.maxHeight = maxHeight;
      const safeGuardClasses = "max-w-[90vw] max-h-[90vh]";
      return {
        containerClasses: `${safeGuardClasses} ${baseClasses}`,
        containerStyle: style
      };
    }, [modalSize]);
    if (!isOpen) return null;
    return React.createElement("div", { className: `${VERSION} fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200` }, React.createElement(
      "div",
      {
        className: containerClasses,
        style: containerStyle,
        onClick: (e) => e.stopPropagation()
      },
React.createElement("div", { className: "flex justify-between items-center p-3 border-b border-white/10 flex-shrink-0" }, React.createElement("h2", { className: "text-lg font-bold flex items-center gap-2" }, Icon2 && React.createElement(Icon2, { size: 18 }), title), React.createElement("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors" }, React.createElement(X, { size: 18 }))),
React.createElement("div", { className: "flex-1 overflow-y-auto custom-scrollbar p-3 pt-2 space-y-2" }, children, React.createElement(
        SettingsRenderer,
        {
          data,
          onUpdate,
          settingsConfig,
          context
        }
      )),
React.createElement("div", { className: "p-3 border-t border-white/10 flex gap-3 flex-shrink-0 bg-surface" }, React.createElement(
        "button",
        {
          onClick: onClose,
          className: "flex-1 py-2 rounded text-sm hover:bg-white/10 text-gray-300 transition-colors border border-transparent hover:border-white/5"
        },
        cancelText
      ), React.createElement(
        "button",
        {
          onClick: onConfirm,
          disabled: isConfirmDisabled,
          className: `flex-1 py-2 rounded text-sm font-bold shadow-lg transition-all ${isConfirmDisabled ? "bg-white/5 text-gray-500 cursor-not-allowed" : "bg-primary hover:bg-blue-600 text-white"}`
        },
        confirmText
      ))
    ));
  }
  const SELECTORS = {

home_video_grid: ".container.is-version8",
video_card: ".feed-card, .bili-feed-card",

video_title: "h3.bili-video-card__info--tit",
video_author: ".bili-video-card__info--author, .bili-video-card__info--owner",
video_duration: ".bili-video-card__stats__duration",
    full_video_card: ".container.is-version8 > .feed-card, .container.is-version8 > .bili-feed-card",
ad_report: ".ad-report"
  };
  const LINKS = {
    script_homepage: "https://greasyfork.org/zh-CN/users/1196880-ling2ling4#user-script-list"
  };
  const DEFAULT_AD_RULES = {
    common: [




{
        id: "live-room-inject",
        name: "直播间相关广告注入",
        selector: ".web-player-inject-wrap"
      }
    ],
    homepage: [
      {
        id: "home-video-ad",
        name: "广告视频",
        selector: SELECTORS.full_video_card,
        contentCheck: { selector: ".bili-video-card__info--ad", mode: "child-exists" }
      },
      {
        id: "home-video-creative-ad",
        name: "推广视频",
        selector: SELECTORS.full_video_card,
        contentCheck: { selector: ".bili-video-card__info--creative-ad, .bili-video-card__mask .vui_icon", mode: "child-exists" }
      },





{
        id: "home-feed-content-ad",
        name: '推荐流内容检测("广告")',
        selector: SELECTORS.full_video_card,
        contentCheck: { value: "广告", selector: ".bili-video-card__mask", mode: "child-exists-includes" }
      },
      {
        id: "home-rb-ad",
        name: "右下卡片和按钮广告",
        selector: ".palette-button-wrap .adcard-content, .adcard"
      }
    ],
    video: [
      {
        id: "video-ad-report",
        name: "大部分广告",
selector: `#app ${SELECTORS.ad_report}`
      },




{
        id: "video-reply-top",
        name: "评论区置顶广告",
        selector: "#app .ad-period"
      },
      {
        id: "video-reply-top",
        name: "评论区上方活动推广",
        selector: "#app .activity-m-v1"
      },
      {
        id: "video-reply-notice",
        name: "评论区横幅通报",
        selector: "#app .bili-comments-header-renderer.reply-notice"
      },









{
        id: "video-slide-ad",
        name: "右侧列表底部直播推荐",
        selector: "#app .pop-live-small-mode"
      }
    ]
  };
  const formatRulesDescription = () => {
    const categories = {
      common: "全局通用",
      homepage: "首页",
      video: "视频详情页"
    };
    return Object.keys(DEFAULT_AD_RULES).map((key) => {
      const rules = DEFAULT_AD_RULES[key];
      const title = categories[key];
      return `【${title}】
${rules.map((r) => `  • ${r.name}`).join("\n")}`;
    }).join("\n\n");
  };
  const DEFAULT_SETTINGS = {
    hideCarousel: true,
    removeAds: false,
    enableVideoGrid: false,
    videosPerRow: 5,
    enableCustomFilters: false,
    customFilterRules: "",
    fillEmptySpace: true
  };
  const FILTER_HELP_TEXT = `每行一条规则（满足任意一条即过滤）。
支持逻辑运算符：&& (与), || (或)。

语法说明：
• t:关键词     -> 标题包含关键词
• t=关键词     -> 标题等于关键词
• a:关键词     -> 作者包含关键词
• d:min-max   -> 时长在范围内 (屏蔽)
  格式支持: 0-60 (0到60秒), 1:00-5:30 (1分到5分半)

示例：
t:震惊 && a:营销号    (屏蔽标题含"震惊"且作者含"营销号")
d:0-60              (屏蔽时长在 0 到 60 秒之间的视频/短视频)
d:1:00:00-9:00:00   (屏蔽时长超过1小时的视频)
t:广告 || d:0-30      (屏蔽含"广告"或时长小于30秒的视频)`;
  const SETTINGS_CONFIG = {
    groups: [
      {
        id: "layout",
        title: "布局调整",
        color: "#fb7299",
defaultCollapsed: false,
        controls: [
          {
            key: "hideCarousel",
            label: "隐藏首页轮播图",
            type: "boolean",
            defaultValue: true,
            fullWidth: true,
            description: "开启后将隐藏首页顶部的推荐轮播图区域，让界面更清爽。"
          },
          {
            key: "enableVideoGrid",
            label: "调整首页视频密度",
            type: "boolean",
            defaultValue: true,
            fullWidth: true,
            description: "开启后，将重新排列首页视频网格，可自定义每行显示的视频数量。"
          },
          {
            key: "videosPerRow",
            label: "每行视频数量",
            type: "slider",
            min: 2,
            max: 10,
            step: 1,
            defaultValue: 6,
            description: "设置首页每行显示的视频卡片数量（2-10个）。需开启“调整首页视频密度”才能生效。",
            hidden: (data) => !data.enableVideoGrid
          },
          {
            key: "fillEmptySpace",
            label: "加载视频以填补空白",
            type: "boolean",
            defaultValue: true,
            fullWidth: true,
            description: "调整网格后，自动请求额外视频以填满第一屏空缺(仅在页面加载时执行一次)。",
            hidden: (data) => !data.enableVideoGrid
          }
        ]
      },
      {
        id: "ad-block",
        title: "广告过滤",
        color: "#00aeec",
defaultCollapsed: false,
        controls: [
          {
            key: "removeAds",
            label: "启用智能去广告",
            type: "boolean",
            defaultValue: true,
            fullWidth: true,
            description: "根据当前访问的页面（首页/视频页）智能匹配并移除对应的广告元素。"
          },
          {
            key: "ad_rule_list_info",
            label: "内置规则概览",
            type: "ui-info-text",
            defaultValue: formatRulesDescription(),
            style: { opacity: 0.7, fontSize: "10px", whiteSpace: "pre-wrap", fontFamily: "monospace" },
            hidden: () => true
}
        ]
      },
      {
        id: "custom-filter",
        title: "自定义视频过滤",
        color: "#f59e0b",
defaultCollapsed: true,
        controls: [
          {
            key: "enableCustomFilters",
            label: "启用自定义过滤",
            type: "boolean",
            defaultValue: false,
            description: "开启后，下方的自定义规则才会生效。"
          },
          {
            key: "customFilterRules",
            label: "过滤规则",
            type: "textarea",
            defaultValue: "",
            placeholder: "例如: d:0-60 (屏蔽短视频)",
            description: "编写自定义规则来屏蔽特定的视频内容。",
            hidden: (data) => !data.enableCustomFilters
          },
          {
            key: "help_text",
            label: "语法帮助",
            type: "ui-info-text",
            defaultValue: FILTER_HELP_TEXT,
            style: { opacity: 0.8, fontSize: "11px", whiteSpace: "pre-wrap", fontFamily: "monospace", lineHeight: "1.4" },
            hidden: (data) => !data.enableCustomFilters
          }
        ]
      }
    ]
  };
  const STORAGE_KEY = "bilibili_ad_remover_settings";
  const parseTimeToSeconds = (timeStr) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(":").map(Number);
    let seconds = 0;
    if (parts.length === 3) {
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      seconds = parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
      seconds = parts[0];
    }
    return isNaN(seconds) ? 0 : seconds;
  };
  const parseCondition = (str) => {
    const cleanStr = str.trim();
    if (!cleanStr) return null;
    const match = cleanStr.match(/^([tda]|title|author|duration)\s*(:|:|＝|=)\s*(.*)/i);
    if (!match) return null;
    const key = match[1].toLowerCase();
    const operator = match[2];
    const rawValue = match[3].trim();
    let target = "title";
    let op = operator === "=" || operator === "＝" ? "equals" : "includes";
    let value = rawValue;
    if (key === "a" || key === "author") {
      target = "author";
    } else if (key === "d" || key === "duration") {
      target = "duration";
      op = "range";
      const rangeMatch = rawValue.match(/^([0-9:]+)\s*-\s*([0-9:]+)$/);
      if (rangeMatch) {
        const min = parseTimeToSeconds(rangeMatch[1]);
        const max = parseTimeToSeconds(rangeMatch[2]);
        value = [min, max];
      } else {
        return null;
      }
    }
    return { target, op, value };
  };
  const parseCustomRules = (ruleText) => {
    if (!ruleText) return [];
    const lines = ruleText.split(/[\n;]+/).map((s) => s.trim()).filter(Boolean);
    return lines.map((line) => {
      return {
        raw: line,
        check: (title, author, durationSec) => {
          const tVal = title.trim();
          const aVal = author.trim();
          const orParts = line.split("||");
          return orParts.some((orPart) => {
            const andParts = orPart.split("&&");
            return andParts.every((conditionStr) => {
              const cond = parseCondition(conditionStr);
              if (!cond) return false;
              if (cond.target === "duration") {
                const [min, max] = cond.value;
                return durationSec >= min && durationSec <= max;
              }
              const targetText = cond.target === "title" ? tVal : aVal;
              if (cond.op === "equals") {
                return targetText === cond.value;
              } else {
                return targetText.includes(cond.value);
              }
            });
          });
        }
      };
    });
  };
  const checkVideoAgainstRules = (card, rules) => {
    if (rules.length === 0) return false;
    const titleEl = card.querySelector(SELECTORS.video_title);
    const authorEl = card.querySelector(SELECTORS.video_author);
    const durationEl = card.querySelector(SELECTORS.video_duration);
    const title = titleEl ? titleEl.innerText || titleEl.getAttribute("title") || "" : "";
    const author = authorEl ? authorEl.innerText || "" : "";
    const durationStr = durationEl ? durationEl.innerText || "" : "";
    const durationSec = parseTimeToSeconds(durationStr);
    for (const rule of rules) {
      if (rule.check(title, author, durationSec)) {
        return true;
      }
    }
    return false;
  };
  const WbiUtils = {
    mixinKeyEncTab: [
      46,
      47,
      18,
      2,
      53,
      8,
      23,
      32,
      15,
      50,
      10,
      31,
      58,
      3,
      45,
      35,
      27,
      43,
      5,
      49,
      33,
      9,
      42,
      19,
      29,
      28,
      14,
      39,
      12,
      38,
      41,
      13,
      37,
      48,
      7,
      16,
      24,
      55,
      40,
      61,
      26,
      17,
      0,
      1,
      60,
      51,
      30,
      4,
      22,
      25,
      54,
      21,
      56,
      59,
      6,
      63,
      57,
      62,
      11,
      36,
      20,
      34,
      44,
      52
    ],
getMixinKey(orig) {
      let temp = "";
      this.mixinKeyEncTab.forEach((n) => {
        if (n < orig.length) {
          temp += orig[n];
        }
      });
      return temp.slice(0, 32);
    },

async getWbiKeys() {
      const CACHE_KEY = "tm_bili_wbi_keys";
      const cache = localStorage.getItem(CACHE_KEY);
      if (cache) {
        try {
          const { img_key: img_key2, sub_key: sub_key2, ts } = JSON.parse(cache);
          if (Date.now() - ts < 24 * 3600 * 1e3) {
            return { img_key: img_key2, sub_key: sub_key2 };
          }
        } catch (e) {
          localStorage.removeItem(CACHE_KEY);
        }
      }
      const resp = await fetch("https://api.bilibili.com/x/web-interface/nav");
      const json = await resp.json();
      const { img_url, sub_url } = json.data.wbi_img;
      const img_key = img_url.substring(img_url.lastIndexOf("/") + 1, img_url.lastIndexOf("."));
      const sub_key = sub_url.substring(sub_url.lastIndexOf("/") + 1, sub_url.lastIndexOf("."));
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        img_key,
        sub_key,
        ts: Date.now()
      }));
      return { img_key, sub_key };
    },
async encWbi(params) {
      const { img_key, sub_key } = await this.getWbiKeys();
      const mixin_key = this.getMixinKey(img_key + sub_key);
      const curr_time = Math.round(Date.now() / 1e3);
      const newParams = { ...params, wts: curr_time };
      const sortedKeys = Object.keys(newParams).sort();
      const queryParts = [];
      sortedKeys.forEach((key) => {
        const value = newParams[key];
        const cleanVal = encodeURIComponent(value).replace(/[!'()*]/g, "");
        queryParts.push(`${encodeURIComponent(key)}=${cleanVal}`);
      });
      const queryString = queryParts.join("&");
      const w_rid = SparkMD5.hash(queryString + mixin_key);
      return `${queryString}&w_rid=${w_rid}`;
    }
  };
  const STORAGE_KEY_IDX = "tm_bili_feed_idx";
  function getNextRefreshIndex() {
    let idx = 1;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_IDX);
      if (saved) {
        idx = parseInt(saved, 10);
        if (isNaN(idx)) idx = 1;
      }
    } catch (e) {
    }
    idx += 1;
    localStorage.setItem(STORAGE_KEY_IDX, idx.toString());
    return idx;
  }
  async function fetchRecommendVideos(options = {}) {
    const currentIdx = getNextRefreshIndex();
    const baseParams = {
      web_location: 1430650,
      y_num: 5,
feed_version: "V8",
fresh_type: options.fresh_type || 3,
      ps: options.ps || 10,
fresh_idx: currentIdx,
fresh_idx_1h: currentIdx
};
    const queryStr = await WbiUtils.encWbi(baseParams);
    const url = `https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd?${queryStr}`;
    try {
      const response = await fetch(url);
      const result = await response.json();
      if (result.code !== 0) {
        console.error("Bilibili API Error:", result.message);
        return [];
      }
      const videos = result.data.item.filter((item) => item.goto === "av");
      return videos;
    } catch (error) {
      console.error("Fetch Failed:", error);
      return [];
    }
  }
  const getVideoCardHTML = (videoInfo) => {
    const { playCountText, danmaku, duration, videoTitle, videoId, videoCover, userId, userName, publishTime } = videoInfo;
    return `<div class="feed-card bili-ad-remover-filled-card" data-v-33e1fa42="">
    <div class="bili-feed-card" data-v-33e1fa42="">
      <div class="bili-video-card is-rcmd enable-no-interest" style="--cover-radio:56.25%;"><!----><!---->
        <div class="bili-video-card__wrap">
          <div class="bili-video-card__no-interest" style="display: none;">
            <div class="bili-video-card__no-interest--inner">
              <div class="bili-video-card__no-interest--left"><svg xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 36 36" width="36" height="36"
                  class="no-interest-icon" fill="currentColor">
                  <path
                    d="M3 18C3 9.715724999999999 9.715724999999999 3 18 3C26.284274999999997 3 33 9.715724999999999 33 18C33 26.284274999999997 26.284274999999997 33 18 33C9.715724999999999 33 3 26.284274999999997 3 18zM12.796710000000001 12.694004999999999C12.358049999999999 12.253995 11.645745 12.2529 11.205735 12.691575C10.765709999999999 13.130234999999999 10.764615 13.842555 11.20329 14.282565000000002L13.41144 16.494975L11.20329 18.7074C10.764615 19.147350000000003 10.765709999999999 19.8597 11.205735 20.298375C11.645745 20.73705 12.358049999999999 20.735925 12.796710000000001 20.295975L15.2682 17.81895C15.99795 17.087175000000002 15.99795 15.902775000000002 15.2682 15.17097L12.796710000000001 12.694004999999999zM24.794325 12.691575C24.354300000000002 12.2529 23.64195 12.253995 23.203274999999998 12.694004999999999L20.7318 15.17097C20.00205 15.902775000000002 20.00205 17.087175000000002 20.7318 17.81895L23.203274999999998 20.295975C23.64195 20.735925 24.354300000000002 20.73705 24.794325 20.298375C25.234274999999997 19.8597 25.2354 19.147350000000003 24.796725000000002 18.7074L22.588575 16.494975L24.796725000000002 14.282565000000002C25.2354 13.842555 25.234274999999997 13.130234999999999 24.794325 12.691575zM15.900974999999999 24.68535C16.843875 23.425575000000002 17.722649999999998 23.257199999999997 18 23.257199999999997C18.277350000000002 23.257199999999997 19.15605 23.425575000000002 20.099025 24.68535C20.471024999999997 25.182975 21.176025 25.284675 21.67365 24.912675C22.171274999999998 24.540599999999998 22.273049999999998 23.8356 21.900975 23.33805C20.5938 21.591 19.082024999999998 21.007199999999997 18 21.007199999999997C16.917900000000003 21.007199999999997 15.406125 21.591 14.09898 23.33805C13.72692 23.8356 13.82871 24.540599999999998 14.326305 24.912675C14.823929999999999 25.284675 15.5289 25.182975 15.900974999999999 24.68535z"
                    fill="currentColor"></path>
                </svg><span class="no-interest-title">不感兴趣</span><span class="no-interest-desc">将减少此类内容推荐</span></div>
              <div class="bili-video-card__no-interest--right">
                <div class="revert-btn"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 24 24" width="24" height="24" class="revert-icon" fill="currentColor">
                    <path
                      d="M8.28032 2.46967C8.57321 2.76257 8.57321 3.23744 8.28032 3.53033L4.81065 7L8.28032 10.46965C8.57321 10.76255 8.57321 11.23745 8.28032 11.53035C7.98743 11.8232 7.51254 11.8232 7.21966 11.53035L3.57321 7.88389C3.08505 7.39573 3.08505 6.60428 3.57321 6.11612L7.21966 2.46967C7.51254 2.17678 7.98743 2.17678 8.28032 2.46967z"
                      fill="currentColor"></path>
                    <path
                      d="M3.75 7C3.75 6.58579 4.08579 6.25 4.5 6.25L14.25 6.25C17.97795 6.25 21 9.27208 21 13C21 16.72795 17.97795 19.75 14.25 19.75L7.5 19.75C7.08579 19.75 6.75 19.4142 6.75 19C6.75 18.5858 7.08579 18.25 7.5 18.25L14.25 18.25C17.1495 18.25 19.5 15.8995 19.5 13C19.5 10.10052 17.1495 7.75 14.25 7.75L4.5 7.75C4.08579 7.75 3.75 7.41421 3.75 7z"
                      fill="currentColor"></path>
                  </svg> 撤销 </div>
              </div>
            </div>
          </div><a class="bili-video-card__image--link" href="https://www.bilibili.com/video/${videoId}" target="_blank"
            data-spmid="333.1007" data-mod="tianma.3-4-10" data-idx="click">
            <div class="bili-video-card__image">
              <div class="bili-video-card__image--wrap">
                <div class="bili-watch-later--wrap">
                  <div class="bili-watch-later bili-watch-later--pip" style="display: none;"><svg
                      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"
                      width="20" height="20" fill="currentColor" class="bili-watch-later__icon">
                      <path
                        d="M10 3.1248000000000005C6.20305 3.1248000000000005 3.1250083333333336 6.202841666666667 3.1250083333333336 9.999833333333335C3.1250083333333336 13.796750000000001 6.20305 16.874833333333335 10 16.874833333333335C11.898291666666667 16.874833333333335 13.615833333333333 16.106291666666667 14.860625 14.861916666666666C15.104708333333335 14.617916666666666 15.500416666666668 14.617958333333334 15.7445 14.862041666666668C15.9885 15.106166666666669 15.988416666666668 15.501916666666666 15.744333333333334 15.745958333333334C14.274750000000001 17.215041666666668 12.243041666666667 18.124833333333335 10 18.124833333333335C5.512691666666667 18.124833333333335 1.8750083333333334 14.487125 1.8750083333333334 9.999833333333335C1.8750083333333334 5.512483333333334 5.512691666666667 1.8748000000000002 10 1.8748000000000002C14.487291666666668 1.8748000000000002 18.125 5.512483333333334 18.125 9.999833333333335C18.125 10.304458333333333 18.108208333333334 10.605458333333333 18.075458333333337 10.901791666666668C18.0375 11.244916666666667 17.728625 11.492291666666667 17.385583333333333 11.454333333333334C17.0425 11.416416666666667 16.795083333333334 11.107541666666668 16.833000000000002 10.764458333333334C16.860750000000003 10.513625000000001 16.875 10.2585 16.875 9.999833333333335C16.875 6.202841666666667 13.796958333333333 3.1248000000000005 10 3.1248000000000005z"
                        fill="currentColor"></path>
                      <path
                        d="M15.391416666666666 9.141166666666667C15.635458333333334 8.897083333333335 16.031208333333332 8.897083333333335 16.275291666666668 9.141166666666667L17.5 10.365875L18.72475 9.141166666666667C18.968791666666668 8.897083333333335 19.364541666666668 8.897083333333335 19.608625 9.141166666666667C19.852666666666668 9.385291666666667 19.852666666666668 9.780958333333334 19.608625 10.025083333333333L18.08925 11.544416666666669C17.763833333333334 11.869833333333334 17.236208333333334 11.869833333333334 16.91075 11.544416666666669L15.391416666666666 10.025083333333333C15.147333333333334 9.780958333333334 15.147333333333334 9.385291666666667 15.391416666666666 9.141166666666667z"
                        fill="currentColor"></path>
                      <path
                        d="M12.499333333333334 9.278375C13.05475 9.599 13.05475 10.400666666666668 12.499333333333334 10.721291666666668L9.373916666666666 12.525791666666668C8.818541666666667 12.846416666666666 8.124274999999999 12.445583333333333 8.124274999999999 11.804291666666668L8.124274999999999 8.1954C8.124274999999999 7.554066666666667 8.818541666666667 7.153233333333334 9.373916666666666 7.473900000000001L12.499333333333334 9.278375z"
                        fill="currentColor"></path>
                    </svg><span class="bili-watch-later__tip--lab" style="display: none;">添加至稍后再看</span><!----></div>
                </div>
                <picture class="v-img bili-video-card__cover" data-v-d613d352=""><!--[--><!--[-->
                  <source
                    srcset="${videoCover}@672w_378h_1c_!web-home-common-cover.avif"
                    type="image/avif" data-v-d613d352=""><!--]--><!--[-->
                  <source
                    srcset="${videoCover}@672w_378h_1c_!web-home-common-cover.webp"
                    type="image/webp" data-v-d613d352=""><!--]--><!--[--><img
                    src="${videoCover}@672w_378h_1c_!web-home-common-cover"
                    alt="${videoTitle}" loading="eager" onload="fsrCb();firstVideoCardImgLoaded()" onerror="
            typeof window.imgOnError === 'function' &amp;&amp; window.imgOnError(this)
          " data-v-d613d352=""><!--]--><!--]-->
                </picture>
                <div class="v-inline-player"></div>
              </div>
              <div class="bili-video-card__mask">
                <div class="bili-video-card__stats">
                  <div class="bili-video-card__stats--left"><!--[--><span class="bili-video-card__stats--item"><svg
                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"
                        width="24" height="24" fill="#ffffff" class="bili-video-card__stats--icon"><!--[-->
                        <path
                          d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z"
                          fill="currentColor"></path>
                        <path
                          d="M14.7138 10.96875C15.50765 11.4271 15.50765 12.573 14.71375 13.0313L11.5362 14.8659C10.74235 15.3242 9.75 14.7513 9.75001 13.8346L9.75001 10.1655C9.75001 9.24881 10.74235 8.67587 11.5362 9.13422L14.7138 10.96875z"
                          fill="currentColor"></path><!--]-->
                      </svg><span class="bili-video-card__stats--text">${playCountText}</span></span><!--]--><span
                      class="bili-video-card__stats--item"><svg xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24"
                        fill="#ffffff" class="bili-video-card__stats--icon"><!--[-->
                        <path
                          d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z"
                          fill="currentColor"></path>
                        <path
                          d="M15.875 10.75L9.875 10.75C9.46079 10.75 9.125 10.4142 9.125 10C9.125 9.58579 9.46079 9.25 9.875 9.25L15.875 9.25C16.2892 9.25 16.625 9.58579 16.625 10C16.625 10.4142 16.2892 10.75 15.875 10.75z"
                          fill="currentColor"></path>
                        <path
                          d="M17.375 14.75L11.375 14.75C10.9608 14.75 10.625 14.4142 10.625 14C10.625 13.5858 10.9608 13.25 11.375 13.25L17.375 13.25C17.7892 13.25 18.125 13.5858 18.125 14C18.125 14.4142 17.7892 14.75 17.375 14.75z"
                          fill="currentColor"></path>
                        <path
                          d="M7.875 10C7.875 10.4142 7.53921 10.75 7.125 10.75L6.625 10.75C6.21079 10.75 5.875 10.4142 5.875 10C5.875 9.58579 6.21079 9.25 6.625 9.25L7.125 9.25C7.53921 9.25 7.875 9.58579 7.875 10z"
                          fill="currentColor"></path>
                        <path
                          d="M9.375 14C9.375 14.4142 9.03921 14.75 8.625 14.75L8.125 14.75C7.71079 14.75 7.375 14.4142 7.375 14C7.375 13.5858 7.71079 13.25 8.125 13.25L8.625 13.25C9.03921 13.25 9.375 13.5858 9.375 14z"
                          fill="currentColor"></path><!--]-->
                      </svg><span class="bili-video-card__stats--text">${danmaku}</span></span></div><span
                    class="bili-video-card__stats__duration">${duration}</span>
                </div>
              </div>
            </div>
          </a>
          <div style="" class="bili-video-card__info">
            <div class="bili-video-card__info--right"><!--[-->
              <div class="bili-video-card__info--no-interest" style="display:none;"><svg
                  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"
                  width="24" height="24" class="bili-video-card__info--no-interest--icon" fill="currentColor"><!--[-->
                  <path
                    d="M13.62335 5.49835C13.62335 6.3949 12.8966 7.12171 12 7.12171C11.10345 7.12171 10.37665 6.3949 10.37665 5.49835C10.37665 4.6018 11.10345 3.875 12 3.875C12.8966 3.875 13.62335 4.6018 13.62335 5.49835zM13.62345 18.4985C13.62345 19.3951 12.8966 20.12195 12 20.12195C11.10335 20.12195 10.3765 19.3951 10.3765 18.4985C10.3765 17.60185 11.10335 16.875 12 16.875C12.8966 16.875 13.62345 17.60185 13.62345 18.4985zM12 13.62485C12.89745 13.62485 13.62495 12.89735 13.62495 11.99995C13.62495 11.1025 12.89745 10.375 12 10.375C11.10255 10.375 10.37505 11.1025 10.37505 11.99995C10.37505 12.89735 11.10255 13.62485 12 13.62485z"
                    fill="currentColor"></path><!--]-->
                </svg></div><!----><!--]-->
              <h3 class="bili-video-card__info--tit" title="${videoTitle}"><a
                  href="https://www.bilibili.com/video/${videoId}" target="_blank" data-spmid="333.1007"
                  data-mod="tianma.3-4-10" data-idx="click">${videoTitle}</a></h3>
              <div class="bili-video-card__info--bottom"><!--[--><!----><a class="bili-video-card__info--owner"
                  href="//space.bilibili.com/${userId}" target="_blank" data-spmid="333.1007"
                  data-mod="tianma.3-4-10" data-idx="click"><svg xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24"
                    fill="currentColor" class="bili-video-card__info--owner__up"><!--[-->
                    <path
                      d="M6.15 8.24805C6.5642 8.24805 6.9 8.58383 6.9 8.99805L6.9 12.7741C6.9 13.5881 7.55988 14.248 8.3739 14.248C9.18791 14.248 9.8478 13.5881 9.8478 12.7741L9.8478 8.99805C9.8478 8.58383 10.1836 8.24805 10.5978 8.24805C11.012 8.24805 11.3478 8.58383 11.3478 8.99805L11.3478 12.7741C11.3478 14.41655 10.01635 15.748 8.3739 15.748C6.73146 15.748 5.4 14.41655 5.4 12.7741L5.4 8.99805C5.4 8.58383 5.73578 8.24805 6.15 8.24805z"
                      fill="currentColor"></path>
                    <path
                      d="M12.6522 8.99805C12.6522 8.58383 12.98795 8.24805 13.4022 8.24805L15.725 8.24805C17.31285 8.24805 18.6 9.53522 18.6 11.123C18.6 12.71085 17.31285 13.998 15.725 13.998L14.1522 13.998L14.1522 14.998C14.1522 15.4122 13.8164 15.748 13.4022 15.748C12.98795 15.748 12.6522 15.4122 12.6522 14.998L12.6522 8.99805zM14.1522 12.498L15.725 12.498C16.4844 12.498 17.1 11.8824 17.1 11.123C17.1 10.36365 16.4844 9.74804 15.725 9.74804L14.1522 9.74804L14.1522 12.498z"
                      fill="currentColor"></path>
                    <path
                      d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z"
                      fill="currentColor"></path><!--]-->
                  </svg><span class="bili-video-card__info--author" title="${userName}">${userName}</span><span
                    class="bili-video-card__info--date">· ${publishTime}</span></a><!--]--></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  };
  const createDOM = (html) => {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
  };
  const FIXED_CARD_CLASS = "bili-grid-fixed-card";
  const HIDDEN_AD_CLASS = "bili-ad-remover-hidden-ad";
  const HIDDEN_FILTER_CLASS = "bili-ad-remover-hidden-custom";
  const FILLED_CARD_CLASS = "bili-ad-remover-filled-card";
  const REFRESH_BTN_SELECTOR = ".primary-btn.roll-btn";
  const formatCount = (num) => {
    if (num >= 1e4) {
      return (num / 1e4).toFixed(1) + "万";
    }
    return num.toString();
  };
  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = seconds % 60;
    const pad = (n) => n.toString().padStart(2, "0");
    if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
    return `${pad(m)}:${pad(s)}`;
  };
  const formatDate = (ts) => {
    const date = new Date(ts * 1e3);
    const M = date.getMonth() + 1;
    const D = date.getDate();
    const pad = (n) => n.toString().padStart(2, "0");
    return `${pad(M)}-${pad(D)}`;
  };
  const App = () => {
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
    const [settings, setSettings] = React.useState(DEFAULT_SETTINGS);
    const [tempSettings, setTempSettings] = React.useState(DEFAULT_SETTINGS);
    const cleanTimerRef = React.useRef(0);
    const layoutRafRef = React.useRef(0);
    const observerRef = React.useRef(null);
    const hasFilledVideosRef = React.useRef(false);
    const isFetchingRef = React.useRef(false);
    const containerRef = React.useRef(null);
    const fillFragmentRef = React.useRef(null);
    const videoBufferRef = React.useRef(null);
    const parsedCustomRules = React.useMemo(() => {
      return parseCustomRules(settings.customFilterRules);
    }, [settings.customFilterRules]);
    const settingsRef = React.useRef(settings);
    const rulesRef = React.useRef(parsedCustomRules);
    React.useEffect(() => {
      settingsRef.current = settings;
      rulesRef.current = parsedCustomRules;
    }, [settings, parsedCustomRules]);
    React.useEffect(() => {
      const initSettings = async () => {
        const savedSettings = await GM_getValue(STORAGE_KEY, DEFAULT_SETTINGS);
        const mergedSettings = { ...DEFAULT_SETTINGS, ...savedSettings };
        setSettings(mergedSettings);
        setTempSettings(mergedSettings);
        applySettings(mergedSettings);
      };
      initSettings();
      GM_registerMenuCommand("⚙️ 脚本设置", () => {
        setIsSettingsOpen(true);
      });
      GM_registerMenuCommand("🏠 脚本主页", () => {
        window.open(LINKS.script_homepage, "_blank");
      });
      const handleResize = () => {
        if (layoutRafRef.current) cancelAnimationFrame(layoutRafRef.current);
        layoutRafRef.current = requestAnimationFrame(() => {
          fixGridAlignment(settingsRef.current);
        });
      };
      window.addEventListener("resize", handleResize);
      const handleClick = (e) => {
        handleHomeRefreshClick(e);
      };
      document.addEventListener("click", handleClick);
      return () => {
        if (cleanTimerRef.current) clearInterval(cleanTimerRef.current);
        if (layoutRafRef.current) cancelAnimationFrame(layoutRafRef.current);
        if (observerRef.current) observerRef.current.disconnect();
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("click", handleClick);
      };
    }, []);
    React.useEffect(() => {
      if (isSettingsOpen) {
        setTempSettings(settings);
      }
    }, [isSettingsOpen, settings]);
    React.useEffect(() => {
      applySettings(settings);
    }, [settings]);
    const handleTempUpdate = (updates) => {
      setTempSettings((prev) => ({ ...prev, ...updates }));
    };
    const isHomePage = () => {
      const path = window.location.pathname;
      return path === "/" || path === "/index.html" || path === "";
    };
    const getContainer = () => {
      if (!containerRef.current || !containerRef.current.isConnected) {
        containerRef.current = document.querySelector(SELECTORS.home_video_grid);
      }
      return containerRef.current;
    };
    const generateVideoFragment = (videos) => {
      const fragment = document.createDocumentFragment();
      videos.forEach((v) => {
        const html = getVideoCardHTML({
          playCountText: formatCount(v.stat.view),
          danmaku: formatCount(v.stat.danmaku),
          duration: formatDuration(v.duration),
          videoTitle: v.title,
          videoId: v.bvid,
          videoCover: v.pic.replace("http://", "//"),
          userId: v.owner.mid.toString(),
          userName: v.owner.name,
          publishTime: formatDate(v.pubdate)
        });
        const el = createDOM(html);
        if (el) fragment.appendChild(el);
      });
      return fragment;
    };
    const triggerFillVideoData = async (currentSettings, isRefill) => {
      if (isFetchingRef.current) return;
      if (!currentSettings.enableVideoGrid || !currentSettings.fillEmptySpace) return;
      if (!isHomePage()) return;
      isFetchingRef.current = true;
      const carouselSubtraction = currentSettings.hideCarousel ? 0 : 4;
      const singleFillCount = 3 * currentSettings.videosPerRow - carouselSubtraction - 11;
      if (singleFillCount <= 0) {
        isFetchingRef.current = false;
        return;
      }
      const ps = isRefill ? singleFillCount : singleFillCount * 2;
      try {
        const videos = await fetchRecommendVideos({ ps });
        if (videos && videos.length > 0) {
          if (isRefill) {
            videoBufferRef.current = generateVideoFragment(videos);
          } else {
            const splitIndex = singleFillCount;
            const currentBatch = videos.slice(0, splitIndex);
            const nextBatch = videos.slice(splitIndex);
            if (currentBatch.length > 0) {
              fillFragmentRef.current = generateVideoFragment(currentBatch);
              tryInsertFilledVideos();
            }
            if (nextBatch.length > 0) {
              videoBufferRef.current = generateVideoFragment(nextBatch);
            }
          }
        }
      } catch (e) {
        console.error("[AdRemover] Fill videos failed:", e);
      } finally {
        isFetchingRef.current = false;
      }
    };
    const insertFragmentToDOM = (fragment) => {
      const container = getContainer();
      if (!container) return;
      const referenceNode = container.children[10];
      if (referenceNode && referenceNode.nextSibling) {
        container.insertBefore(fragment, referenceNode.nextSibling);
      } else {
        container.appendChild(fragment);
      }
    };
    const tryInsertFilledVideos = () => {
      if (!fillFragmentRef.current || hasFilledVideosRef.current) return;
      const container = getContainer();
      if (!container) return;
      if (container.children.length >= 10) {
        insertFragmentToDOM(fillFragmentRef.current);
        fillFragmentRef.current = null;
        hasFilledVideosRef.current = true;
        executeAdClean();
      }
    };
    const removeFilledCards = () => {
      const container = getContainer();
      if (container) {
        const filledCards = container.querySelectorAll(`.${FILLED_CARD_CLASS}`);
        filledCards.forEach((card) => card.remove());
      }
    };
    const handleHomeRefreshClick = (e) => {
      if (!isHomePage()) return;
      const target = e.target;
      if (!target.closest(REFRESH_BTN_SELECTOR)) return;
      const container = getContainer();
      if (!container) return;
      const oldFirstCard = container.querySelector(SELECTORS.video_card);
      if (cleanTimerRef.current) {
        clearInterval(cleanTimerRef.current);
        cleanTimerRef.current = 0;
      }
      const startTime = Date.now();
      cleanTimerRef.current = window.setInterval(() => {
        if (Date.now() - startTime > 3e3) {
          if (cleanTimerRef.current) clearInterval(cleanTimerRef.current);
          return;
        }
        const currentContainer = getContainer();
        if (!currentContainer) return;
        const newFirstCard = currentContainer.querySelector(SELECTORS.video_card);
        if (newFirstCard && oldFirstCard && newFirstCard !== oldFirstCard) {
          if (cleanTimerRef.current) clearInterval(cleanTimerRef.current);
          removeFilledCards();
          if (videoBufferRef.current) {
            insertFragmentToDOM(videoBufferRef.current);
            videoBufferRef.current = null;
          }
          executeAdClean();
          triggerFillVideoData(settingsRef.current, true);
        }
      }, 100);
    };
    const resetGridAlignment = () => {
      const fixedCards = document.querySelectorAll(`.${FIXED_CARD_CLASS}`);
      fixedCards.forEach((el) => {
        const element = el;
        element.style.position = "";
        element.style.top = "";
        element.style.left = "";
        element.style.width = "";
        element.style.zIndex = "";
        element.classList.remove(FIXED_CARD_CLASS);
      });
    };
    const resetHiddenElements = (className) => {
      const elements = document.querySelectorAll(`.${className}`);
      elements.forEach((el) => {
        const element = el;
        element.style.display = "";
        element.classList.remove(className);
      });
    };
    const fixGridAlignment = (currentSettings) => {
      resetGridAlignment();
      if (!currentSettings.enableVideoGrid) return;
      const container = getContainer();
      if (!container) return;
      const visibleChildren = Array.from(container.children).filter((child) => {
        const el = child;
        return el.style.display !== "none" && el.offsetParent !== null;
      });
      if (visibleChildren.length === 0) return;
      const firstChild = visibleChildren[0];
      const hasCarousel = firstChild.classList.contains("recommended-swipe") && !currentSettings.hideCarousel;
      if (!hasCarousel) return;
      const cols = currentSettings.videosPerRow;
      const rightSideSlots = Math.max(0, cols - 2);
      if (rightSideSlots === 0) return;
      const row1StartIndex = 1;
      const row1EndIndex = row1StartIndex + rightSideSlots;
      const row2StartIndex = row1EndIndex;
      if (visibleChildren.length < row2StartIndex + rightSideSlots) return;
      for (let i = 0; i < rightSideSlots; i++) {
        const refIndex = row1StartIndex + i;
        const targetIndex = row2StartIndex + i;
        const refCard = visibleChildren[refIndex];
        const targetCard = visibleChildren[targetIndex];
        if (!refCard || !targetCard) continue;
        const gap = 20;
        const top = refCard.offsetTop + refCard.offsetHeight + gap;
        const left = refCard.offsetLeft;
        targetCard.classList.add(FIXED_CARD_CLASS);
        targetCard.style.position = "absolute";
        targetCard.style.top = `${top}px`;
        targetCard.style.left = `${left}px`;
        targetCard.style.width = `${refCard.offsetWidth}px`;
      }
    };
    const getActiveRules = () => {
      const path = window.location.pathname;
      const rules = [...DEFAULT_AD_RULES.common];
      if (isHomePage()) {
        rules.push(...DEFAULT_AD_RULES.homepage);
      } else if (path.startsWith("/video/")) {
        rules.push(...DEFAULT_AD_RULES.video);
      }
      return rules;
    };
    const executeAdClean = () => {
      const currentSettings = settingsRef.current;
      resetHiddenElements(HIDDEN_AD_CLASS);
      resetHiddenElements(HIDDEN_FILTER_CLASS);
      if (currentSettings.removeAds) {
        const activeRules = getActiveRules();
        activeRules.forEach((rule) => {
          const elements = document.querySelectorAll(rule.selector);
          elements.forEach((el) => {
            const element = el;
            if (element.style.display === "none") return;
            if (element.classList.contains(FILLED_CARD_CLASS)) return;
            let isMatch = true;
            if (rule.contentCheck) {
              const mode = rule.contentCheck.mode;
              if (["child-exists", "child-exists-exact", "child-exists-includes"].includes(mode)) {
                const checkSelector = rule.contentCheck.selector;
                const childElements = element.querySelectorAll(checkSelector);
                Array.from(childElements).find((child) => {
                  const childElement = child;
                  const checkVal = rule.contentCheck?.value;
                  if (checkVal) {
                    const text = childElement.innerText || "";
                    if (mode === "child-exists-exact") {
                      isMatch = text.trim() === checkVal;
                    } else if (mode === "child-exists-includes") {
                      isMatch = text.includes(checkVal);
                    }
                  }
                  return isMatch;
                });
                if (childElements.length === 0) {
                  isMatch = false;
                }
              } else {
                const checkVal = rule.contentCheck.value;
                const text = element.innerText || "";
                if (mode === "exact") {
                  isMatch = text.trim() === checkVal;
                } else if (mode === "includes") {
                  isMatch = text.includes(checkVal);
                }
              }
            }
            if (isMatch) {
              element.style.display = "none";
              element.classList.add(HIDDEN_AD_CLASS);
            }
          });
        });
      }
      const customRules = rulesRef.current;
      if (currentSettings.enableCustomFilters && customRules.length > 0) {
        const container = getContainer();
        const cards = container ? container.querySelectorAll(SELECTORS.video_card) : document.querySelectorAll(SELECTORS.video_card);
        cards.forEach((el) => {
          const card = el;
          if (card.style.display === "none") return;
          if (checkVideoAgainstRules(card, customRules)) {
            card.style.display = "none";
            card.classList.add(HIDDEN_FILTER_CLASS);
          }
        });
      }
      if (currentSettings.enableVideoGrid) {
        fixGridAlignment(currentSettings);
      }
    };
    const applySettings = (currentSettings) => {
      if (currentSettings.hideCarousel) {
        document.body.classList.add("bilibili-ad-remover-hide-carousel");
      } else {
        document.body.classList.remove("bilibili-ad-remover-hide-carousel");
      }
      if (currentSettings.enableVideoGrid) {
        document.body.classList.add("bilibili-custom-grid-mode");
        document.body.style.setProperty("--bili-custom-col-num", String(currentSettings.videosPerRow));
      } else {
        document.body.classList.remove("bilibili-custom-grid-mode");
        document.body.style.removeProperty("--bili-custom-col-num");
        resetGridAlignment();
      }
      if (cleanTimerRef.current) {
        clearInterval(cleanTimerRef.current);
        cleanTimerRef.current = 0;
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      executeAdClean();
      triggerFillVideoData(currentSettings, false);
      const needExecution = currentSettings.removeAds || currentSettings.enableVideoGrid || currentSettings.enableCustomFilters && currentSettings.customFilterRules.length > 0;
      if (!needExecution) return;
      if (isHomePage()) {
        const container = getContainer();
        if (container) {
          observerRef.current = new MutationObserver((mutations) => {
            if (container.children.length >= 6) {
              executeAdClean();
              tryInsertFilledVideos();
            }
          });
          observerRef.current.observe(container, { childList: true });
        }
      } else {
        cleanTimerRef.current = window.setInterval(executeAdClean, 1500);
      }
    };
    const handleConfirm = () => {
      setSettings(tempSettings);
      GM_setValue(STORAGE_KEY, tempSettings);
      setIsSettingsOpen(false);
    };
    return React.createElement(React.Fragment, null, React.createElement(
      SettingsModal,
      {
        isOpen: isSettingsOpen,
        onClose: () => setIsSettingsOpen(false),
        title: "Bilibili 净化设置",
        icon: Settings,
        data: tempSettings,
        onUpdate: handleTempUpdate,
        settingsConfig: SETTINGS_CONFIG,
        context: {},
        confirmText: "应用",
        onConfirm: handleConfirm
      }
    ));
  };
  function createShadowRootRender(hostId, Component, cssContent) {
    let host = document.getElementById(hostId);
    if (!host) {
      host = document.createElement("div");
      host.id = hostId;
      host.style.position = "absolute";
      host.style.top = "0";
      host.style.left = "0";
      host.style.width = "0";
      host.style.height = "0";
      host.style.zIndex = "999999";
      host.style.pointerEvents = "none";
      document.body.appendChild(host);
    }
    const shadow = host.shadowRoot || host.attachShadow({ mode: "open" });
    let styleTag = shadow.querySelector("style[data-app-styles]");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.setAttribute("data-app-styles", "true");
      shadow.appendChild(styleTag);
    }
    styleTag.textContent = cssContent;
    let rootDiv = shadow.getElementById("shadow-app-root");
    if (!rootDiv) {
      rootDiv = document.createElement("div");
      rootDiv.id = "shadow-app-root";
      rootDiv.style.pointerEvents = "auto";
      shadow.appendChild(rootDiv);
    }
    const root = ReactDOM.createRoot(rootDiv);
    root.render(
React.createElement(React.StrictMode, null, React.createElement(Component, null))
    );
    return root;
  }
  const globalCss = ".bilibili-ad-remover-hide-carousel .recommended-swipe,.bilibili-ad-remover-hide-carousel.bilibili-custom-grid-mode .is-version8 .recommended-swipe{display:none!important}.bilibili-custom-grid-mode .is-version8{display:flex!important;flex-wrap:wrap!important;gap:20px!important;grid-template-columns:none!important;height:auto!important;position:relative!important;align-items:flex-start!important}.bilibili-custom-grid-mode .is-version8>*{--gap-size: 20px;width:calc((100% - (var(--bili-custom-col-num) - 1) * var(--gap-size)) / var(--bili-custom-col-num))!important;margin:0!important;grid-column:auto!important;grid-row:auto!important}.bilibili-custom-grid-mode .is-version8>.bili-ad-remover-hidden-ad{display:none!important}.bilibili-custom-grid-mode .is-version8>.bili-ad-remover-filled-card{display:block!important}.bilibili-custom-grid-mode .is-version8>.bili-ad-remover-filled-card.bili-ad-remover-hidden-ad{display:none!important}.bilibili-ad-remover-hide-carousel .is-version8>*{margin-top:24px!important}.bilibili-custom-grid-mode .is-version8>.recommended-swipe{display:block!important;--gap-size: 20px;--single-col-width: calc((100% - (var(--bili-custom-col-num) - 1) * var(--gap-size)) / var(--bili-custom-col-num));width:calc(var(--single-col-width) * 2 + var(--gap-size))!important;height:auto!important;margin-bottom:75px!important}.bilibili-custom-grid-mode .is-version8>.recommended-swipe .shim-card{height:100%!important}";
  importCSS(globalCss);
  const tailwindStyles = '/*! tailwindcss v4.1.18 | MIT License | https://tailwindcss.com */@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-space-y-reverse:0;--tw-border-style:solid;--tw-leading:initial;--tw-font-weight:initial;--tw-tracking:initial;--tw-ordinal:initial;--tw-slashed-zero:initial;--tw-numeric-figure:initial;--tw-numeric-spacing:initial;--tw-numeric-fraction:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial;--tw-duration:initial}}}@layer theme{:root,:host{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-blue-600:oklch(54.6% .245 262.881);--color-gray-300:oklch(87.2% .01 258.338);--color-gray-400:oklch(70.7% .022 261.325);--color-gray-500:oklch(55.1% .027 264.364);--color-gray-600:oklch(44.6% .03 256.802);--color-black:#000;--color-white:#fff;--spacing:.25rem;--text-xs:.75rem;--text-xs--line-height:calc(1/.75);--text-sm:.875rem;--text-sm--line-height:calc(1.25/.875);--text-lg:1.125rem;--text-lg--line-height:calc(1.75/1.125);--font-weight-bold:700;--tracking-wider:.05em;--leading-tight:1.25;--radius-lg:.5rem;--blur-sm:8px;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4,0,.2,1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono);--color-surface:#1e293b;--color-primary:#3b82f6}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab,red,red)){::placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer components;@layer utilities{.pointer-events-none{pointer-events:none}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.static{position:static}.inset-0{inset:calc(var(--spacing)*0)}.top-1\\/2{top:50%}.right-1{right:calc(var(--spacing)*1)}.right-2{right:calc(var(--spacing)*2)}.z-50{z-index:50}.col-span-1{grid-column:span 1/span 1}.col-span-2{grid-column:span 2/span 2}.container{width:100%}@media(min-width:40rem){.container{max-width:40rem}}@media(min-width:48rem){.container{max-width:48rem}}@media(min-width:64rem){.container{max-width:64rem}}@media(min-width:80rem){.container{max-width:80rem}}@media(min-width:96rem){.container{max-width:96rem}}.m-0{margin:calc(var(--spacing)*0)}.m-4{margin:calc(var(--spacing)*4)}.mt-0\\.5{margin-top:calc(var(--spacing)*.5)}.mt-2{margin-top:calc(var(--spacing)*2)}.-mr-1{margin-right:calc(var(--spacing)*-1)}.mr-1{margin-right:calc(var(--spacing)*1)}.mb-1{margin-bottom:calc(var(--spacing)*1)}.mb-1\\.5{margin-bottom:calc(var(--spacing)*1.5)}.-ml-1{margin-left:calc(var(--spacing)*-1)}.ml-0\\.5{margin-left:calc(var(--spacing)*.5)}.block{display:block}.flex{display:flex}.grid{display:grid}.hidden{display:none}.inline{display:inline}.h-1{height:calc(var(--spacing)*1)}.h-3{height:calc(var(--spacing)*3)}.h-4{height:calc(var(--spacing)*4)}.h-5{height:calc(var(--spacing)*5)}.h-6{height:calc(var(--spacing)*6)}.h-24{height:calc(var(--spacing)*24)}.h-\\[26px\\]{height:26px}.h-\\[540px\\]{height:540px}.h-full{height:100%}.h-px{height:1px}.max-h-\\[75vh\\]{max-height:75vh}.max-h-\\[90vh\\]{max-height:90vh}.w-1{width:calc(var(--spacing)*1)}.w-4{width:calc(var(--spacing)*4)}.w-6{width:calc(var(--spacing)*6)}.w-10{width:calc(var(--spacing)*10)}.w-16{width:calc(var(--spacing)*16)}.w-\\[90vw\\]{width:90vw}.w-full{width:100%}.max-w-\\[90vh\\]{max-width:90vh}.max-w-\\[90vw\\]{max-width:90vw}.flex-1{flex:1}.flex-shrink-0{flex-shrink:0}.-translate-y-1\\/2{--tw-translate-y: -50% ;translate:var(--tw-translate-x)var(--tw-translate-y)}.transform{transform:var(--tw-rotate-x,)var(--tw-rotate-y,)var(--tw-rotate-z,)var(--tw-skew-x,)var(--tw-skew-y,)}.cursor-default{cursor:default}.cursor-help{cursor:help}.cursor-not-allowed{cursor:not-allowed}.cursor-pointer{cursor:pointer}.resize{resize:both}.resize-y{resize:vertical}.appearance-none{appearance:none}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.gap-2{gap:calc(var(--spacing)*2)}.gap-3{gap:calc(var(--spacing)*3)}:where(.space-y-2>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*2)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*2)*calc(1 - var(--tw-space-y-reverse)))}.overflow-y-auto{overflow-y:auto}.rounded{border-radius:.25rem}.rounded-full{border-radius:3.40282e38px}.rounded-lg{border-radius:var(--radius-lg)}.rounded-l{border-top-left-radius:.25rem;border-bottom-left-radius:.25rem}.rounded-r{border-top-right-radius:.25rem;border-bottom-right-radius:.25rem}.border{border-style:var(--tw-border-style);border-width:1px}.border-y{border-block-style:var(--tw-border-style);border-block-width:1px}.border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.border-r{border-right-style:var(--tw-border-style);border-right-width:1px}.border-b{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}.border-none{--tw-border-style:none;border-style:none}.border-gray-600{border-color:var(--color-gray-600)}.border-primary{border-color:var(--color-primary)}.border-primary\\/50{border-color:#3b82f680}@supports (color:color-mix(in lab,red,red)){.border-primary\\/50{border-color:color-mix(in oklab,var(--color-primary)50%,transparent)}}.border-transparent{border-color:#0000}.border-white\\/10{border-color:#ffffff1a}@supports (color:color-mix(in lab,red,red)){.border-white\\/10{border-color:color-mix(in oklab,var(--color-white)10%,transparent)}}.bg-black\\/30{background-color:#0000004d}@supports (color:color-mix(in lab,red,red)){.bg-black\\/30{background-color:color-mix(in oklab,var(--color-black)30%,transparent)}}.bg-black\\/50{background-color:#00000080}@supports (color:color-mix(in lab,red,red)){.bg-black\\/50{background-color:color-mix(in oklab,var(--color-black)50%,transparent)}}.bg-black\\/80{background-color:#000c}@supports (color:color-mix(in lab,red,red)){.bg-black\\/80{background-color:color-mix(in oklab,var(--color-black)80%,transparent)}}.bg-primary{background-color:var(--color-primary)}.bg-primary\\/20{background-color:#3b82f633}@supports (color:color-mix(in lab,red,red)){.bg-primary\\/20{background-color:color-mix(in oklab,var(--color-primary)20%,transparent)}}.bg-surface{background-color:var(--color-surface)}.bg-transparent{background-color:#0000}.bg-white\\/5{background-color:#ffffff0d}@supports (color:color-mix(in lab,red,red)){.bg-white\\/5{background-color:color-mix(in oklab,var(--color-white)5%,transparent)}}.bg-white\\/10{background-color:#ffffff1a}@supports (color:color-mix(in lab,red,red)){.bg-white\\/10{background-color:color-mix(in oklab,var(--color-white)10%,transparent)}}.p-0{padding:calc(var(--spacing)*0)}.p-1{padding:calc(var(--spacing)*1)}.p-3{padding:calc(var(--spacing)*3)}.px-1{padding-inline:calc(var(--spacing)*1)}.px-2{padding-inline:calc(var(--spacing)*2)}.px-3{padding-inline:calc(var(--spacing)*3)}.py-1{padding-block:calc(var(--spacing)*1)}.py-1\\.5{padding-block:calc(var(--spacing)*1.5)}.py-2{padding-block:calc(var(--spacing)*2)}.pt-1{padding-top:calc(var(--spacing)*1)}.pt-2{padding-top:calc(var(--spacing)*2)}.pb-1{padding-bottom:calc(var(--spacing)*1)}.pl-1{padding-left:calc(var(--spacing)*1)}.text-center{text-align:center}.text-left{text-align:left}.font-mono{font-family:var(--font-mono)}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.text-\\[9px\\]{font-size:9px}.text-\\[10px\\]{font-size:10px}.leading-tight{--tw-leading:var(--leading-tight);line-height:var(--leading-tight)}.font-bold{--tw-font-weight:var(--font-weight-bold);font-weight:var(--font-weight-bold)}.tracking-wider{--tw-tracking:var(--tracking-wider);letter-spacing:var(--tracking-wider)}.break-all{word-break:break-all}.text-gray-300{color:var(--color-gray-300)}.text-gray-400{color:var(--color-gray-400)}.text-gray-500{color:var(--color-gray-500)}.text-gray-600{color:var(--color-gray-600)}.text-primary{color:var(--color-primary)}.text-white{color:var(--color-white)}.uppercase{text-transform:uppercase}.tabular-nums{--tw-numeric-spacing:tabular-nums;font-variant-numeric:var(--tw-ordinal,)var(--tw-slashed-zero,)var(--tw-numeric-figure,)var(--tw-numeric-spacing,)var(--tw-numeric-fraction,)}.underline{text-decoration-line:underline}.decoration-gray-600{-webkit-text-decoration-color:var(--color-gray-600);text-decoration-color:var(--color-gray-600)}.decoration-dashed{text-decoration-style:dashed}.underline-offset-2{text-underline-offset:2px}.accent-gray-600{accent-color:var(--color-gray-600)}.accent-primary{accent-color:var(--color-primary)}.opacity-50{opacity:.5}.shadow{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-2xl{--tw-shadow:0 25px 50px -12px var(--tw-shadow-color,#00000040);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-lg{--tw-shadow:0 10px 15px -3px var(--tw-shadow-color,#0000001a),0 4px 6px -4px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-sm{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-primary\\/10{--tw-shadow-color:#3b82f61a}@supports (color:color-mix(in lab,red,red)){.shadow-primary\\/10{--tw-shadow-color:color-mix(in oklab,color-mix(in oklab,var(--color-primary)10%,transparent)var(--tw-shadow-alpha),transparent)}}.blur{--tw-blur:blur(8px);filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)}.backdrop-blur-sm{--tw-backdrop-blur:blur(var(--blur-sm));-webkit-backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,)}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-opacity{transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.duration-200{--tw-duration:.2s;transition-duration:.2s}.outline-none{--tw-outline-style:none;outline-style:none}.select-none{-webkit-user-select:none;user-select:none}@media(hover:hover){.group-hover\\/header\\:text-white:is(:where(.group\\/header):hover *){color:var(--color-white)}.hover\\:border-white\\/5:hover{border-color:#ffffff0d}@supports (color:color-mix(in lab,red,red)){.hover\\:border-white\\/5:hover{border-color:color-mix(in oklab,var(--color-white)5%,transparent)}}.hover\\:bg-blue-600:hover{background-color:var(--color-blue-600)}.hover\\:bg-white\\/5:hover{background-color:#ffffff0d}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-white\\/5:hover{background-color:color-mix(in oklab,var(--color-white)5%,transparent)}}.hover\\:bg-white\\/10:hover{background-color:#ffffff1a}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-white\\/10:hover{background-color:color-mix(in oklab,var(--color-white)10%,transparent)}}.hover\\:text-primary:hover{color:var(--color-primary)}.hover\\:text-white:hover{color:var(--color-white)}.hover\\:decoration-primary:hover{-webkit-text-decoration-color:var(--color-primary);text-decoration-color:var(--color-primary)}.hover\\:opacity-80:hover{opacity:.8}}.focus\\:border-primary:focus{border-color:var(--color-primary)}.focus\\:ring-0:focus{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(0px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:text-gray-500:disabled{color:var(--color-gray-500)}.disabled\\:text-gray-600:disabled{color:var(--color-gray-600)}@media(min-width:48rem){.md\\:w-\\[35vh\\]{width:35vh}.md\\:w-\\[400px\\]{width:400px}.md\\:min-w-\\[440px\\]{min-width:440px}}}:host{-webkit-text-size-adjust:100%;color:#f3f4f6;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-size:16px;line-height:1.5}#shadow-app-root{width:100%;height:100%}::-webkit-scrollbar{width:8px;height:8px}::-webkit-scrollbar-track{background:#1e293b}::-webkit-scrollbar-thumb{background:#475569;border-radius:4px}::-webkit-scrollbar-thumb:hover{background:#64748b}.mobile-thick-scrollbar::-webkit-scrollbar{width:12px;height:12px}.mobile-thick-scrollbar::-webkit-scrollbar-thumb{background:#475569;border:2px solid #1e293b;border-radius:6px}@property --tw-translate-x{syntax:"*";inherits:false;initial-value:0}@property --tw-translate-y{syntax:"*";inherits:false;initial-value:0}@property --tw-translate-z{syntax:"*";inherits:false;initial-value:0}@property --tw-rotate-x{syntax:"*";inherits:false}@property --tw-rotate-y{syntax:"*";inherits:false}@property --tw-rotate-z{syntax:"*";inherits:false}@property --tw-skew-x{syntax:"*";inherits:false}@property --tw-skew-y{syntax:"*";inherits:false}@property --tw-space-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-leading{syntax:"*";inherits:false}@property --tw-font-weight{syntax:"*";inherits:false}@property --tw-tracking{syntax:"*";inherits:false}@property --tw-ordinal{syntax:"*";inherits:false}@property --tw-slashed-zero{syntax:"*";inherits:false}@property --tw-numeric-figure{syntax:"*";inherits:false}@property --tw-numeric-spacing{syntax:"*";inherits:false}@property --tw-numeric-fraction{syntax:"*";inherits:false}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-blur{syntax:"*";inherits:false}@property --tw-brightness{syntax:"*";inherits:false}@property --tw-contrast{syntax:"*";inherits:false}@property --tw-grayscale{syntax:"*";inherits:false}@property --tw-hue-rotate{syntax:"*";inherits:false}@property --tw-invert{syntax:"*";inherits:false}@property --tw-opacity{syntax:"*";inherits:false}@property --tw-saturate{syntax:"*";inherits:false}@property --tw-sepia{syntax:"*";inherits:false}@property --tw-drop-shadow{syntax:"*";inherits:false}@property --tw-drop-shadow-color{syntax:"*";inherits:false}@property --tw-drop-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:"*";inherits:false}@property --tw-backdrop-blur{syntax:"*";inherits:false}@property --tw-backdrop-brightness{syntax:"*";inherits:false}@property --tw-backdrop-contrast{syntax:"*";inherits:false}@property --tw-backdrop-grayscale{syntax:"*";inherits:false}@property --tw-backdrop-hue-rotate{syntax:"*";inherits:false}@property --tw-backdrop-invert{syntax:"*";inherits:false}@property --tw-backdrop-opacity{syntax:"*";inherits:false}@property --tw-backdrop-saturate{syntax:"*";inherits:false}@property --tw-backdrop-sepia{syntax:"*";inherits:false}@property --tw-duration{syntax:"*";inherits:false}';
  (function() {
    console.log("Bilibili Ad Remover (React + Shadow DOM) loaded.");
    const home_video_grid = document.querySelector(SELECTORS.home_video_grid);
    if (home_video_grid) {
      home_video_grid.style.maxWidth = "100%";
    }
    createShadowRootRender(
      "bilibili-ad-remover-root",
      App,
      tailwindStyles
    );
  })();

})(React, ReactDOM);