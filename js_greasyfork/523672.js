// ==UserScript==
// @name			Webpack Hacks
// @namespace		xuyiming.open@outlook.com
// @description		__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
// @author			xymopen
// @version			1.0.0
// @grant			none
// @license			BSD-3-Clause
// ==/UserScript==

const WebpackHacks = {
	RequireProperties: Object.freeze({
		/** the bundle public path */
		publicPath: "p",

		/** the module id of the entry point */
		entryModuleId: "s",

		/** the module cache */
		moduleCache: "c",

		/** the module functions */
		moduleFactories: "m",

		/** the chunk ensure function */
		ensureChunk: "e",

		/** an object with handlers to ensure a chunk */
		ensureChunkHandlers: "f",

		/** the chunk prefetch function */
		prefetchChunk: "E",

		/** an object with handlers to prefetch a chunk */
		prefetchChunkHandlers: "F",

		/** the chunk preload function */
		preloadChunk: "G",

		/** an object with handlers to preload a chunk */
		preloadChunkHandlers: "H",

		/** the exported property define getters function */
		definePropertyGetters: "d",

		/** define compatibility on export */
		makeNamespaceObject: "r",

		/** create a fake namespace object */
		createFakeNamespaceObject: "t",

		/** compatibility get default export */
		compatGetDefaultExport: "n",

		/** harmony module decorator */
		harmonyModuleDecorator: "hmd",

		/** node.js module decorator */
		nodeModuleDecorator: "nmd",

		/** the webpack hash */
		getFullHash: "h",

		/** an object containing all installed WebAssembly.Instance export objects keyed by module id */
		wasmInstances: "w",

		/** instantiate a wasm instance from module exports object, id, hash and importsObject */
		instantiateWasm: "v",

		/** the uncaught error handler for the webpack runtime */
		uncaughtErrorHandler: "oe",

		/** the script nonce */
		scriptNonce: "nc",

		/**
		 * function to load a script tag.
		 * Arguments: (url: string, done: (event) => void), key?: string | number, chunkId?: string | number) => void
		 * done function is called when loading has finished or timeout occurred.
		 * It will attach to existing script tags with data-webpack == uniqueName + ":" + key or src == url.
		 */
		loadScript: "l",

		/**
		 * function to promote a string to a TrustedScript using webpack's Trusted
		 * Types policy
		 * Arguments: (script: string) => TrustedScript
		 */
		createScript: "ts",

		/**
		 * function to promote a string to a TrustedScriptURL using webpack's Trusted
		 * Types policy
		 * Arguments: (url: string) => TrustedScriptURL
		 */
		createScriptUrl: "tu",

		/**
		 * function to return webpack's Trusted Types policy
		 * Arguments: () => TrustedTypePolicy
		 */
		getTrustedTypesPolicy: "tt",

		/** the chunk name of the chunk with the runtime */
		chunkName: "cn",

		/** the runtime id of the current runtime */
		runtimeId: "j",

		/** the filename of the script part of the chunk */
		getChunkScriptFilename: "u",

		/** the filename of the css part of the chunk */
		getChunkCssFilename: "k",

		/** the filename of the script part of the hot update chunk */
		getChunkUpdateScriptFilename: "hu",

		/** the filename of the css part of the hot update chunk */
		getChunkUpdateCssFilename: "hk",

		/**
		 * startup signal from runtime
		 * This will be called when the runtime chunk has been loaded.
		 */
		startup: "x",

		/**
		 * method to startup an entrypoint with needed chunks.
		 * Signature: (moduleId: Id, chunkIds: Id[]) => any.
		 * Returns the exports of the module or a Promise
		 */
		startupEntrypoint: "X",

		/**
		 * register deferred code, which will run when certain
		 * chunks are loaded.
		 * Signature: (chunkIds: Id[], fn: () => any, priority: int >= 0 = 0) => any
		 * Returned value will be returned directly when all chunks are already loaded
		 * When (priority & 1) it will wait for all other handlers with lower priority to
		 * be executed before itself is executed
		 */
		onChunksLoaded: "O",

		/**
		 * method to install a chunk that was loaded somehow
		 * Signature: ({ id, ids, modules, runtime }) => void
		 */
		externalInstallChunk: "C",

		/** interceptor for module executions */
		interceptModuleExecution: "i",

		/** the global object */
		global: "g",

		/** an object with all share scopes */
		shareScopeMap: "S",

		/**
		 * The sharing init sequence function (only runs once per share scope).
		 * Has one argument, the name of the share scope.
		 * Creates a share scope if not existing
		 */
		initializeSharing: "I",

		/** The current scope when getting a module from a remote */
		currentRemoteGetScope: "R",

		/** the filename of the HMR manifest */
		getUpdateManifestFilename: "hmrF",

		/** function downloading the update manifest */
		hmrDownloadManifest: "hmrM",

		/** array with handler functions to download chunk updates */
		hmrDownloadUpdateHandlers: "hmrC",

		/** object with all hmr module data for all modules */
		hmrModuleData: "hmrD",

		/** array with handler functions when a module should be invalidated */
		hmrInvalidateModuleHandlers: "hmrI",

		/** the prefix for storing state of runtime modules when hmr is enabled */
		hmrRuntimeStatePrefix: "hmrS",

		/** the AMD define function */
		amdDefine: "amdD",

		/** the AMD options */
		amdOptions: "amdO",

		/** the System polyfill object */
		system: "System",

		/**
		 * the shorthand for Object.prototype.hasOwnProperty
		 * using of it decreases the compiled bundle size
		 */
		hasOwnProperty: "o",

		/** the System.register context object */
		systemContext: "y",

		/** the baseURI of current document */
		baseURI: "b",

		/** a RelativeURL class when relative URLs are used */
		relativeUrl: "U",

		/**
		 * Creates an async module. The body function must be a async function.
		 * "module.exports" will be decorated with an AsyncModulePromise.
		 * The body function will be called.
		 * To handle async dependencies correctly do this: "([a, b, c] = await handleDependencies([a, b, c]));".
		 * If "hasAwaitAfterDependencies" is truthy, "handleDependencies()" must be called at the end of the body function.
		 * Signature: function(
		 * module: Module,
		 * body: (handleDependencies: (deps: AsyncModulePromise[]) => Promise<any[]> & () => void,
		 * hasAwaitAfterDependencies?: boolean
		 * ) => void
		 */
		asyncModule: "a",
	}),

	/**
	 * @param {string} chunkLoadingGlobal
	 */
	interceptChunkLoading: (unsafeWindow, chunkLoadingGlobal, callback) => {
		/** @type {WebpackChunk[]} */
		const webpackChunk = unsafeWindow[chunkLoadingGlobal];
		let webpackChunkLoading = null;
		let proto = null;

		function onChunksLoaded(...args) {
			callback(...args);
			return webpackChunkLoading.apply(this, args);
		};

		if (Object.hasOwn(webpackChunk, "push")) {
			// We are called after runtime initializing
			webpackChunkLoading = webpackChunk.push;
			webpackChunk.push = onChunksLoaded;
		} else {
			// We are called before runtime initializing
			proto = Object.getPrototypeOf(webpackChunk);
			Object.setPrototypeOf(webpackChunk, Object.create(proto, Object.getOwnPropertyDescriptors({
				get push() {
					return proto.push;
				},
				set push(value) {
					Object.setPrototypeOf(webpackChunk, proto);
					proto = null;

					webpackChunkLoading = value;
					webpackChunk.push = onChunksLoaded;
				}
			})));
		}

		return () => {
			if (webpackChunkLoading !== null) {
				webpackChunk.push = webpackChunkLoading;
			} else if (proto !== null) {
				Object.setPrototypeOf(webpackChunk, proto);
			}
		};
	},

	/** 
	 * @param {string} chunkLoadingGlobal
	 * @param {PropertyKey} chunkId
	 * @param {WebpackRuntimeChunkCallback} callback
	 */
	loadFakeChink: (unsafeWindow, chunkLoadingGlobal, chunkId, callback) => {
		/** @type {WebpackChunk[]} */
		let webpackChunk;

		if (Object.hasOwn(unsafeWindow, chunkLoadingGlobal)) {
			webpackChunk = unsafeWindow[chunkLoadingGlobal];
		} else {
			webpackChunk = unsafeWindow[chunkLoadingGlobal] = [];
		}

		const fakeChunk = [[chunkId], [], (__webpack_require__) => {
			// Based on `APIPlugin` and `RuntimeGlobals`
			const {
				p: __webpack_public_path__,
				b: __webpack_base_uri__,
				m: __webpack_modules__,
				e: __webpack_chunk_load__,
				nc: __webpack_nonce__,
				cn: __webpack_chunkname__,
				u: __webpack_get_script_filename__,
				j: __webpack_runtime_id__,
				y: __system_context__,
				S: __webpack_share_scopes__,
				I: __webpack_init_sharing__,
			} = __webpack_require__;
			const __webpack_hash__ = __webpack_require__.h?.();
			callback({
				__webpack_require__,
				__webpack_public_path__,
				__webpack_base_uri__,
				__webpack_modules__,
				__webpack_chunk_load__,
				__webpack_nonce__,
				__webpack_chunkname__,
				__webpack_get_script_filename__,
				__webpack_runtime_id__,
				__system_context__,
				__webpack_share_scopes__,
				__webpack_init_sharing__,
				__webpack_hash__,
			});
			Promise.resolve().then(() => {
				const i = webpackChunk.indexOf(fakeChunk);

				if (i >= 0) {
					webpackChunk.splice(i, 1);
				}
			});
		}];

		webpackChunk.push(fakeChunk);
	},
};

/**
 * @typedef WebpackRuntimeContext
 * @property {string} __webpack_require__ - the internal require function
 * @property {string} __webpack_public_path__ - the bundle public path
 * @property {string} __webpack_base_uri__ - the baseURI of current document
 * @property {() => any[]} __webpack_modules__ - the module functions
 * @property {string} __webpack_chunk_load__ - the chunk ensure function
 * @property {string} __webpack_nonce__ - the script nonce
 * @property {string} __webpack_chunkname__ - the chunk name of the chunk with the runtime
 * @property {string} __webpack_get_script_filename__ - the filename of the script part of the chunk
 * @property {string} __webpack_runtime_id__ - the runtime id of the current runtime
 * @property {string} __system_context__ - the System.register context object
 * @property {string} __webpack_share_scopes__ - an object with all share scopes
 * @property {string} __webpack_init_sharing__ - The sharing init sequence function (only runs once per share scope).
 * 	Has one argument, the name of the share scope.
 * 	Creates a share scope if not existing
 * @property {string} [__webpack_hash__] - the webpack hash
 */

/**
 * @callback WebpackRuntimeChunkCallback
 * @param {WebpackRuntimeContext} context
 */

/**
 * @typedef {[chunkIds: string[], moreModules: Record<string, () => void>, runtime?: () => void]} WebpackChunk
 */