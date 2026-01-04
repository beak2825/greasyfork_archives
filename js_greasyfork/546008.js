((e, t, o, r, n, i) => {
	const s = {
		script: {},
		scriptHandler: "GMforPDA version 2.2",
		version: 2.2,
	};
	function a(e, t) {
		if (!e) throw new TypeError("No key supplied to GM_getValue");
		const o = i.getItem(e);
		return "string" != typeof o
			? t
			: o.startsWith("GMV2_")
			? JSON.parse(o.slice(5)) ?? t
			: o ?? t;
	}
	function l(e, t) {
		if (!e) throw new TypeError("No key supplied to GM_setValue");
		i.setItem(e, "GMV2_" + JSON.stringify(t));
	}
	function u(e) {
		if (!e) throw new TypeError("No key supplied to GM_deleteValue");
		i.removeItem(e);
	}
	function c() {
		return t.keys(i);
	}
	function d(e) {
		if (!e || "string" != typeof e) return;
		const t = document.createElement("style");
		(t.type = "text/css"), (t.innerHTML = e), document.head.appendChild(t);
	}
	function p(...e) {
		if ("object" == typeof e[0]) {
			const { text: o, title: r, onclick: n, ondone: i } = e[0];
			t(o, r, n, i);
		} else if ("string" == typeof e[0]) {
			const [o, r, , n] = e;
			t(o, r, n);
		}
		return { remove: () => {} };
		function t(e, t, o, r) {
			if (!e)
				throw new TypeError(
					"No notification text supplied to GM_notification"
				);
			confirm(`${t ?? "No title specified"}\n${e}`) && o?.(), r?.();
		}
	}
	function f(e) {
		if (!e) throw new TypeError("No text supplied to GM_setClipboard");
		navigator.clipboard.writeText(e);
	}
	const w = {
		version: 2.2,
		info: s,
		addStyle: d,
		deleteValue: async (e) => u(e),
		getValue: async (e, t) => a(e, t),
		listValues: async () => c(),
		notification: p,
		setClipboard: f,
		setValue: async (e, t) => l(e, t),
		xmlHttpRequest: async (e) => {
			if (!e || "object" != typeof e)
				throw new TypeError(
					"Invalid details passed to GM.xmlHttpRequest"
				);
			const { abortController: t, prom: o } = y(e);
			return (o.abort = () => t.abort()), o;
		},
	};
	function y(e) {
		const t = new r(),
			i = t.signal,
			s = new r(),
			a = s.signal,
			{
				url: l,
				method: u,
				headers: c,
				timeout: d,
				data: p,
				onabort: f,
				onerror: w,
				onload: y,
				onloadend: h,
				onprogress: b,
				onreadystatechange: m,
				ontimeout: M,
			} = e;
		setTimeout(() => s.abort(), d ?? 3e4);
		return {
			abortController: t,
			prom: new n(async (e, t) => {
				try {
					l || t("No URL supplied"),
						i.addEventListener("abort", () => t("Request aborted")),
						a.addEventListener("abort", () =>
							t("Request timed out")
						),
						u && "post" === u.toLowerCase()
							? (PDA_httpPost(l, c ?? {}, p ?? "")
									.then(e)
									.catch(t),
							  b?.())
							: (PDA_httpGet(l).then(e).catch(t), b?.());
				} catch (e) {
					t(e);
				}
			})
				.then((e) => (y?.(e), h?.(e), m?.(e), e))
				.catch((e) => {
					switch (!0) {
						case "Request aborted" === e:
							if (
								((e = new o("Request aborted", "AbortError")),
								f)
							)
								return f(e);
							if (w) return w(e);
							throw e;
						case "Request timed out" === e:
							if (
								((e = new o(
									"Request timed out",
									"TimeoutError"
								)),
								M)
							)
								return M(e);
							if (w) return w(e);
							throw e;
						case "No URL supplied" === e:
							if (
								((e = new TypeError(
									"Failed to fetch: No URL supplied"
								)),
								w)
							)
								return w(e);
							throw e;
						default:
							if (
								((e && e instanceof Error) ||
									(e = new Error(e ?? "Unknown Error")),
								w)
							)
								return w(e);
							throw e;
					}
				}),
		};
	}
	t.entries({
		GM: t.freeze(w),
		GM_info: t.freeze(s),
		GM_getValue: a,
		GM_setValue: l,
		GM_deleteValue: u,
		GM_listValues: c,
		GM_addStyle: d,
		GM_notification: p,
		GM_setClipboard: f,
		GM_xmlhttpRequest: function (e) {
			const { abortController: t } = y(e);
			if (!e || "object" != typeof e)
				throw new TypeError(
					"Invalid details passed to GM_xmlHttpRequest"
				);
			return { abort: () => t.abort() };
		},
		unsafeWindow: e,
	}).forEach(([o, r]) => {
		t.defineProperty(e, o, {
			value: r,
			writable: !1,
			enumerable: !0,
			configurable: !1,
		});
	});
})(window, Object, DOMException, AbortController, Promise, localStorage);