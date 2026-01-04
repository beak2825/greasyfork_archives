(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react/jsx-runtime'), require('react'), require('prop-types'), require('@mantine/core'), require('@mantine/hooks')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react/jsx-runtime', 'react', 'prop-types', '@mantine/core', '@mantine/hooks'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MantineDropzone = {}, global.ReactJSXRuntime, global.React, global.PropTypes, global.MantineCore, global.MantineHooks));
})(this, (function (exports, jsxRuntime, React, PropTypes, core, hooks) { 'use strict';

  /* esm.sh - esbuild bundle(@mantine/dropzone@7.13.0) es2022 development */
  // ../esmd/npm/@mantine/dropzone@7.13.0/node_modules/.pnpm/@mantine+dropzone@7.13.0_@mantine+core@7.13.0_@mantine+hooks@7.13.0_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dropzone/esm/Dropzone.mjs

  // ../esmd/npm/@mantine/dropzone@7.13.0/node_modules/.pnpm/react-dropzone-esm@15.0.1_react@18.3.1/node_modules/react-dropzone-esm/dist/esm/file.mjs
  var COMMON_MIME_TYPES = /* @__PURE__ */ new Map([
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
    ["aac", "audio/aac"],
    ["abw", "application/x-abiword"],
    ["arc", "application/x-freearc"],
    ["avif", "image/avif"],
    ["avi", "video/x-msvideo"],
    ["azw", "application/vnd.amazon.ebook"],
    ["bin", "application/octet-stream"],
    ["bmp", "image/bmp"],
    ["bz", "application/x-bzip"],
    ["bz2", "application/x-bzip2"],
    ["cda", "application/x-cdf"],
    ["csh", "application/x-csh"],
    ["css", "text/css"],
    ["csv", "text/csv"],
    ["doc", "application/msword"],
    [
      "docx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ],
    ["eot", "application/vnd.ms-fontobject"],
    ["epub", "application/epub+zip"],
    ["gz", "application/gzip"],
    ["gif", "image/gif"],
    ["heic", "image/heic"],
    ["heif", "image/heif"],
    ["htm", "text/html"],
    ["html", "text/html"],
    ["ico", "image/vnd.microsoft.icon"],
    ["ics", "text/calendar"],
    ["jar", "application/java-archive"],
    ["jpeg", "image/jpeg"],
    ["jpg", "image/jpeg"],
    ["js", "text/javascript"],
    ["json", "application/json"],
    ["jsonld", "application/ld+json"],
    ["mid", "audio/midi"],
    ["midi", "audio/midi"],
    ["mjs", "text/javascript"],
    ["mp3", "audio/mpeg"],
    ["mp4", "video/mp4"],
    ["mpeg", "video/mpeg"],
    ["mpkg", "application/vnd.apple.installer+xml"],
    ["odp", "application/vnd.oasis.opendocument.presentation"],
    ["ods", "application/vnd.oasis.opendocument.spreadsheet"],
    ["odt", "application/vnd.oasis.opendocument.text"],
    ["oga", "audio/ogg"],
    ["ogv", "video/ogg"],
    ["ogx", "application/ogg"],
    ["opus", "audio/opus"],
    ["otf", "font/otf"],
    ["png", "image/png"],
    ["pdf", "application/pdf"],
    ["php", "application/x-httpd-php"],
    ["ppt", "application/vnd.ms-powerpoint"],
    [
      "pptx",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ],
    ["rar", "application/vnd.rar"],
    ["rtf", "application/rtf"],
    ["sh", "application/x-sh"],
    ["svg", "image/svg+xml"],
    ["swf", "application/x-shockwave-flash"],
    ["tar", "application/x-tar"],
    ["tif", "image/tiff"],
    ["tiff", "image/tiff"],
    ["ts", "video/mp2t"],
    ["ttf", "font/ttf"],
    ["txt", "text/plain"],
    ["vsd", "application/vnd.visio"],
    ["wav", "audio/wav"],
    ["weba", "audio/webm"],
    ["webm", "video/webm"],
    ["webp", "image/webp"],
    ["woff", "font/woff"],
    ["woff2", "font/woff2"],
    ["xhtml", "application/xhtml+xml"],
    ["xls", "application/vnd.ms-excel"],
    ["xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
    ["xml", "application/xml"],
    ["xul", "application/vnd.mozilla.xul+xml"],
    ["zip", "application/zip"],
    ["7z", "application/x-7z-compressed"],
    // Others
    ["mkv", "video/x-matroska"],
    ["mov", "video/quicktime"],
    ["msg", "application/vnd.ms-outlook"]
  ]);
  function toFileWithPath(file, path) {
    const f = withMimeType(file);
    if (typeof f.path !== "string") {
      const { webkitRelativePath } = file;
      Object.defineProperty(f, "path", {
        value: typeof path === "string" ? path : (
          // If <input webkitdirectory> is set,
          // the File will have a {webkitRelativePath} property
          // https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory
          typeof webkitRelativePath === "string" && webkitRelativePath.length > 0 ? webkitRelativePath : file.name
        ),
        writable: false,
        configurable: false,
        enumerable: true
      });
    }
    return f;
  }
  function withMimeType(file) {
    const { name } = file;
    const hasExtension = name && name.lastIndexOf(".") !== -1;
    if (hasExtension && !file.type) {
      const ext = name.split(".").pop().toLowerCase();
      const type = COMMON_MIME_TYPES.get(ext);
      if (type) {
        Object.defineProperty(file, "type", {
          value: type,
          writable: false,
          configurable: false,
          enumerable: true
        });
      }
    }
    return file;
  }

  // ../esmd/npm/@mantine/dropzone@7.13.0/node_modules/.pnpm/react-dropzone-esm@15.0.1_react@18.3.1/node_modules/react-dropzone-esm/dist/esm/file-selector.mjs
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  var FILES_TO_IGNORE = [
    // Thumbnail cache files for macOS and Windows
    ".DS_Store",
    // macOs
    "Thumbs.db"
    // Windows
  ];
  function fromEvent(evt) {
    return __async(this, null, function* () {
      if (isObject(evt) && isDataTransfer(evt.dataTransfer)) {
        return getDataTransferFiles(evt.dataTransfer, evt.type);
      } else if (isChangeEvt(evt)) {
        return getInputFiles(evt);
      } else if (Array.isArray(evt) && evt.every((item) => "getFile" in item && typeof item.getFile === "function")) {
        return getFsHandleFiles(evt);
      }
      return [];
    });
  }
  function isDataTransfer(value) {
    return isObject(value);
  }
  function isChangeEvt(value) {
    return isObject(value) && isObject(value.target);
  }
  function isObject(v) {
    return typeof v === "object" && v !== null;
  }
  function getInputFiles(evt) {
    return fromList(evt.target.files).map((file) => toFileWithPath(file));
  }
  function getFsHandleFiles(handles) {
    return __async(this, null, function* () {
      const files = yield Promise.all(handles.map((h) => h.getFile()));
      return files.map((file) => toFileWithPath(file));
    });
  }
  function getDataTransferFiles(dt, type) {
    return __async(this, null, function* () {
      if (dt.items) {
        const items = fromList(dt.items).filter((item) => item.kind === "file");
        if (type !== "drop") {
          return items;
        }
        const files = yield Promise.all(items.map(toFilePromises));
        return noIgnoredFiles(flatten(files));
      }
      return noIgnoredFiles(fromList(dt.files).map((file) => toFileWithPath(file)));
    });
  }
  function noIgnoredFiles(files) {
    return files.filter((file) => FILES_TO_IGNORE.indexOf(file.name) === -1);
  }
  function fromList(items) {
    if (items === null) {
      return [];
    }
    const files = [];
    for (let i = 0; i < items.length; i++) {
      const file = items[i];
      files.push(file);
    }
    return files;
  }
  function toFilePromises(item) {
    if (typeof item.webkitGetAsEntry !== "function") {
      return fromDataTransferItem(item);
    }
    const entry = item.webkitGetAsEntry();
    if (entry && entry.isDirectory) {
      return fromDirEntry(entry);
    }
    return fromDataTransferItem(item);
  }
  function flatten(items) {
    return items.reduce(
      (acc, files) => [
        ...acc,
        ...Array.isArray(files) ? flatten(files) : [files]
      ],
      []
    );
  }
  function fromDataTransferItem(item) {
    const file = item.getAsFile();
    if (!file) {
      return Promise.reject(`${item} is not a File`);
    }
    const fwp = toFileWithPath(file);
    return Promise.resolve(fwp);
  }
  function fromEntry(entry) {
    return __async(this, null, function* () {
      return entry.isDirectory ? fromDirEntry(entry) : fromFileEntry(entry);
    });
  }
  function fromDirEntry(entry) {
    const reader = entry.createReader();
    return new Promise((resolve, reject) => {
      const entries = [];
      function readEntries() {
        reader.readEntries(
          (batch) => __async(this, null, function* () {
            if (!batch.length) {
              try {
                const files = yield Promise.all(entries);
                resolve(files);
              } catch (err) {
                reject(err);
              }
            } else {
              const items = Promise.all(batch.map(fromEntry));
              entries.push(items);
              readEntries();
            }
          }),
          (err) => {
            reject(err);
          }
        );
      }
      readEntries();
    });
  }
  function fromFileEntry(entry) {
    return __async(this, null, function* () {
      return new Promise((resolve, reject) => {
        entry.file(
          (file) => {
            const fwp = toFileWithPath(file, entry.fullPath);
            resolve(fwp);
          },
          (err) => {
            reject(err);
          }
        );
      });
    });
  }

  // ../esmd/npm/@mantine/dropzone@7.13.0/node_modules/.pnpm/react-dropzone-esm@15.0.1_react@18.3.1/node_modules/react-dropzone-esm/dist/esm/attr-accept.mjs
  function accepts(file, acceptedFiles) {
    if (file && acceptedFiles) {
      const acceptedFilesArray = Array.isArray(acceptedFiles) ? acceptedFiles : acceptedFiles.split(",");
      const fileName = file.name || "";
      const mimeType = (file.type || "").toLowerCase();
      const baseMimeType = mimeType.replace(/\/.*$/, "");
      return acceptedFilesArray.some((type) => {
        const validType = type.trim().toLowerCase();
        if (validType.charAt(0) === ".") {
          return fileName.toLowerCase().endsWith(validType);
        } else if (validType.endsWith("/*")) {
          return baseMimeType === validType.replace(/\/.*$/, "");
        }
        return mimeType === validType;
      });
    }
    return true;
  }

  // ../esmd/npm/@mantine/dropzone@7.13.0/node_modules/.pnpm/react-dropzone-esm@15.0.1_react@18.3.1/node_modules/react-dropzone-esm/dist/esm/utils.mjs
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var FILE_INVALID_TYPE = "file-invalid-type";
  var FILE_TOO_LARGE = "file-too-large";
  var FILE_TOO_SMALL = "file-too-small";
  var TOO_MANY_FILES = "too-many-files";
  var getInvalidTypeRejectionErr = (accept) => {
    accept = Array.isArray(accept) && accept.length === 1 ? accept[0] : accept;
    const messageSuffix = Array.isArray(accept) ? `one of ${accept.join(", ")}` : accept;
    return {
      code: FILE_INVALID_TYPE,
      message: `File type must be ${messageSuffix}`
    };
  };
  var getTooLargeRejectionErr = (maxSize) => {
    return {
      code: FILE_TOO_LARGE,
      message: `File is larger than ${maxSize} ${maxSize === 1 ? "byte" : "bytes"}`
    };
  };
  var getTooSmallRejectionErr = (minSize) => {
    return {
      code: FILE_TOO_SMALL,
      message: `File is smaller than ${minSize} ${minSize === 1 ? "byte" : "bytes"}`
    };
  };
  var TOO_MANY_FILES_REJECTION = {
    code: TOO_MANY_FILES,
    message: "Too many files"
  };
  function fileAccepted(file, accept) {
    const isAcceptable = file.type === "application/x-moz-file" || accepts(file, accept);
    return [
      isAcceptable,
      isAcceptable ? null : getInvalidTypeRejectionErr(accept)
    ];
  }
  function fileMatchSize(file, minSize, maxSize) {
    if (isDefined(file.size)) {
      if (isDefined(minSize) && isDefined(maxSize)) {
        if (file.size > maxSize)
          return [false, getTooLargeRejectionErr(maxSize)];
        if (file.size < minSize)
          return [false, getTooSmallRejectionErr(minSize)];
      } else if (isDefined(minSize) && file.size < minSize)
        return [false, getTooSmallRejectionErr(minSize)];
      else if (isDefined(maxSize) && file.size > maxSize)
        return [false, getTooLargeRejectionErr(maxSize)];
    }
    return [true, null];
  }
  function isDefined(value) {
    return value !== void 0 && value !== null;
  }
  function allFilesAccepted({
    files,
    accept,
    minSize,
    maxSize,
    multiple,
    maxFiles,
    validator
  }) {
    if (!multiple && files.length > 1 || multiple && maxFiles >= 1 && files.length > maxFiles) {
      return false;
    }
    return files.every((file) => {
      const [accepted] = fileAccepted(file, accept);
      const [sizeMatch] = fileMatchSize(file, minSize, maxSize);
      const customErrors = validator ? validator(file) : null;
      return accepted && sizeMatch && !customErrors;
    });
  }
  function isPropagationStopped(event) {
    if (typeof event.isPropagationStopped === "function") {
      return event.isPropagationStopped();
    } else if (typeof event.cancelBubble !== "undefined") {
      return event.cancelBubble;
    }
    return false;
  }
  function isEvtWithFiles(event) {
    if (!event.dataTransfer) {
      return !!event.target && !!event.target.files;
    }
    return Array.prototype.some.call(
      event.dataTransfer.types,
      (type) => type === "Files" || type === "application/x-moz-file"
    );
  }
  function onDocumentDragOver(event) {
    event.preventDefault();
  }
  function isIe(userAgent) {
    return userAgent.indexOf("MSIE") !== -1 || userAgent.indexOf("Trident/") !== -1;
  }
  function isEdge(userAgent) {
    return userAgent.indexOf("Edge/") !== -1;
  }
  function isIeOrEdge(userAgent = window.navigator.userAgent) {
    return isIe(userAgent) || isEdge(userAgent);
  }
  function composeEventHandlers(...fns) {
    return (event, ...args) => fns.some((fn) => {
      if (!isPropagationStopped(event) && fn) {
        fn(event, ...args);
      }
      return isPropagationStopped(event);
    });
  }
  function canUseFileSystemAccessAPI() {
    return "showOpenFilePicker" in window;
  }
  function pickerOptionsFromAccept(accept) {
    if (isDefined(accept)) {
      const acceptForPicker = Object.entries(accept).filter(([mimeType, ext]) => {
        let ok = true;
        if (!isMIMEType(mimeType)) {
          console.warn(
            `Skipped "${mimeType}" because it is not a valid MIME type. Check https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types for a list of valid MIME types.`
          );
          ok = false;
        }
        if (!Array.isArray(ext) || !ext.every(isExt)) {
          console.warn(
            `Skipped "${mimeType}" because an invalid file extension was provided.`
          );
          ok = false;
        }
        return ok;
      }).reduce(
        (agg, [mimeType, ext]) => __spreadProps(__spreadValues({}, agg), {
          [mimeType]: ext
        }),
        {}
      );
      return [
        {
          // description is required due to https://crbug.com/1264708
          description: "Files",
          accept: acceptForPicker
        }
      ];
    }
    return accept;
  }
  function acceptPropAsAcceptAttr(accept) {
    if (isDefined(accept)) {
      return Object.entries(accept).reduce((a, [mimeType, ext]) => [...a, mimeType, ...ext], []).filter((v) => isMIMEType(v) || isExt(v)).join(",");
    }
    return void 0;
  }
  function isAbort(v) {
    return v instanceof DOMException && (v.name === "AbortError" || v.code === v.ABORT_ERR);
  }
  function isSecurityError(v) {
    return v instanceof DOMException && (v.name === "SecurityError" || v.code === v.SECURITY_ERR);
  }
  function isMIMEType(v) {
    return v === "audio/*" || v === "video/*" || v === "image/*" || v === "text/*" || /\w+\/[-+.\w]+/g.test(v);
  }
  function isExt(v) {
    return /^.*\.[\w]+$/.test(v);
  }

  // ../esmd/npm/@mantine/dropzone@7.13.0/node_modules/.pnpm/react-dropzone-esm@15.0.1_react@18.3.1/node_modules/react-dropzone-esm/dist/esm/index.mjs
  var __defProp2 = Object.defineProperty;
  var __defProps2 = Object.defineProperties;
  var __getOwnPropDescs2 = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
  var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues2 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp2.call(b, prop))
        __defNormalProp2(a, prop, b[prop]);
    if (__getOwnPropSymbols2)
      for (var prop of __getOwnPropSymbols2(b)) {
        if (__propIsEnum2.call(b, prop))
          __defNormalProp2(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps2 = (a, b) => __defProps2(a, __getOwnPropDescs2(b));
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp2.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols2)
      for (var prop of __getOwnPropSymbols2(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum2.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var Dropzone = React.forwardRef((_a, ref) => {
    var _b = _a, { children } = _b, params = __objRest(_b, ["children"]);
    const _a2 = useDropzone(params), { open } = _a2, props = __objRest(_a2, ["open"]);
    React.useImperativeHandle(ref, () => ({ open }), [open]);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, children(__spreadProps2(__spreadValues2({}, props), { open })));
  });
  Dropzone.displayName = "Dropzone";
  var defaultProps = {
    disabled: false,
    getFilesFromEvent: fromEvent,
    maxSize: Infinity,
    minSize: 0,
    multiple: true,
    maxFiles: 0,
    preventDropOnDocument: true,
    noClick: false,
    noKeyboard: false,
    noDrag: false,
    noDragEventsBubbling: false,
    validator: null,
    useFsAccessApi: true,
    autoFocus: false
  };
  Dropzone.defaultProps = defaultProps;
  Dropzone.propTypes = {
    /**
     * Render function that exposes the dropzone state and prop getter fns
     *
     * @param {object} params
     * @param {Function} params.getRootProps Returns the props you should apply to the root drop container you render
     * @param {Function} params.getInputProps Returns the props you should apply to hidden file input you render
     * @param {Function} params.open Open the native file selection dialog
     * @param {boolean} params.isFocused Dropzone area is in focus
     * @param {boolean} params.isFileDialogActive File dialog is opened
     * @param {boolean} params.isDragActive Active drag is in progress
     * @param {boolean} params.isDragAccept Dragged files are accepted
     * @param {boolean} params.isDragReject Some dragged files are rejected
     * @param {File[]} params.acceptedFiles Accepted files
     * @param {FileRejection[]} params.fileRejections Rejected files and why they were rejected
     */
    children: PropTypes.func,
    /**
     * Set accepted file types.
     * Checkout https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker types option for more information.
     * Keep in mind that mime type determination is not reliable across platforms. CSV files,
     * for example, are reported as text/plain under macOS but as application/vnd.ms-excel under
     * Windows. In some cases there might not be a mime type set at all (https://github.com/react-dropzone/react-dropzone/issues/276).
     */
    accept: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
    /**
     * Allow drag 'n' drop (or selection from the file dialog) of multiple files
     */
    multiple: PropTypes.bool,
    /**
     * If false, allow dropped items to take over the current browser window
     */
    preventDropOnDocument: PropTypes.bool,
    /**
     * If true, disables click to open the native file selection dialog
     */
    noClick: PropTypes.bool,
    /**
     * If true, disables SPACE/ENTER to open the native file selection dialog.
     * Note that it also stops tracking the focus state.
     */
    noKeyboard: PropTypes.bool,
    /**
     * If true, disables drag 'n' drop
     */
    noDrag: PropTypes.bool,
    /**
     * If true, stops drag event propagation to parents
     */
    noDragEventsBubbling: PropTypes.bool,
    /**
     * Minimum file size (in bytes)
     */
    minSize: PropTypes.number,
    /**
     * Maximum file size (in bytes)
     */
    maxSize: PropTypes.number,
    /**
     * Maximum accepted number of files
     * The default value is 0 which means there is no limitation to how many files are accepted.
     */
    maxFiles: PropTypes.number,
    /**
     * Enable/disable the dropzone
     */
    disabled: PropTypes.bool,
    /**
     * Use this to provide a custom file aggregator
     *
     * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
     */
    getFilesFromEvent: PropTypes.func,
    /**
     * Cb for when closing the file dialog with no selection
     */
    onFileDialogCancel: PropTypes.func,
    /**
     * Cb for when opening the file dialog
     */
    onFileDialogOpen: PropTypes.func,
    /**
     * Set to true to use the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
     * to open the file picker instead of using an `<input type="file">` click event.
     */
    useFsAccessApi: PropTypes.bool,
    /**
     * Set to true to focus the root element on render
     */
    autoFocus: PropTypes.bool,
    /**
     * Cb for when the `dragenter` event occurs.
     *
     * @param {DragEvent} event
     */
    onDragEnter: PropTypes.func,
    /**
     * Cb for when the `dragleave` event occurs
     *
     * @param {DragEvent} event
     */
    onDragLeave: PropTypes.func,
    /**
     * Cb for when the `dragover` event occurs
     *
     * @param {DragEvent} event
     */
    onDragOver: PropTypes.func,
    /**
     * Cb for when the `drop` event occurs.
     * Note that this callback is invoked after the `getFilesFromEvent` callback is done.
     *
     * Files are accepted or rejected based on the `accept`, `multiple`, `minSize` and `maxSize` props.
     * `accept` must be a valid [MIME type](http://www.iana.org/assignments/media-types/media-types.xhtml) according to [input element specification](https://www.w3.org/wiki/HTML/Elements/input/file) or a valid file extension.
     * If `multiple` is set to false and additional files are dropped,
     * all files besides the first will be rejected.
     * Any file which does not have a size in the [`minSize`, `maxSize`] range, will be rejected as well.
     *
     * Note that the `onDrop` callback will always be invoked regardless if the dropped files were accepted or rejected.
     * If you'd like to react to a specific scenario, use the `onDropAccepted`/`onDropRejected` props.
     *
     * `onDrop` will provide you with an array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File) objects which you can then process and send to a server.
     * For example, with [SuperAgent](https://github.com/visionmedia/superagent) as a http/ajax library:
     *
     * ```js
     * function onDrop(acceptedFiles) {
     *   const req = request.post('/upload')
     *   acceptedFiles.forEach(file => {
     *     req.attach(file.name, file)
     *   })
     *   req.end(callback)
     * }
     * ```
     *
     * @param {File[]} acceptedFiles
     * @param {FileRejection[]} fileRejections
     * @param {(DragEvent|Event)} event A drag event or input change event (if files were selected via the file dialog)
     */
    onDrop: PropTypes.func,
    /**
     * Cb for when the `drop` event occurs.
     * Note that if no files are accepted, this callback is not invoked.
     *
     * @param {File[]} files
     * @param {(DragEvent|Event)} event
     */
    onDropAccepted: PropTypes.func,
    /**
     * Cb for when the `drop` event occurs.
     * Note that if no files are rejected, this callback is not invoked.
     *
     * @param {FileRejection[]} fileRejections
     * @param {(DragEvent|Event)} event
     */
    onDropRejected: PropTypes.func,
    /**
     * Cb for when there's some error from any of the promises.
     *
     * @param {Error} error
     */
    onError: PropTypes.func,
    /**
     * Custom validation function. It must return null if there's no errors.
     * @param {File} file
     * @returns {FileError|FileError[]|null}
     */
    validator: PropTypes.func
  };
  var initialState = {
    isFocused: false,
    isFileDialogActive: false,
    isDragActive: false,
    isDragAccept: false,
    isDragReject: false,
    acceptedFiles: [],
    fileRejections: []
  };
  function useDropzone(props = {}) {
    const {
      accept,
      disabled,
      getFilesFromEvent,
      maxSize,
      minSize,
      multiple,
      maxFiles,
      onDragEnter,
      onDragLeave,
      onDragOver,
      onDrop,
      onDropAccepted,
      onDropRejected,
      onFileDialogCancel,
      onFileDialogOpen,
      useFsAccessApi,
      autoFocus,
      preventDropOnDocument,
      noClick,
      noKeyboard,
      noDrag,
      noDragEventsBubbling,
      onError,
      validator
    } = __spreadValues2(__spreadValues2({}, defaultProps), props);
    const acceptAttr = React.useMemo(() => acceptPropAsAcceptAttr(accept), [accept]);
    const pickerTypes = React.useMemo(() => pickerOptionsFromAccept(accept), [accept]);
    const onFileDialogOpenCb = React.useMemo(
      () => typeof onFileDialogOpen === "function" ? onFileDialogOpen : noop,
      [onFileDialogOpen]
    );
    const onFileDialogCancelCb = React.useMemo(
      () => typeof onFileDialogCancel === "function" ? onFileDialogCancel : noop,
      [onFileDialogCancel]
    );
    const rootRef = React.useRef(null);
    const inputRef = React.useRef(null);
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const { isFocused, isFileDialogActive } = state;
    const fsAccessApiWorksRef = React.useRef(
      typeof window !== "undefined" && window.isSecureContext && useFsAccessApi && canUseFileSystemAccessAPI()
    );
    const onWindowFocus = () => {
      if (!fsAccessApiWorksRef.current && isFileDialogActive) {
        setTimeout(() => {
          if (inputRef.current) {
            const { files } = inputRef.current;
            if (!files.length) {
              dispatch({ type: "closeDialog" });
              onFileDialogCancelCb();
            }
          }
        }, 300);
      }
    };
    React.useEffect(() => {
      window.addEventListener("focus", onWindowFocus, false);
      return () => {
        window.removeEventListener("focus", onWindowFocus, false);
      };
    }, [inputRef, isFileDialogActive, onFileDialogCancelCb, fsAccessApiWorksRef]);
    const dragTargetsRef = React.useRef([]);
    const onDocumentDrop = (event) => {
      if (rootRef.current && rootRef.current.contains(event.target)) {
        return;
      }
      event.preventDefault();
      dragTargetsRef.current = [];
    };
    React.useEffect(() => {
      if (preventDropOnDocument) {
        document.addEventListener("dragover", onDocumentDragOver, false);
        document.addEventListener("drop", onDocumentDrop, false);
      }
      return () => {
        if (preventDropOnDocument) {
          document.removeEventListener("dragover", onDocumentDragOver);
          document.removeEventListener("drop", onDocumentDrop);
        }
      };
    }, [rootRef, preventDropOnDocument]);
    React.useEffect(() => {
      if (!disabled && autoFocus && rootRef.current) {
        rootRef.current.focus();
      }
      return () => {
      };
    }, [rootRef, autoFocus, disabled]);
    const onErrCb = React.useCallback(
      (e) => {
        if (onError) {
          onError(e);
        } else {
          console.error(e);
        }
      },
      [onError]
    );
    const onDragEnterCb = React.useCallback(
      (event) => {
        event.preventDefault();
        event.persist();
        stopPropagation(event);
        dragTargetsRef.current = [...dragTargetsRef.current, event.target];
        if (isEvtWithFiles(event)) {
          Promise.resolve(getFilesFromEvent(event)).then((files) => {
            if (isPropagationStopped(event) && !noDragEventsBubbling) {
              return;
            }
            const fileCount = files.length;
            const isDragAccept = fileCount > 0 && allFilesAccepted({
              files,
              accept: acceptAttr,
              minSize,
              maxSize,
              multiple,
              maxFiles,
              validator
            });
            const isDragReject = fileCount > 0 && !isDragAccept;
            dispatch({
              isDragAccept,
              isDragReject,
              isDragActive: true,
              type: "setDraggedFiles"
            });
            if (onDragEnter) {
              onDragEnter(event);
            }
          }).catch((e) => onErrCb(e));
        }
      },
      [
        getFilesFromEvent,
        onDragEnter,
        onErrCb,
        noDragEventsBubbling,
        acceptAttr,
        minSize,
        maxSize,
        multiple,
        maxFiles,
        validator
      ]
    );
    const onDragOverCb = React.useCallback(
      (event) => {
        event.preventDefault();
        event.persist();
        stopPropagation(event);
        const hasFiles = isEvtWithFiles(event);
        if (hasFiles && event.dataTransfer) {
          try {
            event.dataTransfer.dropEffect = "copy";
          } catch (e) {
          }
        }
        if (hasFiles && onDragOver) {
          onDragOver(event);
        }
        return false;
      },
      [onDragOver, noDragEventsBubbling]
    );
    const onDragLeaveCb = React.useCallback(
      (event) => {
        event.preventDefault();
        event.persist();
        stopPropagation(event);
        const targets = dragTargetsRef.current.filter(
          (target) => rootRef.current && rootRef.current.contains(target)
        );
        const targetIdx = targets.indexOf(event.target);
        if (targetIdx !== -1) {
          targets.splice(targetIdx, 1);
        }
        dragTargetsRef.current = targets;
        if (targets.length > 0) {
          return;
        }
        dispatch({
          type: "setDraggedFiles",
          isDragActive: false,
          isDragAccept: false,
          isDragReject: false
        });
        if (isEvtWithFiles(event) && onDragLeave) {
          onDragLeave(event);
        }
      },
      [rootRef, onDragLeave, noDragEventsBubbling]
    );
    const setFiles = React.useCallback(
      (files, event) => {
        const acceptedFiles = [];
        const fileRejections = [];
        files.forEach((file) => {
          const [accepted, acceptError] = fileAccepted(file, acceptAttr);
          const [sizeMatch, sizeError] = fileMatchSize(file, minSize, maxSize);
          const customErrors = validator ? validator(file) : null;
          if (accepted && sizeMatch && !customErrors) {
            acceptedFiles.push(file);
          } else {
            let errors = [acceptError, sizeError];
            if (customErrors) {
              errors = errors.concat(customErrors);
            }
            fileRejections.push({ file, errors: errors.filter((e) => e) });
          }
        });
        if (!multiple && acceptedFiles.length > 1 || multiple && maxFiles >= 1 && acceptedFiles.length > maxFiles) {
          acceptedFiles.forEach((file) => {
            fileRejections.push({ file, errors: [TOO_MANY_FILES_REJECTION] });
          });
          acceptedFiles.splice(0);
        }
        dispatch({
          acceptedFiles,
          fileRejections,
          type: "setFiles"
        });
        if (onDrop) {
          onDrop(acceptedFiles, fileRejections, event);
        }
        if (fileRejections.length > 0 && onDropRejected) {
          onDropRejected(fileRejections, event);
        }
        if (acceptedFiles.length > 0 && onDropAccepted) {
          onDropAccepted(acceptedFiles, event);
        }
      },
      [
        dispatch,
        multiple,
        acceptAttr,
        minSize,
        maxSize,
        maxFiles,
        onDrop,
        onDropAccepted,
        onDropRejected,
        validator
      ]
    );
    const onDropCb = React.useCallback(
      (event) => {
        event.preventDefault();
        event.persist();
        stopPropagation(event);
        dragTargetsRef.current = [];
        if (isEvtWithFiles(event)) {
          Promise.resolve(getFilesFromEvent(event)).then((files) => {
            if (isPropagationStopped(event) && !noDragEventsBubbling) {
              return;
            }
            setFiles(files, event);
          }).catch((e) => onErrCb(e));
        }
        dispatch({ type: "reset" });
      },
      [getFilesFromEvent, setFiles, onErrCb, noDragEventsBubbling]
    );
    const openFileDialog = React.useCallback(() => {
      if (fsAccessApiWorksRef.current) {
        dispatch({ type: "openDialog" });
        onFileDialogOpenCb();
        const opts = {
          multiple,
          types: pickerTypes
        };
        window.showOpenFilePicker(opts).then((handles) => getFilesFromEvent(handles)).then((files) => {
          setFiles(files, null);
          dispatch({ type: "closeDialog" });
        }).catch((e) => {
          if (isAbort(e)) {
            onFileDialogCancelCb(e);
            dispatch({ type: "closeDialog" });
          } else if (isSecurityError(e)) {
            fsAccessApiWorksRef.current = false;
            if (inputRef.current) {
              inputRef.current.value = null;
              inputRef.current.click();
            } else {
              onErrCb(
                new Error(
                  "Cannot open the file picker because the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API is not supported and no <input> was provided."
                )
              );
            }
          } else {
            onErrCb(e);
          }
        });
        return;
      }
      if (inputRef.current) {
        dispatch({ type: "openDialog" });
        onFileDialogOpenCb();
        inputRef.current.value = null;
        inputRef.current.click();
      }
    }, [
      dispatch,
      onFileDialogOpenCb,
      onFileDialogCancelCb,
      useFsAccessApi,
      setFiles,
      onErrCb,
      pickerTypes,
      multiple
    ]);
    const onKeyDownCb = React.useCallback(
      (event) => {
        if (!rootRef.current || !rootRef.current.isEqualNode(event.target)) {
          return;
        }
        if (event.key === " " || event.key === "Enter" || event.keyCode === 32 || event.keyCode === 13) {
          event.preventDefault();
          openFileDialog();
        }
      },
      [rootRef, openFileDialog]
    );
    const onFocusCb = React.useCallback(() => {
      dispatch({ type: "focus" });
    }, []);
    const onBlurCb = React.useCallback(() => {
      dispatch({ type: "blur" });
    }, []);
    const onClickCb = React.useCallback(() => {
      if (noClick) {
        return;
      }
      if (isIeOrEdge()) {
        setTimeout(openFileDialog, 0);
      } else {
        openFileDialog();
      }
    }, [noClick, openFileDialog]);
    const composeHandler = (fn) => {
      return disabled ? null : fn;
    };
    const composeKeyboardHandler = (fn) => {
      return noKeyboard ? null : composeHandler(fn);
    };
    const composeDragHandler = (fn) => {
      return noDrag ? null : composeHandler(fn);
    };
    const stopPropagation = (event) => {
      if (noDragEventsBubbling) {
        event.stopPropagation();
      }
    };
    const getRootProps = React.useMemo(
      () => (_a = {}) => {
        var _b = _a, {
          refKey = "ref",
          role,
          onKeyDown,
          onFocus,
          onBlur,
          onClick,
          onDragEnter: onDragEnter2,
          onDragOver: onDragOver2,
          onDragLeave: onDragLeave2,
          onDrop: onDrop2
        } = _b, rest = __objRest(_b, [
          "refKey",
          "role",
          "onKeyDown",
          "onFocus",
          "onBlur",
          "onClick",
          "onDragEnter",
          "onDragOver",
          "onDragLeave",
          "onDrop"
        ]);
        return __spreadValues2(__spreadValues2({
          onKeyDown: composeKeyboardHandler(
            composeEventHandlers(onKeyDown, onKeyDownCb)
          ),
          onFocus: composeKeyboardHandler(
            composeEventHandlers(onFocus, onFocusCb)
          ),
          onBlur: composeKeyboardHandler(composeEventHandlers(onBlur, onBlurCb)),
          onClick: composeHandler(composeEventHandlers(onClick, onClickCb)),
          onDragEnter: composeDragHandler(
            composeEventHandlers(onDragEnter2, onDragEnterCb)
          ),
          onDragOver: composeDragHandler(
            composeEventHandlers(onDragOver2, onDragOverCb)
          ),
          onDragLeave: composeDragHandler(
            composeEventHandlers(onDragLeave2, onDragLeaveCb)
          ),
          onDrop: composeDragHandler(composeEventHandlers(onDrop2, onDropCb)),
          role: typeof role === "string" && role !== "" ? role : "presentation",
          [refKey]: rootRef
        }, !disabled && !noKeyboard ? { tabIndex: 0 } : {}), rest);
      },
      [
        rootRef,
        onKeyDownCb,
        onFocusCb,
        onBlurCb,
        onClickCb,
        onDragEnterCb,
        onDragOverCb,
        onDragLeaveCb,
        onDropCb,
        noKeyboard,
        noDrag,
        disabled
      ]
    );
    const onInputElementClick = React.useCallback((event) => {
      event.stopPropagation();
    }, []);
    const getInputProps = React.useMemo(
      () => (_a = {}) => {
        var _b = _a, { refKey = "ref", onChange, onClick } = _b, rest = __objRest(_b, ["refKey", "onChange", "onClick"]);
        const inputProps = {
          accept: acceptAttr,
          multiple,
          type: "file",
          style: { display: "none" },
          onChange: composeHandler(composeEventHandlers(onChange, onDropCb)),
          onClick: composeHandler(
            composeEventHandlers(onClick, onInputElementClick)
          ),
          tabIndex: -1,
          [refKey]: inputRef
        };
        return __spreadValues2(__spreadValues2({}, inputProps), rest);
      },
      [inputRef, accept, multiple, onDropCb, disabled]
    );
    return __spreadProps2(__spreadValues2({}, state), {
      isFocused: isFocused && !disabled,
      getRootProps,
      getInputProps,
      rootRef,
      inputRef,
      open: composeHandler(openFileDialog)
    });
  }
  function reducer(state, action) {
    switch (action.type) {
      case "focus":
        return __spreadProps2(__spreadValues2({}, state), {
          isFocused: true
        });
      case "blur":
        return __spreadProps2(__spreadValues2({}, state), {
          isFocused: false
        });
      case "openDialog":
        return __spreadProps2(__spreadValues2({}, initialState), {
          isFileDialogActive: true
        });
      case "closeDialog":
        return __spreadProps2(__spreadValues2({}, state), {
          isFileDialogActive: false
        });
      case "setDraggedFiles":
        return __spreadProps2(__spreadValues2({}, state), {
          isDragActive: action.isDragActive,
          isDragAccept: action.isDragAccept,
          isDragReject: action.isDragReject
        });
      case "setFiles":
        return __spreadProps2(__spreadValues2({}, state), {
          acceptedFiles: action.acceptedFiles,
          fileRejections: action.fileRejections
        });
      case "reset":
        return __spreadValues2({}, initialState);
      default:
        return state;
    }
  }
  function noop() {
  }
  var [DropzoneProvider, useDropzoneContext] = core.createSafeContext(
    "Dropzone component was not found in tree"
  );
  function createDropzoneStatus(status) {
    const Component = (props) => {
      const { children, ...others } = core.useProps(`Dropzone${hooks.upperFirst(status)}`, {}, props);
      const ctx = useDropzoneContext();
      const _children = core.isElement(children) ? children : /* @__PURE__ */ jsxRuntime.jsx("span", { children });
      if (ctx[status]) {
        return React.cloneElement(_children, others);
      }
      return null;
    };
    Component.displayName = `@mantine/dropzone/${hooks.upperFirst(status)}`;
    return Component;
  }
  var DropzoneAccept = createDropzoneStatus("accept");
  var DropzoneReject = createDropzoneStatus("reject");
  var DropzoneIdle = createDropzoneStatus("idle");

  // ../esmd/npm/@mantine/dropzone@7.13.0/node_modules/.pnpm/@mantine+dropzone@7.13.0_@mantine+core@7.13.0_@mantine+hooks@7.13.0_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dropzone/esm/Dropzone.module.css.mjs
  var classes = { "root": "m_d46a4834", "inner": "m_b85f7144", "fullScreen": "m_96f6e9ad", "dropzone": "m_7946116d" };

  // ../esmd/npm/@mantine/dropzone@7.13.0/node_modules/.pnpm/@mantine+dropzone@7.13.0_@mantine+core@7.13.0_@mantine+hooks@7.13.0_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dropzone/esm/Dropzone.mjs
  var defaultProps2 = {
    loading: false,
    multiple: true,
    maxSize: Infinity,
    autoFocus: false,
    activateOnClick: true,
    activateOnDrag: true,
    dragEventsBubbling: true,
    activateOnKeyboard: true,
    useFsAccessApi: true,
    variant: "light",
    rejectColor: "red"
  };
  var varsResolver = core.createVarsResolver(
    (theme, { radius, variant, acceptColor, rejectColor }) => {
      const acceptColors = theme.variantColorResolver({
        color: acceptColor || theme.primaryColor,
        theme,
        variant
      });
      const rejectColors = theme.variantColorResolver({
        color: rejectColor || "red",
        theme,
        variant
      });
      return {
        root: {
          "--dropzone-radius": core.getRadius(radius),
          "--dropzone-accept-color": acceptColors.color,
          "--dropzone-accept-bg": acceptColors.background,
          "--dropzone-reject-color": rejectColors.color,
          "--dropzone-reject-bg": rejectColors.background
        }
      };
    }
  );
  var Dropzone2 = core.factory((_props, ref) => {
    const props = core.useProps("Dropzone", defaultProps2, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      radius,
      disabled,
      loading,
      multiple,
      maxSize,
      accept,
      children,
      onDropAny,
      onDrop,
      onReject,
      openRef,
      name,
      maxFiles,
      autoFocus,
      activateOnClick,
      activateOnDrag,
      dragEventsBubbling,
      activateOnKeyboard,
      onDragEnter,
      onDragLeave,
      onDragOver,
      onFileDialogCancel,
      onFileDialogOpen,
      preventDropOnDocument,
      useFsAccessApi,
      getFilesFromEvent,
      validator,
      rejectColor,
      acceptColor,
      enablePointerEvents,
      loaderProps,
      inputProps,
      mod,
      ...others
    } = props;
    const getStyles = core.useStyles({
      name: "Dropzone",
      classes,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      vars,
      varsResolver
    });
    const { getRootProps, getInputProps, isDragAccept, isDragReject, open } = useDropzone({
      onDrop: onDropAny,
      onDropAccepted: onDrop,
      onDropRejected: onReject,
      disabled: disabled || loading,
      accept: Array.isArray(accept) ? accept.reduce((r, key) => ({ ...r, [key]: [] }), {}) : accept,
      multiple,
      maxSize,
      maxFiles,
      autoFocus,
      noClick: !activateOnClick,
      noDrag: !activateOnDrag,
      noDragEventsBubbling: !dragEventsBubbling,
      noKeyboard: !activateOnKeyboard,
      onDragEnter,
      onDragLeave,
      onDragOver,
      onFileDialogCancel,
      onFileDialogOpen,
      preventDropOnDocument,
      useFsAccessApi,
      validator,
      ...getFilesFromEvent ? { getFilesFromEvent } : null
    });
    hooks.assignRef(openRef, open);
    const isIdle = !isDragAccept && !isDragReject;
    return /* @__PURE__ */ jsxRuntime.jsx(DropzoneProvider, { value: { accept: isDragAccept, reject: isDragReject, idle: isIdle }, children: /* @__PURE__ */ jsxRuntime.jsxs(
      core.Box,
      {
        ...getRootProps(),
        ...getStyles("root", { focusable: true }),
        ...others,
        mod: [
          {
            accept: isDragAccept,
            reject: isDragReject,
            idle: isIdle,
            loading,
            "activate-on-click": activateOnClick
          },
          mod
        ],
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            core.LoadingOverlay,
            {
              visible: loading,
              overlayProps: { radius },
              unstyled,
              loaderProps
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx("input", { ...getInputProps(inputProps), name }),
          /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              ...getStyles("inner"),
              ref,
              "data-enable-pointer-events": enablePointerEvents || void 0,
              children
            }
          )
        ]
      }
    ) });
  });
  Dropzone2.classes = classes;
  Dropzone2.displayName = "@mantine/dropzone/Dropzone";
  Dropzone2.Accept = DropzoneAccept;
  Dropzone2.Idle = DropzoneIdle;
  Dropzone2.Reject = DropzoneReject;
  var defaultProps3 = {
    loading: false,
    maxSize: Infinity,
    activateOnClick: false,
    activateOnDrag: true,
    dragEventsBubbling: true,
    activateOnKeyboard: true,
    active: true,
    zIndex: core.getDefaultZIndex("max"),
    withinPortal: true
  };
  var DropzoneFullScreen = core.factory((_props, ref) => {
    const props = core.useProps("DropzoneFullScreen", defaultProps3, _props);
    const {
      classNames,
      className,
      style,
      styles,
      unstyled,
      vars,
      active,
      onDrop,
      onReject,
      zIndex,
      withinPortal,
      portalProps,
      ...others
    } = props;
    const getStyles = core.useStyles({
      name: "DropzoneFullScreen",
      classes,
      props,
      className,
      style,
      classNames,
      styles,
      unstyled,
      rootSelector: "fullScreen"
    });
    const { resolvedClassNames, resolvedStyles } = core.useResolvedStylesApi({
      classNames,
      styles,
      props
    });
    const [counter, setCounter] = React.useState(0);
    const [visible, { open, close }] = hooks.useDisclosure(false);
    const handleDragEnter = (event) => {
      if (event.dataTransfer?.types.includes("Files")) {
        setCounter((prev) => prev + 1);
        open();
      }
    };
    const handleDragLeave = () => {
      setCounter((prev) => prev - 1);
    };
    React.useEffect(() => {
      counter === 0 && close();
    }, [counter]);
    React.useEffect(() => {
      if (!active) {
        return void 0;
      }
      document.addEventListener("dragenter", handleDragEnter, false);
      document.addEventListener("dragleave", handleDragLeave, false);
      return () => {
        document.removeEventListener("dragenter", handleDragEnter, false);
        document.removeEventListener("dragleave", handleDragLeave, false);
      };
    }, [active]);
    return /* @__PURE__ */ jsxRuntime.jsx(core.OptionalPortal, { ...portalProps, withinPortal, children: /* @__PURE__ */ jsxRuntime.jsx(
      core.Box,
      {
        ...getStyles("fullScreen", {
          style: { opacity: visible ? 1 : 0, pointerEvents: visible ? "all" : "none", zIndex }
        }),
        ref,
        children: /* @__PURE__ */ jsxRuntime.jsx(
          Dropzone2,
          {
            ...others,
            classNames: resolvedClassNames,
            styles: resolvedStyles,
            unstyled,
            className: classes.dropzone,
            onDrop: (files) => {
              onDrop?.(files);
              close();
              setCounter(0);
            },
            onReject: (files) => {
              onReject?.(files);
              close();
              setCounter(0);
            }
          }
        )
      }
    ) });
  });
  DropzoneFullScreen.classes = classes;
  DropzoneFullScreen.displayName = "@mantine/dropzone/DropzoneFullScreen";

  // ../esmd/npm/@mantine/dropzone@7.13.0/node_modules/.pnpm/@mantine+dropzone@7.13.0_@mantine+core@7.13.0_@mantine+hooks@7.13.0_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dropzone/esm/mime-types.mjs
  var MIME_TYPES = {
    // Images
    png: "image/png",
    gif: "image/gif",
    jpeg: "image/jpeg",
    svg: "image/svg+xml",
    webp: "image/webp",
    avif: "image/avif",
    heic: "image/heic",
    // Documents
    mp4: "video/mp4",
    zip: "application/zip",
    rar: "application/x-rar",
    "7z": "application/x-7z-compressed",
    csv: "text/csv",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    exe: "application/vnd.microsoft.portable-executable"
  };
  var IMAGE_MIME_TYPE = [
    MIME_TYPES.png,
    MIME_TYPES.gif,
    MIME_TYPES.jpeg,
    MIME_TYPES.svg,
    MIME_TYPES.webp,
    MIME_TYPES.avif,
    MIME_TYPES.heic
  ];
  var PDF_MIME_TYPE = [MIME_TYPES.pdf];
  var MS_WORD_MIME_TYPE = [MIME_TYPES.doc, MIME_TYPES.docx];
  var MS_EXCEL_MIME_TYPE = [MIME_TYPES.xls, MIME_TYPES.xlsx];
  var MS_POWERPOINT_MIME_TYPE = [MIME_TYPES.ppt, MIME_TYPES.pptx];
  var EXE_MIME_TYPE = [MIME_TYPES.exe];

  // ../esmd/npm/@mantine/dropzone@7.13.0/node_modules/.pnpm/@mantine+dropzone@7.13.0_@mantine+core@7.13.0_@mantine+hooks@7.13.0_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/dropzone/esm/index.mjs
  Dropzone2.FullScreen = DropzoneFullScreen;
  var Dropzone3 = Dropzone2;

  exports.Dropzone = Dropzone3;
  exports.DropzoneAccept = DropzoneAccept;
  exports.DropzoneFullScreen = DropzoneFullScreen;
  exports.DropzoneIdle = DropzoneIdle;
  exports.DropzoneReject = DropzoneReject;
  exports.EXE_MIME_TYPE = EXE_MIME_TYPE;
  exports.IMAGE_MIME_TYPE = IMAGE_MIME_TYPE;
  exports.MIME_TYPES = MIME_TYPES;
  exports.MS_EXCEL_MIME_TYPE = MS_EXCEL_MIME_TYPE;
  exports.MS_POWERPOINT_MIME_TYPE = MS_POWERPOINT_MIME_TYPE;
  exports.MS_WORD_MIME_TYPE = MS_WORD_MIME_TYPE;
  exports.PDF_MIME_TYPE = PDF_MIME_TYPE;

}));